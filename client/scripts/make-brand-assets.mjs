/**
 * Gera os ativos de marca a partir do logótipo original:
 *
 *   public/favicon-32.png       ícone do separador
 *   public/favicon-192.png      Android / PWA
 *   public/apple-touch-icon.png ecrã principal do iOS (180x180)
 *   public/og-image.jpg         pré-visualização em redes sociais (1200x630)
 *
 * Motivo: o favicon anterior era um JPEG de 1024x1024 (55 KB) declarado como
 * PNG de 48x48, e a imagem de partilha era o logótipo em 1686x418 — proporção
 * 4:1 declarada como `summary_large_image`, que espera ~1.91:1. Resultado:
 * pré-visualizações cortadas e um ícone desnecessariamente pesado.
 *
 * Correr com: node scripts/make-brand-assets.mjs
 */

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = path.join(ROOT, 'assets-source', 'imagens', 'Logos', 'logo_white.jpg'); // é PNG com alfa
const PUBLIC = path.join(ROOT, 'public');
const BG = { r: 245, g: 245, b: 247, alpha: 1 }; // --surface-muted

// ── Favicons: logótipo sobre fundo claro, em quadrado ────────────────────────
for (const size of [32, 192]) {
    const logo = await sharp(LOGO)
        .resize({ width: Math.round(size * 0.86), fit: 'inside' })
        .toBuffer();

    await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
        .composite([{ input: logo, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toFile(path.join(PUBLIC, `favicon-${size}.png`));
}

const appleLogo = await sharp(LOGO).resize({ width: 156, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: BG } })
    .composite([{ input: appleLogo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

// ── Imagem Open Graph 1200x630 ───────────────────────────────────────────────
const ogLogo = await sharp(LOGO).resize({ width: 760, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 240, g: 240, b: 243 } } })
    .composite([{ input: ogLogo, gravity: 'center' }])
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og-image.jpg'));

console.log('  ✓ favicon-32.png, favicon-192.png, apple-touch-icon.png, og-image.jpg\n');
