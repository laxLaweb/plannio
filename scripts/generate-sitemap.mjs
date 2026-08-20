/**
 * Regenerate client/public/sitemap_new.xml from scripts/public-routes.mjs.
 *
 * Canonical sitemap for this project is sitemap_new.xml — Google Search Console
 * cached a failed fetch against /sitemap.xml, so that filename is not used.
 * sitemap_index.xml points at sitemap_new.xml. /sitemap.xml 301s to
 * /sitemap_new.xml in the server so old submissions still resolve.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES, SITE_URL } from "./public-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "client", "public");
const outPath = path.join(publicDir, "sitemap_new.xml");
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
    <loc>${SITE_URL}/sitemap_new.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`;

fs.writeFileSync(outPath, xml, "utf8");
fs.writeFileSync(indexOutPath, indexXml, "utf8");
console.log(`generate-sitemap: wrote ${PUBLIC_ROUTES.length} URLs to ${path.relative(process.cwd(), outPath)}`);
console.log(`generate-sitemap: wrote ${path.relative(process.cwd(), indexOutPath)}`);
