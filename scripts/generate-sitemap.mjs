/**
 * Regenerate client/public/sitemap.xml from scripts/public-routes.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES, SITE_URL } from "./public-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "client", "public", "sitemap.xml");
const lastmod = new Date().toISOString().slice(0, 10);

const urls = PUBLIC_ROUTES.map(
  (route) => `  <url>
    <loc>${SITE_URL}${route.path === "/" ? "/" : route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(outPath, xml, "utf8");
console.log(`generate-sitemap: wrote ${PUBLIC_ROUTES.length} URLs to ${path.relative(process.cwd(), outPath)}`);
