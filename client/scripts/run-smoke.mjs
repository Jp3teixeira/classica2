/**
 * Corre o teste funcional (scripts/smoke-test.jsx).
 *
 * O Node não executa JSX, e a aplicação é JSX — por isso o teste é primeiro
 * empacotado com o esbuild (que já vem com o Vite) e só depois executado.
 * Evita instalar um test runner completo para uma suite de um ficheiro.
 *
 * Uso:
 *   npm test                    corre tudo
 *   npm test -- rotas,404       corre só essas secções
 *                               (secções: rotas 404 alcance a11y imagens mobile seo)
 *
 * Nota: cada rota monta uma árvore React completa. Em máquinas com pouca
 * memória, correr por secções.
 */

import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'node_modules', '.cache');
const OUT = path.join(OUT_DIR, 'smoke-test.mjs');

await fs.mkdir(OUT_DIR, { recursive: true });

await build({
    entryPoints: [path.join(ROOT, 'scripts', 'smoke-test.jsx')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    outfile: OUT,
    jsx: 'automatic',
    loader: { '.jsx': 'jsx' },
    // Mantém as dependências fora do bundle para que resolvam de node_modules
    external: ['jsdom', 'react', 'react-dom', 'react-dom/client', 'react-router-dom', 'framer-motion'],
    logLevel: 'warning',
});

const child = spawn(process.execPath, [OUT, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: ROOT,
});

child.on('exit', (code) => process.exit(code ?? 1));
