const fs = require("fs");
const path = require("path");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config({ override: true });

const { createSessionMiddleware } = require("./auth/session");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const pollsRoutes = require("./routes/polls");
const integrationsRoutes = require("./routes/integrations");
const publicRoutes = require("./routes/public");
const { processPendingReminders } = require("./polls/reminders");
const { deleteExpiredPolls } = require("./polls/retention");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(compression());

app.use(
  cors({
    origin: isProduction ? false : process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(createSessionMiddleware());
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollsRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/p", publicRoutes);
app.use("/api", apiRoutes);

if (isProduction) {
  const clientDist = path.join(__dirname, "..", "client", "dist");

  app.use((req, res, next) => {
    const host = req.headers.host;
    if (host && host.startsWith("www.")) {
      return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
    }
    if (req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }
    next();
  });

  // Security headers. COOP is deliberately omitted: it needs careful testing
  // with the Discord/Slack OAuth popup flows before it can be enabled.
  // CSP runs in Report-Only mode first, so the OAuth flows can be verified
  // against real traffic before the policy is enforced.
  app.use((_req, res, next) => {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader(
      "Content-Security-Policy-Report-Only",
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://cdn.discordapp.com https://*.slack-edge.com",
        "connect-src 'self'",
        "frame-ancestors 'self'",
      ].join("; "),
    );
    next();
  });

  // redirect: false stops express.static from 301-redirecting /discord-scheduling
  // to /discord-scheduling/ — the fallback below serves the prerendered file directly.
  // Vite fingerprints everything under /assets, so those files can be cached forever;
  // HTML and other root files stay at max-age=0 so deploys take effect immediately.
  app.use(
    express.static(clientDist, {
      redirect: false,
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  app.get("*", (req, res) => {
    const urlPath = req.path.replace(/\/$/, "") || "";
    if (urlPath) {
      const prerendered = path.join(clientDist, urlPath, "index.html");
      if (fs.existsSync(prerendered)) {
        return res.sendFile(prerendered);
      }
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});

if (process.env.DATABASE_URL) {
  const REMINDER_INTERVAL_MS = 5 * 60 * 1000;
  const runReminders = () =>
    processPendingReminders().catch((error) => {
      console.error("Reminder scheduler failed:", error.message);
    });

  runReminders();
  setInterval(runReminders, REMINDER_INTERVAL_MS);

  // GDPR: dagligt oprydningsjob der sletter polls uden aktivitet i 12 måneder.
  const RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000;
  const runRetention = () =>
    deleteExpiredPolls().catch((error) => {
      console.error("Retention job failed:", error.message);
    });

  runRetention();
  setInterval(runRetention, RETENTION_INTERVAL_MS);
}
