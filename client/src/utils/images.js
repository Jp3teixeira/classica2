import IMAGE_MANIFEST from '../data/imageManifest';

/**
 * Utilitários de imagem partilhados.
 *
 * Vivem fora de SmartImage.jsx para que esse ficheiro exporte apenas o
 * componente — requisito do Fast Refresh do Vite.
 */

/** '/imagens/X/Y.jpg' → '/imagens/X/Y' (chave do manifesto) */
export function toImageKey(src) {
    return String(src || '').replace(/\.[a-zA-Z0-9]+$/, '');
}

/** Entrada do manifesto: { w, h, s: [larguras] } ou undefined. */
export function imageEntry(src) {
    return IMAGE_MANIFEST[toImageKey(src)];
}

/** Maior variante disponível — usada pelo lightbox. */
export function largestSrc(src) {
    const entry = imageEntry(src);
    if (!entry) return src;
    return `${toImageKey(src)}-${entry.s[entry.s.length - 1]}.webp`;
}

/** Proporção largura/altura da imagem, ou null se desconhecida. */
export function aspectOf(src) {
    const entry = imageEntry(src);
    return entry ? entry.w / entry.h : null;
}

/** srcset para um formato: "base-400.avif 400w, base-900.avif 900w" */
export function buildSrcSet(src, ext) {
    const entry = imageEntry(src);
    if (!entry) return '';
    const key = toImageKey(src);
    return entry.s.map((w) => `${key}-${w}.${ext} ${w}w`).join(', ');
}
