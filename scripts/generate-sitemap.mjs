// Writes public/sitemap.xml from the public route list, the country directory and the
// Field Registry. Run with `npm run sitemap` after adding public routes or registry records.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.asebsociety.org";
const staticPaths = [
  "/", "/why-aseb", "/about/story", "/people", "/governance", "/progress", "/invest", "/what-we-build",
  "/summit", "/communities", "/learning", "/field-lab", "/registry", "/countries", "/country-partners",
  "/ambassadors", "/field", "/discover", "/stories", "/evidence", "/insights", "/framework", "/climate", "/sdgs",
  "/join", "/get-involved", "/partners", "/collaborate", "/work-with-us", "/funders", "/registry/submit",
  "/the-field", "/voices", "/playbook", "/ask", "/state-of-the-field", "/community-guidelines",
];
// Published community items are dynamic and are listed once a database-backed sitemap route exists.
const countriesSource = readFileSync(path.join(root, "src/content/countries.ts"), "utf8");
const countryNames = [...countriesSource.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const slugify = (name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const products = readFileSync(path.join(root, "src/content/products.ts"), "utf8");
const playbookSlugs = [...products.matchAll(/\{ slug: "([a-z0-9-]+)", title:/g)].map((m) => m[1]);
const registry = JSON.parse(readFileSync(path.join(root, "src/content/registry.json"), "utf8"));
const field = readFileSync(path.join(root, "src/content/field.ts"), "utf8");
const constituencies = [...field.matchAll(/slug: "([a-z-]+)",\n\s+n?/g)].map((m) => m[1]).filter((s) => ["practitioners", "support-institutions", "capital-market-builders", "systems-builders"].includes(s));

const paths = [
  ...staticPaths,
  ...[...new Set(constituencies)].map((slug) => `/field/${slug}`),
  ...countryNames.map((name) => `/countries/${slugify(name)}`),
  "/countries/mayotte",
  ...playbookSlugs.map((slug) => `/playbook/${slug}`),
  ...registry.map((record) => `/registry/${record.slug}`),
];
const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)].map((p) => `  <url><loc>${escape(origin + p)}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(path.join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${new Set(paths).size} URLs`);
