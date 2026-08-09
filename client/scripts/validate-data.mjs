/**
 * Validação do catálogo — corre antes do build (`prebuild`).
 *
 * products.js é editado à mão e não existe CMS: sem esta verificação, o único
 * mecanismo de deteção de erro era o site em produção. Falha o build quando:
 *
 *   - dois produtos têm o mesmo id
 *   - falta um campo obrigatório
 *   - um produto declara `image` e `images` ao mesmo tempo
 *   - `images` é um array vazio
 *   - uma imagem referenciada não existe em public/imagens (nenhuma variante)
 *   - uma categoria/subcategoria declarada não tem correspondência nos dados
 *   - dois produtos da mesma subcategoria geram o mesmo slug de URL
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { default: CATEGORIES } = await import('../src/data/categories.js');
const { default: PRODUCTS } = await import('../src/data/products.js');
const { NAV, getProductImages, slugify } = await import('../src/data/navigation.js');
const { default: MANIFEST } = await import('../src/data/imageManifest.js');

const errors = [];
const warnings = [];

// ── Coerência entre categories.js e products.js ──────────────────────────────
const categoryIds = new Set(CATEGORIES.map((c) => c.id));
for (const key of Object.keys(PRODUCTS)) {
    if (!categoryIds.has(key)) errors.push(`PRODUCTS tem a chave "${key}" sem categoria correspondente em categories.js`);
}
for (const category of CATEGORIES) {
    const declared = new Set((category.subcategories || []).map((s) => s.id));
    for (const key of Object.keys(PRODUCTS[category.id] || {})) {
        if (!declared.has(key)) errors.push(`"${category.id}" → subcategoria "${key}" existe em products.js mas não está declarada em categories.js`);
    }
}

// ── Produtos ────────────────────────────────────────────────────────────────
const seenIds = new Map();

for (const category of NAV) {
    for (const sub of category.subcategories) {
        if (sub.products.length === 0) {
            warnings.push(`"${category.name} › ${sub.name}" não tem produtos — vai mostrar o estado vazio`);
        }

        const slugs = new Map();
        for (const product of sub.products) {
            const where = `${category.id}/${sub.id}/${product.id}`;

            if (seenIds.has(product.id)) errors.push(`id duplicado "${product.id}": ${seenIds.get(product.id)} e ${where}`);
            else seenIds.set(product.id, where);

            for (const field of ['id', 'name', 'description']) {
                if (!product[field] || String(product[field]).trim() === '') errors.push(`${where}: falta o campo obrigatório "${field}"`);
            }

            if (product.image && product.images) errors.push(`${where}: declara "image" e "images" ao mesmo tempo — usar apenas um`);
            if (product.images && (!Array.isArray(product.images) || product.images.length === 0)) errors.push(`${where}: "images" tem de ser um array não vazio`);

            const images = getProductImages(product);
            if (images.length === 0) errors.push(`${where}: sem qualquer imagem`);

            for (const img of images) {
                const key = String(img.src).replace(/\.[a-zA-Z0-9]+$/, '');
                const entry = MANIFEST[key];
                if (!entry) {
                    errors.push(`${where}: imagem "${img.src}" não existe no manifesto — colocar o original em assets-source/imagens e correr "npm run images"`);
                    continue;
                }
                for (const width of entry.s) {
                    for (const ext of ['avif', 'webp']) {
                        const file = path.join(ROOT, 'public', `${key}-${width}.${ext}`.replace(/^\//, ''));
                        if (!fs.existsSync(file)) errors.push(`${where}: falta o ficheiro ${key}-${width}.${ext} — correr "npm run images"`);
                    }
                }
            }

            const slug = slugify(product.name);
            if (slugs.has(slug)) errors.push(`${where}: o nome gera o mesmo URL que "${slugs.get(slug)}" (/${category.slug}/${sub.slug}/${slug}) — diferenciar os nomes`);
            else slugs.set(slug, product.id);

            if (!product.characteristics || product.characteristics.length === 0) {
                warnings.push(`${where}: sem "characteristics" — a ficha técnica fica sem especificações`);
            }
        }
    }
}

// ── Imagens no manifesto que nenhum produto usa ──────────────────────────────
const used = new Set();
for (const category of NAV) {
    for (const sub of category.subcategories) {
        for (const product of sub.products) {
            for (const img of getProductImages(product)) used.add(String(img.src).replace(/\.[a-zA-Z0-9]+$/, ''));
        }
    }
}
for (const key of Object.keys(MANIFEST)) {
    if (!used.has(key) && !key.includes('/Logos/')) warnings.push(`imagem gerada mas nunca usada: ${key}`);
}

// ── Resultado ───────────────────────────────────────────────────────────────
const total = [...seenIds.keys()].length;
console.log(`\n  Catálogo: ${CATEGORIES.length} categorias, ${NAV.reduce((n, c) => n + c.subcategories.length, 0)} subcategorias, ${total} produtos`);

if (warnings.length) {
    console.log(`\n  ${warnings.length} aviso(s):`);
    warnings.forEach((w) => console.log(`    · ${w}`));
}

if (errors.length) {
    console.error(`\n  ${errors.length} ERRO(S):`);
    errors.forEach((e) => console.error(`    ✗ ${e}`));
    console.error('');
    process.exit(1);
}

console.log('\n  ✓ Catálogo válido\n');
