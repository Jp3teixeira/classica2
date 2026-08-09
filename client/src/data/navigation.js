/**
 * Camada de navegação — traduz entre URLs e os dados de categories.js / products.js.
 *
 * Objetivo: manter products.js e categories.js exactamente tão simples de editar
 * como eram (sem ids de rota, sem slugs escritos à mão). Tudo o que a navegação
 * por URL precisa é derivado aqui.
 *
 * Formato dos URLs:
 *     /                                          → landing
 *     /livros                                    → categoria (abre 1ª subcategoria)
 *     /livros/capa-dura                          → subcategoria
 *     /livros/capa-dura/gps-peregrino            → produto
 *
 * Os slugs de subcategoria são o id sem o prefixo da categoria
 * ('livros-capa-dura' → 'capa-dura'). Os slugs de produto derivam do nome.
 * O id do produto continua a funcionar como slug alternativo, para que links
 * antigos ou partilhados nunca deixem de resolver.
 */

// Extensões explícitas: este módulo também é importado pelos scripts de build
// que correm em Node puro, onde a resolução sem extensão não existe.
import CATEGORIES from './categories.js';
import { getProducts } from './products.js';

/** 'Calendários de Secretária' → 'calendarios-de-secretaria' */
export function slugify(text) {
    return String(text)
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // remove acentos
        .replace(/[^a-zA-Z0-9]+/g, '-')                     // separadores
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

/** 'livros-capa-dura' na categoria 'livros' → 'capa-dura' */
function subSlug(categoryId, subId) {
    return subId.startsWith(`${categoryId}-`) ? subId.slice(categoryId.length + 1) : subId;
}

/**
 * Índice de navegação construído uma vez no arranque.
 * Estrutura plana e imutável — barata de consultar em qualquer render.
 */
const INDEX = CATEGORIES.map((category) => {
    const subcategories = (category.subcategories || []).map((sub) => {
        const products = getProducts(category.id, sub.id).map((product) => ({
            ...product,
            slug: slugify(product.name),
        }));
        return {
            ...sub,
            slug: subSlug(category.id, sub.id),
            products,
        };
    });
    return { ...category, slug: category.id, subcategories };
});

export const NAV = INDEX;

/** Todas as categorias, na ordem de apresentação. */
export function getCategories() {
    return INDEX;
}

/** Resolve uma categoria por slug (== id). Devolve null se não existir. */
export function findCategory(categorySlug) {
    if (!categorySlug) return null;
    return INDEX.find((c) => c.slug === categorySlug) || null;
}

/**
 * Resolve subcategoria dentro de uma categoria.
 * Sem slug devolve a primeira (comportamento de /categoria).
 */
export function findSubcategory(category, subSlugParam) {
    if (!category) return null;
    if (!subSlugParam) return category.subcategories[0] || null;
    return category.subcategories.find((s) => s.slug === subSlugParam) || null;
}

/** Resolve produto por slug do nome ou, em alternativa, pelo id. */
export function findProduct(subcategory, productSlug) {
    if (!subcategory || !productSlug) return null;
    return (
        subcategory.products.find((p) => p.slug === productSlug) ||
        subcategory.products.find((p) => p.id === productSlug) ||
        null
    );
}

/**
 * Resolve os três parâmetros de rota de uma vez.
 * `ok` é falso quando algum segmento do URL não corresponde a nada —
 * é isso que distingue "URL válido" de "404 real".
 */
export function resolveRoute({ categorySlug, subcategorySlug, productSlug }) {
    const category = findCategory(categorySlug);
    if (categorySlug && !category) return { ok: false, category: null, subcategory: null, product: null };

    const subcategory = findSubcategory(category, subcategorySlug);
    if (subcategorySlug && !subcategory) return { ok: false, category, subcategory: null, product: null };

    const product = productSlug ? findProduct(subcategory, productSlug) : null;
    if (productSlug && !product) return { ok: false, category, subcategory, product: null };

    return { ok: true, category, subcategory, product };
}

/** Constrói o caminho canónico para qualquer nível da hierarquia. */
export function buildPath(category, subcategory, product) {
    if (!category) return '/';
    let path = `/${category.slug}`;
    if (subcategory) path += `/${subcategory.slug}`;
    if (product) path += `/${product.slug}`;
    return path;
}

/** Lista plana de todos os URLs canónicos — usada para gerar o sitemap. */
export function getAllPaths() {
    const paths = ['/'];
    for (const category of INDEX) {
        paths.push(buildPath(category));
        for (const sub of category.subcategories) {
            paths.push(buildPath(category, sub));
            for (const product of sub.products) {
                paths.push(buildPath(category, sub, product));
            }
        }
    }
    return paths;
}

/**
 * Normaliza a forma como as imagens de um produto são declaradas.
 * products.js aceita `image: '...'` (1 foto) ou `images: [{ src, label }]` (galeria);
 * o resto da aplicação só lida com o formato de array.
 */
export function getProductImages(product) {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images.filter((img) => img && img.src);
    }
    if (product.image) return [{ src: product.image, label: null }];
    return [];
}
