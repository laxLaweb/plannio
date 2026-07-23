/**
 * Post-build prerender for AI crawlers that do not execute JavaScript.
 * Runs automatically on Heroku via heroku-postbuild after vite build.
 *
 * Set SKIP_PRERENDER=1 to skip (e.g. local quick builds).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "client", "dist");
const port = 5199;

import { PRERENDER_PATHS } from "./public-routes.mjs";

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // server not ready yet
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Server did not start within ${timeoutMs}ms`));
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

function startServer() {
  return spawn("node", ["server/index.js"], {
    cwd: rootDir,
    env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

function outputPathForRoute(route) {
  if (route === "/") return path.join(distDir, "index.html");
  const clean = route.replace(/^\//, "");
  return path.join(distDir, clean, "index.html");
}

async function launchBrowser() {
  // Heroku / Linux CI: bundled Chromium via @sparticuz/chromium
  if (process.platform === "linux") {
    const puppeteer = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium");
    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  }

  // Local dev (Windows/macOS): full puppeteer with its own Chrome
  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({ headless: true });
}

async function prerenderRoute(page, route) {
  const url = `http://127.0.0.1:${port}${route}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForSelector("#root > *", { timeout: 20000 });

  const html = await page.content();
  const outPath = outputPathForRoute(route);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`Prerendered ${route} -> ${path.relative(rootDir, outPath)}`);
}

async function main() {
  if (process.env.SKIP_PRERENDER === "1") {
    console.log("prerender: SKIP_PRERENDER=1, skipping.");
    return;
  }

  if (!fs.existsSync(distDir)) {
    throw new Error("client/dist not found. Run `npm run build` first.");
  }

  const server = startServer();
  let browser;
  try {
    await waitForServer(`http://127.0.0.1:${port}/`);
    browser = await launchBrowser();

    // Fresh page per route so React-hoisted <head> tags from route A do not leak into route B.
    for (const route of PRERENDER_PATHS) {
      const page = await browser.newPage();
      try {
        await prerenderRoute(page, route);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("prerender failed:", error.message);
  process.exit(1);
});
