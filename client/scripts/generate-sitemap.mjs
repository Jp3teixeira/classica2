/**
 * Gera public/sitemap.xml a partir dos dados do catálogo.
 *
 * Antes existia um sitemap com um único URL, mantido à mão — que era correto,
 * porque não existiam mais URLs. Com a navegação por rotas, cada categoria,
 * subcategoria e produto tem um endereço próprio e indexável.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.classicaag.pt';

const { getAllPaths } = await import('../src/data/navigation.js');

const today = new Date().toISOString().slice(0, 10);
const paths = getAllPaths();

/** Prioridade por profundidade: home > categoria > subcategoria > produto. */
function priorityFor(urlPath) {
    const depth = urlPath.split('/').filter(Boolean).length;
    return ['1.0', '0.9', '0.8', '0.7'][depth] || '0.6';
}

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
        .map(
            (urlPath) => `  <url>
    <loc>${SITE}${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priorityFor(urlPath)}</priority>
  </url>`
        )
        .join('\n')}
</urlset>
`;

await fs.writeFile(path.join(ROOT, 'public', 'sitemap.xml'), body, 'utf8');
console.log(`\n  ✓ sitemap.xml gerado com ${paths.length} URLs\n`);
