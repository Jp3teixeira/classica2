/* eslint-disable no-console */
/**
 * Teste funcional da aplicação.
 *
 * Monta a aplicação real num DOM (jsdom), navega pelas rotas e verifica
 * comportamento — não aparência. Cobre exactamente aquilo que se pode
 * verificar sem um browser gráfico:
 *
 *   · todas as rotas resolvem e nenhuma rebenta
 *   · TODOS os 37 produtos são alcançáveis por links, em desktop E em mobile
 *   · URLs inválidos dão 404
 *   · o Finder é um diálogo acessível e o foco entra nele
 *   · Escape sai um nível de cada vez
 *   · todas as imagens têm width/height e srcset AVIF+WebP
 *   · em modo compacto aparece a TabBar e a barra de subcategorias
 *   · o contacto abre por clique e tem um mailto: real
 *
 * Correr com: npm run test
 */

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// ── DOM ──────────────────────────────────────────────────────────────────────
const dom = new JSDOM(
    `<!doctype html><html lang="pt"><head>
        <title>t</title>
        <meta name="description" content="">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="https://www.classicaag.pt/">
        <meta property="og:url" content=""><meta property="og:title" content="">
        <meta property="og:description" content=""><meta property="og:image" content="">
        <meta name="twitter:title" content=""><meta name="twitter:description" content="">
        <meta name="twitter:image" content="">
     </head><body><div id="root"></div></body></html>`,
    { url: 'https://www.classicaag.pt/', pretendToBeVisual: true }
);

let compact = false;
dom.window.matchMedia = (query) => ({
    media: query,
    matches: query.includes('max-width: 900px') ? compact
        : query.includes('max-width: 480px') ? compact
            : query.includes('hover: hover') ? !compact
                : false,
    addEventListener() { },
    removeEventListener() { },
    addListener() { },
    removeListener() { },
});

global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom não implementa layout: sem isto, o filtro de elementos focáveis
// considera tudo invisível.
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetWidth', { get: () => 100, configurable: true });
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetHeight', { get: () => 40, configurable: true });

const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const React = (await import('react')).default;
const { MemoryRouter, useLocation } = await import('react-router-dom');
const App = (await import('../src/App.jsx')).default;
const { NAV, buildPath } = await import('../src/data/navigation.js');

// ── Consola: qualquer erro ou aviso do React falha o teste ───────────────────
const noise = [];
for (const level of ['error', 'warn']) {
    const original = console[level];
    console[level] = (...args) => {
        const text = args.map(String).join(' ');
        if (!text.includes('not wrapped in act')) noise.push(`[${level}] ${text}`);
        original(...args);
    };
}

// ── Harness ──────────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/** O AnimatePresence completa as saídas num requestAnimationFrame (~16ms em
 *  jsdom), por isso as transições precisam de tempo real para assentar. */
const SETTLE = 90;
const settle = (ms = SETTLE) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });

/** Sonda que expõe o caminho atual do router ao teste. */
let currentPath = '/';
function LocationProbe() {
    currentPath = useLocation().pathname;
    return null;
}

let root = null;

/** Monta a aplicação numa rota. Cada `go` é uma sessão limpa e determinista. */
async function go(path) {
    if (root) await act(async () => { root.unmount(); });
    document.getElementById('root')?.remove();
    const host = document.createElement('div');
    host.id = 'root';
    document.body.appendChild(host);

    root = createRoot(host);
    await act(async () => {
        root.render(
            React.createElement(MemoryRouter, { initialEntries: [path] },
                React.createElement(LocationProbe),
                React.createElement(App))
        );
    });
    await settle(); // efeitos, redirecionamentos (<Navigate replace>) e animações
}

async function press(key, target = document) {
    await act(async () => {
        target.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    });
    await settle();
}

async function click(el) {
    await act(async () => {
        el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, view: dom.window }));
    });
    await settle();
}

let passed = 0;
let skipped = 0;
const failures = [];

/**
 * Filtro de secções: `node scripts/smoke-test.jsx rotas,404`.
 * Sem argumento corre tudo — útil para dividir a execução em máquinas com
 * pouca memória, já que cada rota monta uma árvore React completa.
 */
const only = (process.argv[2] || '').split(',').filter(Boolean);
let section = '';
function begin(id, label) {
    section = id;
    if (only.length === 0 || only.includes(id)) console.log(`\n─── ${label} ${'─'.repeat(Math.max(0, 52 - label.length))}`);
}
const active = () => only.length === 0 || only.includes(section);

