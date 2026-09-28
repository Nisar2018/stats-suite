/**
 * Generate public/sitemap.xml from menu configs + static pages.
 * Usage: node scripts/generate-sitemap.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { menuSections } from '../src/data/menuConfig.js';
import { dispersionMenuSections } from '../src/data/dispersionMenuConfig.js';
import { representationMenuSections } from '../src/data/representationMenuConfig.js';
import { probabilityMenuSections } from '../src/data/probabilityMenuConfig.js';
import { mathCalculatorMenuSections } from '../src/data/mathCalculatorMenuConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://mystatcalculator.com';
const outPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');

function collectLeafIds(sections) {
  return sections.flatMap((section) => [
    ...(section.items ?? []).map((item) => item.id),
    ...(section.subsections?.flatMap((sub) => (sub.items ?? []).map((item) => item.id)) ?? []),
  ]);
}

function urlEntry(locPath, { changefreq = 'weekly', priority = '0.7', lastmod } = {}) {
  const loc = locPath === '/' ? `${ORIGIN}/` : `${ORIGIN}${locPath}`;
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

const lastmod = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  ...collectLeafIds(mathCalculatorMenuSections).map((id) => ({
    path: `/${id}`,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms', changefreq: 'monthly', priority: '0.3' },
];

const sections = [
  ['central-tendency', menuSections],
  ['measurement-of-dispersion', dispersionMenuSections],
  ['probability', probabilityMenuSections],
  ['representation-of-data', representationMenuSections],
];

const topicUrls = [];
for (const [pageId, menu] of sections) {
  for (const topicId of collectLeafIds(menu)) {
    topicUrls.push({
      path: `/${pageId}/${topicId}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }
}

const all = [...staticPages, ...topicUrls];
const seen = new Set();
const unique = all.filter((u) => {
  if (seen.has(u.path)) return false;
  seen.add(u.path);
  return true;
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...unique.map((u) =>
    urlEntry(u.path, { changefreq: u.changefreq, priority: u.priority, lastmod }),
  ),
  '</urlset>',
  '',
].join('\n');

await fs.writeFile(outPath, xml, 'utf8');
console.log(`Wrote ${unique.length} URLs to ${outPath}`);
