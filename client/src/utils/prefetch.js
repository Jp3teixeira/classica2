import { resolveRoute, getAllProductsCategory, getCategories, getProductImages, ALL_SLUG } from '../data/navigation';
import { buildSrcSet, toImageKey, imageEntry } from './images';

/**
 * Pré-carregamento de fotografias.
 *
 * Sem isto, a janela do Finder abria depressa mas os cartões ficavam vazios
 * durante meio segundo ou mais (em 4G) enquanto as fotos chegavam, e era isso
 * que se sentia como "lento". Agora as fotos começam a descarregar:
 *
 *   1. quando o rato passa por cima de um link, ou o dedo toca nele, ANTES do
 *      clique (ganha 100 a 300 ms, o tempo entre tocar e soltar);
 *   2. em segundo plano, depois de a página inicial ter carregado, para as
 *      primeiras fotos de cada categoria. Isto não acontece com poupança de
 *      dados ativa nem em ligações 2G.
 *
 * As fotos são pedidas com um <picture> escondido, com os MESMOS srcset e
 * sizes que a grelha e a galeria usam. Assim o browser escolhe sozinho o
 * formato (AVIF ou WebP) e a largura, exatamente como faria no ecrã, e o
 * ficheiro descarregado é o mesmo que depois é mostrado (sai da cache).
 */

/** Têm de coincidir com os `sizes` de ProductGrid.jsx e Gallery.jsx. */
export const GRID_SIZES = '(max-width: 480px) 46vw, (max-width: 900px) 30vw, 240px';
export const GALLERY_SIZES = '(max-width: 900px) 92vw, 640px';

const GRID_COUNT = 8;
const WARMUP_COUNT = 4;

const requested = new Set();
let container = null;

function getContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    // Fora do ecrã, mas não display:none: o browser tem de calcular o srcset.
    container.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    document.body.appendChild(container);
    return container;
}

function prefetchImage(src, sizes) {
    if (typeof document === 'undefined' || !imageEntry(src)) return;
    const key = `${toImageKey(src)}|${sizes}`;
    if (requested.has(key)) return;
    requested.add(key);

    const picture = document.createElement('picture');
    for (const ext of ['avif', 'webp']) {
        const source = document.createElement('source');
        source.type = `image/${ext}`;
        source.srcset = buildSrcSet(src, ext);
        source.sizes = sizes;
        picture.appendChild(source);
    }
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    const done = () => picture.remove();
    img.onload = done;
    img.onerror = done;
    picture.appendChild(img);
    // O src só é posto depois das <source>: é a ordem que o browser espera.
    img.src = `${toImageKey(src)}-${imageEntry(src).s[0]}.webp`;
    getContainer().appendChild(picture);
}

function prefetchGrid(products, count = GRID_COUNT) {
    for (const product of products.slice(0, count)) {
        const [first] = getProductImages(product);
        if (first) prefetchImage(first.src, GRID_SIZES);
    }
}

/** Pré-carrega o que a página `pathname` vai mostrar primeiro. */
export function prefetchPath(pathname) {
    const [categorySlug, subcategorySlug, productSlug] = String(pathname || '')
        .split(/[?#]/)[0].split('/').filter(Boolean);
    if (!categorySlug) return;

    if (categorySlug === ALL_SLUG) {
        prefetchGrid(getAllProductsCategory().subcategories[0].products);
        return;
    }

    const { ok, subcategory, product } = resolveRoute({ categorySlug, subcategorySlug, productSlug });
    if (!ok) return;
    if (product) {
        const [first] = getProductImages(product);
        if (first) prefetchImage(first.src, GALLERY_SIZES);
    } else if (subcategory) {
        prefetchGrid(subcategory.products);
    }
}

function linkPath(target) {
    const link = target instanceof Element ? target.closest('a[href]') : null;
    if (!link || link.origin !== window.location.origin) return null;
    return link.pathname;
}

function canWarmUp() {
    const connection = navigator.connection;
    if (!connection) return true;
    return !connection.saveData && !/(^|-)2g$/.test(connection.effectiveType || '');
}

/**
 * Liga o pré-carregamento ao documento inteiro (por delegação, para cobrir
 * todos os links: MenuBar, Dock, TabBar, sidebar, cartões de produto).
 * Devolve a função de limpeza.
 */
export function installPrefetch() {
    if (typeof window === 'undefined') return () => {};

    const onIntent = (event) => {
        const path = linkPath(event.target);
        if (path) prefetchPath(path);
    };
    const opts = { passive: true, capture: true };
    document.addEventListener('pointerover', onIntent, opts);
    document.addEventListener('touchstart', onIntent, opts);
    document.addEventListener('focusin', onIntent, opts);

    // Aquecimento em segundo plano: espera que a animação de entrada da página
    // inicial acabe e que o browser esteja livre.
    let idleId;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const timer = setTimeout(() => {
        if (!canWarmUp()) return;
        idleId = idle(() => {
            for (const category of getCategories()) {
                prefetchGrid(category.subcategories[0]?.products || [], WARMUP_COUNT);
            }
        });
    }, 2500);

    return () => {
        document.removeEventListener('pointerover', onIntent, opts);
        document.removeEventListener('touchstart', onIntent, opts);
        document.removeEventListener('focusin', onIntent, opts);
        clearTimeout(timer);
        if (idleId) cancelIdle(idleId);
    };
}