async function test(name, fn) {
    if (!active()) { skipped++; return; }
    try {
        await fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (error) {
        failures.push({ name, error });
        console.log(`  ✗ ${name}\n      ${error.message.split('\n')[0]}`);
    }
}

begin('rotas', 'Rotas e navegação');

await test('/ mostra a landing sem diálogo aberto', async () => {
    await go('/');
    assert.ok($('h1'), 'falta <h1>');
    assert.match($('h1').textContent, /Clássica Artes Gráficas/);
    assert.equal($('[role="dialog"]'), null, 'diálogo não devia estar aberto');
});

await test('a tagline tem as 5 palavras separadas e o texto acessível completo', async () => {
    await go('/');
    // O espaçamento visual vem de column-gap (não de nós de texto, que num
    // contentor flex seriam descartados) — o que se pode verificar aqui é que
    // cada palavra é um elemento próprio e que o texto para leitores de ecrã
    // mantém os espaços.
    const words = $$('.tagline-word');
    assert.equal(words.length, 5, `esperava 5 palavras, obtive ${words.length}`);
    assert.deepEqual(
        words.map((w) => w.textContent),
        ['Fique', 'com', 'boa', 'impressão', 'nossa']
    );
    const readable = $$('.visually-hidden').map((el) => el.textContent);
    assert.ok(readable.includes('Fique com boa impressão nossa'),
        'o texto com espaços devia estar disponível para leitores de ecrã');
});

await test('/livros normaliza para /livros/capa-mole', async () => {
    await go('/livros');
    assert.equal(currentPath, '/livros/capa-mole');
    assert.ok($('[role="dialog"]'), 'o Finder devia estar aberto');
});

await test('/livros/capa-dura mostra os 4 livros de capa dura', async () => {
    await go('/livros/capa-dura');
    const links = $$('.product-card-link');
    assert.equal(links.length, 4, `esperava 4 produtos, obtive ${links.length}`);
});

await test('produto por slug do nome resolve', async () => {
    await go('/livros/capa-dura/gps-peregrino');
    assert.ok($('.product-detail'), 'falta a vista de detalhe');
    assert.match($('.product-title').textContent, /GPS Peregrino/);
});

await test('produto por id antigo continua a resolver (links partilhados)', async () => {
    await go('/livros/capa-dura/ld4');
    assert.match($('.product-title').textContent, /GPS Peregrino/);
});

await test('ficha técnica mostra descrição e especificações', async () => {
    await go('/outros/calendarios-secretaria/calendario-de-secretaria-jmv-2025');
    assert.ok($('.product-description').textContent.includes('ESTOCÁSTICA'));
    const specs = $$('.detail-spec');
    assert.equal(specs.length, 7, `esperava 7 especificações, obtive ${specs.length}`);
    assert.ok($('dl.detail-specs'), 'especificações deviam ser um <dl>');
});

begin('404', '404 real');

for (const [path, label] of [
    ['/categoria-inexistente', 'categoria inválida'],
    ['/livros/subcategoria-inexistente', 'subcategoria inválida'],
    ['/livros/capa-dura/produto-inexistente', 'produto inválido'],
    ['/a/b/c/d/e', 'profundidade excessiva'],
]) {
    await test(`${path} → 404 (${label})`, async () => {
        await go(path);
        assert.ok($('.not-found'), 'devia mostrar a página 404');
        assert.equal($('meta[name="robots"]').content, 'noindex, follow', 'devia marcar noindex');
    });
}

begin('alcance', 'Alcançabilidade de TODOS os produtos');

const totalProducts = NAV.reduce((n, c) => n + c.subcategories.reduce((m, s) => m + s.products.length, 0), 0);

for (const label of ['desktop', 'compacto (telemóvel)']) {
    compact = label !== 'desktop';
    await test(`os ${totalProducts} produtos são alcançáveis por link em ${label}`, async () => {
        const reached = new Set();
        for (const category of NAV) {
            for (const sub of category.subcategories) {
                await go(buildPath(category, sub));
                for (const link of $$('.product-card-link')) {
                    reached.add(link.getAttribute('href'));
                }
            }
        }
        assert.equal(reached.size, totalProducts,
            `alcançados ${reached.size} de ${totalProducts}`);
    });
}

compact = false;

await test('cada subcategoria é alcançável a partir da janela aberta', async () => {
    for (const category of NAV) {
        if (category.subcategories.length <= 1) continue;
        await go(buildPath(category, category.subcategories[0]));
        const hrefs = $$('.finder-sidebar-item, .subcat-chip').map((a) => a.getAttribute('href'));
        for (const sub of category.subcategories) {
            assert.ok(hrefs.includes(buildPath(category, sub)),
                `falta link para ${buildPath(category, sub)} em ${category.id}`);
        }
    }
});

begin('a11y', 'Acessibilidade');

await test('o Finder é um diálogo modal com nome acessível', async () => {
    await go('/catalogos/todos');
    const dialog = $('[role="dialog"]');
    assert.ok(dialog, 'falta role="dialog"');
    assert.equal(dialog.getAttribute('aria-modal'), 'true');
    const labelId = dialog.getAttribute('aria-labelledby');
    assert.ok(labelId, 'falta aria-labelledby');
    assert.ok(document.getElementById(labelId), 'aria-labelledby aponta para id inexistente');
});

await test('o foco entra na janela ao abrir', async () => {
    await go('/');
    await go('/catalogos/todos');
    await settle();
    const dialog = $('[role="dialog"]');
    assert.ok(dialog.contains(document.activeElement),
        `foco em <${document.activeElement?.tagName}> fora do diálogo`);
});

await test('o conteúdo de fundo fica inert enquanto o diálogo está aberto', async () => {
    await go('/catalogos/todos');
    const inert = $$('[inert]');
    assert.ok(inert.length > 0, 'nada foi marcado inert');
    // O diálogo e os seus ancestrais têm de continuar ativos
    const dialog = $('[role="dialog"]');
    assert.ok(!inert.some((el) => el === dialog || el.contains(dialog)),
        'o diálogo (ou um ancestral) ficou inert');
    // A navegação de fundo tem de estar fora de alcance
    assert.ok($('.menubar')?.hasAttribute('inert'), 'a MenuBar devia ficar inert');
});

await test('Escape no detalhe volta à grelha; na grelha fecha a janela', async () => {
    await go('/livros/capa-dura/gps-peregrino');
    await press('Escape');
    assert.equal(currentPath, '/livros/capa-dura', 'devia voltar à grelha');
    await press('Escape');
    assert.equal(currentPath, '/', 'devia fechar a janela');
});

await test('a subcategoria ativa é comunicada com aria-current', async () => {
    await go('/livros/capa-dura');
    const current = $$('[aria-current="true"]').map((el) => el.getAttribute('href'));
    assert.ok(current.includes('/livros/capa-dura'), 'falta aria-current na subcategoria ativa');
});

await test('a categoria ativa é comunicada na MenuBar', async () => {
    await go('/livros/capa-dura');
    const active = $$('.menubar-item.active');
    assert.ok(active.length >= 1, 'nenhum item da MenuBar marcado como ativo');
});

await test('a galeria é um tablist com estado selecionado', async () => {
    await go('/outros/postais/postal-duotone');
    const tabs = $$('[role="tab"]');
    assert.equal(tabs.length, 2, `esperava 2 miniaturas, obtive ${tabs.length}`);
    assert.equal(tabs.filter((t) => t.getAttribute('aria-selected') === 'true').length, 1);
    assert.ok($('.gallery-counter').textContent.includes('1 de 2'), 'falta indicador de posição');
});

await test('nenhum botão fica sem nome acessível', async () => {
    await go('/outros/postais/postal-duotone');
    const unnamed = $$('button').filter((b) =>
        !b.getAttribute('aria-label') && !b.textContent.trim() && !b.getAttribute('title'));
    assert.equal(unnamed.length, 0, `${unnamed.length} botão(ões) sem nome`);
});

await test('existe link para saltar para o conteúdo', async () => {
    await go('/');
    const skip = $('.skip-link');
    assert.ok(skip, 'falta o skip link');
    await go('/catalogos/todos');
    assert.ok(document.getElementById(skip.getAttribute('href').slice(1)), 'o destino do skip link não existe');
});

begin('imagens', 'Imagens');

// A existência de TODOS os ficheiros (45 imagens × larguras × 2 formatos) é
// verificada por scripts/validate-data.mjs, que lê o disco. Aqui verifica-se o
// que só o DOM revela — atributos emitidos — numa amostra de uma vista por
// subcategoria, para não montar 37 árvores React.
await test('as imagens emitem width/height e srcset AVIF+WebP', async () => {
    const problems = [];
    for (const category of NAV) {
        for (const sub of category.subcategories) {
            const product = sub.products[0];
            if (!product) continue;
            await go(buildPath(category, sub, product));
            for (const img of $$('img')) {
                if (!img.getAttribute('width') || !img.getAttribute('height')) {
                    problems.push(`sem dimensões: ${img.getAttribute('src')}`);
                }
                if (!img.getAttribute('src')?.endsWith('.webp')) {
                    problems.push(`src não é webp: ${img.getAttribute('src')}`);
                }
            }
            const types = $$('source').map((s) => s.getAttribute('type'));
            if (!types.includes('image/avif') || !types.includes('image/webp')) {
                problems.push(`${product.id}: falta AVIF ou WebP`);
            }
            if ($$('source').some((s) => !s.getAttribute('srcset')?.includes('w'))) {
                problems.push(`${product.id}: srcset sem descritores de largura`);
            }
            if ($$('.image-fallback').length > 0) {
                problems.push(`${product.id}: imagem em falta (fallback visível)`);
            }
        }
    }
    assert.equal(problems.length, 0, problems.slice(0, 5).join(' | '));
});

await test('todas as imagens de conteúdo têm alt descritivo', async () => {
    await go('/catalogos/todos');
    for (const img of $$('.product-card-image img')) {
        assert.ok(img.getAttribute('alt')?.length > 3, `alt insuficiente: "${img.getAttribute('alt')}"`);
    }
});

await test('as miniaturas da galeria são decorativas (alt vazio)', async () => {
    await go('/outros/postais/postal-duotone');
    for (const img of $$('.gallery-thumb img')) {
        assert.equal(img.getAttribute('alt'), '', 'miniatura dentro de botão rotulado devia ter alt=""');
    }
});

begin('mobile', 'Modo compacto (telemóvel)');

compact = true;

await test('a TabBar substitui a Dock e mostra rótulos de texto', async () => {
    await go('/');
    assert.ok($('.tabbar'), 'falta a TabBar');
    assert.equal($('.dock'), null, 'a Dock não devia existir em modo compacto');
    const labels = $$('.tabbar-label').map((l) => l.textContent.trim());
    assert.equal(labels.length, 7, `esperava 6 categorias + contacto, obtive ${labels.length}`);
    assert.ok(labels.every((l) => l.length > 0), 'algum rótulo está vazio');
});

await test('as subcategorias aparecem como barra horizontal, não sidebar', async () => {
    await go('/livros/capa-mole');
    assert.ok($('.subcat-strip'), 'falta a barra de subcategorias');
    assert.equal($('.finder-sidebar'), null, 'a sidebar não devia ser renderizada');
    assert.equal($$('.subcat-chip').length, 2);
});

await test('existe botão de fechar explícito na janela', async () => {
    await go('/livros/capa-mole');
    const close = $('.finder-close-text');
    assert.ok(close, 'falta o botão de fechar');
    assert.equal(close.getAttribute('aria-label'), 'Fechar janela');
});

await test('o contacto abre por clique e tem um mailto: real', async () => {
    await go('/');
    const trigger = $$('.tabbar-link').find((b) => b.textContent.includes('Contacto'));
    assert.ok(trigger, 'falta o botão de contacto na TabBar');
    await click(trigger);
    assert.ok($('.contact-panel'), 'o painel de contacto não abriu');
    assert.ok($('a[href^="mailto:"]'), 'falta link mailto:');
    assert.equal($$('.contact-action').length, 1, 'devia haver apenas o card de email');
    const panel = $('[role="dialog"][aria-modal="true"]');
    assert.ok(panel, 'o painel devia ser um diálogo modal');
    await press('Escape');
    assert.equal($('.contact-panel'), null, 'Escape devia fechar o painel');
});

compact = false;

await test('em desktop o contacto também abre por clique na MenuBar', async () => {
    await go('/');
    await click($('.contacts-trigger'));
    assert.ok($('.contact-panel'), 'o painel não abriu');
    assert.ok($('a[href^="mailto:"]'));
    await press('Escape');
});

begin('seo', 'SEO');

await test('o título e o canonical mudam por rota', async () => {
    await go('/livros/capa-dura/gps-peregrino');
    assert.match(document.title, /GPS Peregrino/);
    assert.equal($('link[rel="canonical"]').href, 'https://www.classicaag.pt/livros/capa-dura/gps-peregrino');
    assert.equal($('meta[property="og:url"]').content, 'https://www.classicaag.pt/livros/capa-dura/gps-peregrino');

    await go('/embalagens/cartolina');
    assert.match(document.title, /Cartolina — Embalagens/);
    assert.equal($('meta[name="robots"]').content, 'index, follow');
});

await test('todos os produtos são links rastreáveis (<a href>)', async () => {
    await go('/rotulagem/rotulos');
    const links = $$('.product-card-link');
    assert.equal(links.length, 5);
    assert.ok(links.every((a) => a.tagName === 'A' && a.getAttribute('href')?.startsWith('/')));
});

// ── Resultado ────────────────────────────────────────────────────────────────
const realNoise = noise.filter((n) => !n.includes('Warning: An update to'));
console.log('\n─── Resultado ───────────────────────────────────────────────');
console.log(`  ${passed} testes passaram, ${failures.length} falharam${skipped ? `, ${skipped} ignorados (filtro: ${only.join(',')})` : ''}`);
if (realNoise.length) {
    console.log(`\n  ${realNoise.length} mensagem(ns) de erro/aviso na consola:`);
    realNoise.slice(0, 8).forEach((n) => console.log(`    ${n.slice(0, 160)}`));
}
if (failures.length) {
    console.log('');
    failures.forEach((f) => console.log(`  ✗ ${f.name}\n${f.error.stack?.split('\n').slice(0, 4).join('\n')}`));
    process.exit(1);
}
if (realNoise.length) process.exit(1);
console.log('  ✓ tudo verde\n');
