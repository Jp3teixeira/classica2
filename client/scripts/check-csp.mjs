/**
 * Verifica que a Content-Security-Policy de vercel.json continua a cobrir os
 * scripts inline do HTML gerado. Corre depois do build (`postbuild`).
 *
 * Porquê: a CSP usa `script-src 'self' 'sha256-...'` em vez de 'unsafe-inline'.
 * O único script inline do site é o bloco de dados estruturados (schema.org) do
 * index.html. Se esse bloco for editado, o hash deixa de corresponder e o
 * Google podia perder os dados estruturados sem qualquer aviso.
 *
 * Este script transforma essa falha silenciosa numa falha de build explícita,
 * com o hash correto pronto a colar.
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'dist', 'index.html');
const VERCEL = path.join(ROOT, 'vercel.json');

if (!fs.existsSync(HTML)) {
    console.error('  ✗ dist/index.html não existe — correr o build primeiro.');
    process.exit(1);
}

const html = fs.readFileSync(HTML, 'utf8');
const config = JSON.parse(fs.readFileSync(VERCEL, 'utf8'));

const csp = config.headers
    ?.flatMap((h) => h.headers)
    ?.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value;

if (!csp) {
    console.error('  ✗ vercel.json não define Content-Security-Policy.');
    process.exit(1);
}

// Scripts inline = <script> sem atributo src
const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]);

const missing = [];
for (const content of inlineScripts) {
    const hash = `sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}`;
    if (!csp.includes(hash)) missing.push({ hash, preview: content.trim().slice(0, 60).replace(/\s+/g, ' ') });
}

if (missing.length > 0) {
    console.error(`\n  ✗ CSP desatualizada: ${missing.length} script inline sem hash correspondente.\n`);
    for (const { hash, preview } of missing) {
        console.error(`    script: ${preview}…`);
        console.error(`    hash:   '${hash}'\n`);
    }
    console.error('  Acrescente o(s) hash(es) acima a "script-src" em client/vercel.json.\n');
    process.exit(1);
}

console.log(`  ✓ CSP cobre os ${inlineScripts.length} script(s) inline\n`);
