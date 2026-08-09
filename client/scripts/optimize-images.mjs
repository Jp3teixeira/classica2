/**
 * Pipeline de otimização de imagens — Clássica Artes Gráficas
 * ============================================================
 *
 * Lê os ficheiros originais (grandes, direto de câmara) de:
 *     client/assets-source/imagens/
 *
 * e gera derivados otimizados para a web em:
 *     client/public/imagens/
 *
 * Para cada imagem gera AVIF + WebP em 3 larguras (400 / 900 / 1800 px),
 * nunca ampliando acima da largura original. Também escreve um manifesto
 * (src/data/imageManifest.js) com as dimensões intrínsecas e as larguras
 * disponíveis — usado pelo componente <SmartImage> para emitir width/height
 * e srcset corretos (evita layout shift).
 *
 * COMO USAR
 * ---------
 *   1. Coloca a fotografia original em client/assets-source/imagens/PASTA/
 *   2. cd client && npm run images
 *   3. Referencia em products.js como '/imagens/PASTA/nome.jpg'
 *      (a extensão é ignorada — o <SmartImage> escolhe o formato)
 *
 * NOTAS
 * -----
 *  - Os originais NÃO são publicados (assets-source/ está fora de public/),
 *    o que mantém o deploy leve. São a fonte de verdade para regenerar.
 *  - Imagens em CMYK (comuns em artes gráficas) são convertidas para sRGB.
 *  - Nomes de ficheiro são normalizados: sem acentos, sem parênteses.
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'assets-source', 'imagens');
const OUT_DIR = path.join(ROOT, 'public', 'imagens');
const MANIFEST = path.join(ROOT, 'src', 'data', 'imageManifest.js');

/** Larguras geradas. 400 = miniatura da grelha, 900 = detalhe, 1800 = lightbox. */
const WIDTHS = [400, 900, 1800];

/** Ficheiros que existem nos originais mas não são usados pelo site. */
const SKIP = new Set([
    'Livros/Capa_Mole/Livro_Dialogos_resumo_M.jpg', // produto removido (commit 551f534)
    'Logos/classica2.png',                          // logótipo alternativo não utilizado
]);

// effort baixo de propósito: em máquinas modestas o AVIF com effort alto leva
// minutos por imagem e o ganho de tamanho é de poucos por cento. 4:4:4 mantém-se
// porque as fotografias mostram texto impresso, onde a resolução de cor conta.
const AVIF = { quality: 56, effort: 2, chromaSubsampling: '4:4:4' };
const WEBP = { quality: 80, effort: 4 };

/** Passa a `true` (ou `npm run images -- --force`) para reprocessar tudo. */
const FORCE = process.argv.includes('--force');

/**
 * Verdadeiro só se o ficheiro existir E for uma imagem legível — assim uma
 * execução interrompida a meio de uma codificação não deixa um ficheiro
 * truncado a ser reaproveitado silenciosamente.
 */
async function isValidImage(p) {
    try {
        await fs.access(p);
        await sharp(p).metadata();
        return true;
    } catch {
        return false;
    }
}

/** Remove acentos e caracteres problemáticos em URLs, preservando a legibilidade. */
function normalizeName(name) {
    return name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[()]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_');
}

async function walk(dir, base = '') {
    const out = [];
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const rel = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) out.push(...await walk(path.join(dir, entry.name), rel));
        else if (/\.(jpe?g|png|webp|tiff?)$/i.test(entry.name)) out.push(rel);
    }
    return out.sort();
}

async function run() {
    const files = await walk(SRC_DIR);
    const manifest = {};
    let srcBytes = 0, outBytes = 0, generated = 0, skipped = 0;

    for (const rel of files) {
        if (SKIP.has(rel)) { skipped++; continue; }

        const abs = path.join(SRC_DIR, rel);
        const dir = path.dirname(rel);
        const stem = normalizeName(path.basename(rel, path.extname(rel)));
        const outSubdir = path.join(OUT_DIR, dir);
        await fs.mkdir(outSubdir, { recursive: true });

        const input = sharp(abs, { failOn: 'error' });
        const meta = await input.metadata();
        const isCmyk = meta.space === 'cmyk';
        srcBytes += (await fs.stat(abs)).size;

        // Larguras a gerar: nunca ampliar acima do original.
        const widths = WIDTHS.filter(w => w <= meta.width);
        if (widths.length === 0 || widths[widths.length - 1] < meta.width) {
            // garante que existe sempre a resolução máxima disponível
            widths.push(Math.min(meta.width, WIDTHS[WIDTHS.length - 1]));
        }
        const finalWidths = [...new Set(widths)].sort((a, b) => a - b);

        let reused = 0;
        for (const w of finalWidths) {
            const avifPath = path.join(outSubdir, `${stem}-${w}.avif`);
            const webpPath = path.join(outSubdir, `${stem}-${w}.webp`);

            if (!FORCE && await isValidImage(avifPath) && await isValidImage(webpPath)) {
                reused += 2;
            } else {
                const pipeline = sharp(abs, { failOn: 'error' })
                    .toColorspace('srgb')            // CMYK/gray -> sRGB
                    .resize({ width: w, withoutEnlargement: true, fit: 'inside' });

                await pipeline.clone().avif(AVIF).toFile(avifPath);
                await pipeline.clone().webp(WEBP).toFile(webpPath);
                generated += 2;
            }
            outBytes += (await fs.stat(avifPath)).size + (await fs.stat(webpPath)).size;
        }

        const key = `/imagens/${dir}/${stem}`;
        manifest[key] = { w: meta.width, h: meta.height, s: finalWidths };

        console.log(
            `  ${rel.padEnd(62)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}` +
            `${isCmyk ? ' [CMYK->sRGB]' : ''} -> ${finalWidths.join('/')}` +
            `${reused > 0 ? ` (${reused} reutilizados)` : ''}`
        );
    }

    const body = `/**
 * GERADO AUTOMATICAMENTE por scripts/optimize-images.mjs — não editar à mão.
 *
 * Chave  = caminho da imagem sem extensão nem sufixo de largura.
 * w / h  = dimensões intrínsecas do original (para width/height e aspect-ratio).
 * s      = larguras disponíveis em disco (AVIF + WebP).
 */
const IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 4).replace(/"([^"]+)":/g, '"$1":')};

export default IMAGE_MANIFEST;
`;
    await fs.writeFile(MANIFEST, body, 'utf8');

    const mb = n => (n / 1048576).toFixed(2);
    console.log(`\n  originais:  ${mb(srcBytes)} MB em ${files.length - skipped} ficheiros (${skipped} ignorados)`);
    console.log(`  derivados:  ${mb(outBytes)} MB em ${generated} ficheiros`);
    console.log(`  redução:    ${(100 - (outBytes / srcBytes) * 100).toFixed(1)}%`);
    console.log(`  manifesto:  ${path.relative(ROOT, MANIFEST)} (${Object.keys(manifest).length} entradas)\n`);
}

run().catch(err => { console.error(err); process.exit(1); });
