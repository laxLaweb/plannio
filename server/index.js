const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });

const { createSessionMiddleware } = require("./auth/session");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const pollsRoutes = require("./routes/polls");
const integrationsRoutes = require("./routes/integrations");
const publicRoutes = require("./routes/public");
const { processPendingReminders } = require("./polls/reminders");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

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

  // redirect: false stops express.static from 301-redirecting /discord-scheduling
  // to /discord-scheduling/ — the fallback below serves the prerendered file directly.
  app.use(express.static(clientDist, { redirect: false }));

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
}
