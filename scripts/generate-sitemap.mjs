/**
 * Regenerate client/public/sitemap.xml from scripts/public-routes.mjs.
 *
 * Also writes sitemap_index.xml pointing at it. Search Console caches a failed
 * fetch against the exact URL submitted, so having a second valid entry point
 * makes it possible to resubmit without that history.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES, SITE_URL } from "./public-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "client", "public");
const outPath = path.join(publicDir, "sitemap.xml");
const indexOutPath = path.join(publicDir, "sitemap_index.xml");
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

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`;

fs.writeFileSync(outPath, xml, "utf8");
fs.writeFileSync(indexOutPath, indexXml, "utf8");
console.log(`generate-sitemap: wrote ${PUBLIC_ROUTES.length} URLs to ${path.relative(process.cwd(), outPath)}`);
console.log(`generate-sitemap: wrote ${path.relative(process.cwd(), indexOutPath)}`);
