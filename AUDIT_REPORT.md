# AUDITORIA TÉCNICA — CLÁSSICA ARTES GRÁFICAS
### Fase 1 — Auditoria de engenharia (somente leitura)

**Data:** 7 de agosto de 2026
**Repositório auditado:** `C:\Users\jp3te\OneDrive\Ambiente de Trabalho\codigo\classica2`
**Commit HEAD:** `6bee56a` — *"fix: all 5 audit issues - ErrorBoundary, stale closure, preload, vite chunks, SPA rewrite"* (branch `main`, sincronizada com `origin/main`)
**Ficheiros criados nesta fase:** apenas `AUDIT_REPORT.md`
**Ficheiros do projeto modificados:** NENHUM

**Convenção de evidência usada em todo o documento:**

- **[OBS]** — Observado: verificado diretamente no código, no sistema de ficheiros ou na execução de comandos.
- **[INF]** — Inferido: conclusão lógica a partir de evidência observada, sem execução em runtime.
- **[VER]** — Requer verificação: precisa de medição em dispositivo/browser real antes de ser tratado como facto.

---

# Executive Summary

O projeto está num estado **melhor do que a média para um site desta dimensão**, com sinais claros de trabalho de qualidade recente: os componentes estão separados por responsabilidade, existe um `ErrorBoundary` global, a memoização com `memo`/`useCallback` está de facto a funcionar, o SEO técnico (meta tags, Open Graph, JSON-LD, sitemap, robots) está acima do que se vê tipicamente em sites de PME, o modelo de dados não tem um único ID duplicado nem um único caminho de imagem inválido, e o build de produção corre limpo em 1,35 s.

Isto não é um projeto a precisar de reescrita. É um projeto com **três problemas graves e concentrados** e um conjunto de arestas menores.

### Maiores forças

1. **Integridade de dados exemplar** [OBS] — 37 produtos, 0 IDs duplicados, 0 campos obrigatórios em falta, 0 caminhos de imagem inválidos, 0 chaves órfãs entre `products.js` e `categories.js`, e `getProducts()` devolve `[]` de forma segura para qualquer input inválido (incluindo `undefined`).
2. **Separação de componentes correta** [OBS] — `FinderWindow` / `ProductGrid` / `ProductDetail` / `FinderStates` estão bem divididos, os ícones SVG foram extraídos para `icons.jsx`, e nenhum ficheiro passa das 140 linhas. Não há componentes gigantes.
3. **Memoização que realmente serve para algo** [OBS] — o relógio da MenuBar atualiza `MainSite` a cada 60 s, mas `Desktop`, `Dock` e `FinderWindow` estão memoizados com props estáveis (`CATEGORIES` é constante de módulo, os handlers vêm de `useCallback`), pelo que só a `MenuBar` re-renderiza. Isto está bem feito.
4. **Superfície de ataque praticamente nula** [OBS] — zero `dangerouslySetInnerHTML`, zero `innerHTML`, zero `eval`, zero `fetch`, zero `target="_blank"`, zero `iframe`, zero segredos, zero ficheiros `.env`, zero dependências de runtime de terceiros além de React/Router/Framer.
5. **SEO técnico sólido** [OBS] — título, description, canonical, OG completo, Twitter Card, dois blocos JSON-LD (`LocalBusiness` + `WebSite`), `robots.txt`, `sitemap.xml`, verificação do Google Search Console e fallback `<noscript>` com o email de contacto.

### Maiores fraquezas

1. **CRÍTICO — 35% do portfólio é inalcançável em telemóvel.** [OBS] `responsive.css:60` esconde a `.finder-sidebar` com `display: none` em ecrãs ≤480px. A sidebar é o **único** mecanismo de troca de subcategoria. Como o `FinderWindow` autoseleciona apenas a primeira subcategoria, 13 dos 37 produtos ficam sem qualquer caminho de navegação num telefone — incluindo os 4 livros de capa dura, ambos os postais, as 3 caixas de cartolina e o calendário de secretária.
2. **CRÍTICO — a navegação principal desaparece em mobile e o substituto é um alvo de toque de 6 px.** [OBS] `responsive.css:8` esconde `.menubar-nav` a ≤768px. A única alternativa é a Dock, que aparece automaticamente aos 2,8 s, **desaparece aos 6,5 s** e depois só reaparece ao tocar numa barra de `height: 6px` colada ao fundo do ecrã — exatamente onde o iOS Safari coloca a sua própria barra de navegação e o *home indicator*. Se o utilizador perde a janela de 3,7 segundos, o site fica sem navegação.
3. **CRÍTICO — 60,6 MB de imagens não otimizadas.** [OBS] Abrir *Outros › Postais* faz descarregar **8,1 MB** para mostrar duas miniaturas de ~200 px; *Livros › Capa Dura* faz descarregar **9,3 MB**. Existem cinco ficheiros individuais entre 6,3 MB e 7,7 MB, com 3072×4096 px. Nenhuma imagem tem `srcset`, `width`/`height`, WebP ou AVIF.
4. **ALTO — a acessibilidade do modal está ausente.** [OBS] O `FinderWindow` é um diálogo modal sem `role="dialog"`, sem `aria-modal`, sem gestão de foco, sem *focus trap* e sem devolução de foco ao fechar. O foco permanece atrás do overlay e a `MenuBar` (z-index 300 > overlay 200) continua tabulável e clicável por cima do modal.
5. **ALTO — o contacto é inalcançável na prática em mobile.** [OBS] O email só aparece num dropdown accionado por `:hover` CSS puro (`menubar.css:125`) e não é um `mailto:`. Num telefone não há hover; o botão "Contactos" não tem `onClick`. Para um site cuja função declarada é apoio comercial, este é o pior sítio possível para ter uma falha.
6. **ALTO — `prefers-reduced-motion` não é respeitado em nenhum sítio.** [OBS] 0 ocorrências em todo o código. A landing animou 29 caracteres individualmente durante ~2,7 s e há animações de mola, tilt 3D e transições de página.

### Posturas por dimensão

| Dimensão | Postura | Síntese |
|---|---|---|
| **Arquitetura** | Boa | Estrutura adequada à escala; o único desvio real é estado de navegação puramente local sem URL. |
| **Preparação mobile** | Fraca | Funcionalmente incompleta (35% do catálogo inacessível), não apenas esteticamente imperfeita. |
| **Segurança** | Boa (runtime) / A corrigir (headers e deps) | Nenhum vetor de XSS. 12 vulnerabilidades em dependências, 10 das quais apenas de build. Sem cabeçalhos de segurança. |
| **Acessibilidade** | Fraca | Modal inacessível, sem reduced-motion, sem `<h1>` na página principal, interações dependentes de hover. |
| **Performance** | Fraca (imagens) / Boa (JS) | 388 KB de JS (135 KB gzip) é razoável; 60,6 MB de imagens não é. |
| **Manutenibilidade** | Boa | Ficheiros pequenos, nomes claros, documentação interna útil. Prejudicada por `npm run lint` inutilizável e ausência de `.gitattributes`. |
| **SEO** | Boa | Tecnicamente correto. Limitado por ter apenas um URL indexável. |
| **UX desktop** | Muito boa | O conceito macOS funciona, é distintivo e adequado ao posicionamento premium. |
| **UX mobile** | Má | Parece um site de desktop avariado, não um produto pensado para toque. |

---

# Repository Snapshot

## Ambiente e ferramentas [OBS]

| Item | Valor |
|---|---|
| Framework | React **19.2.4** |
| Build | Vite **7.3.1** (`vite build`, sem plugins além de `@vitejs/plugin-react` 5.1.3) |
| Animações | Framer Motion **12.31.0** |
| Router | react-router-dom **7.13.0** |
| Estilos | CSS puro, 7 ficheiros, 1192 linhas totais |
| Node usado na auditoria | v22.22.3 |
| npm usado na auditoria | 10.9.8 |
| Dependências de produção | 4 |
| Dependências de desenvolvimento | 10 |
| Pacotes instalados (`npm ci`) | 165 |
| Ficheiros versionados no Git | 89 |
| Testes automatizados | **0** — não existe qualquer ficheiro de teste, nem vitest/jest configurado |
| CI/CD | **Nenhum** — sem `.github/`, sem `render.yaml`, sem `netlify.toml` |
| Deploy | `client/vercel.json` presente → **Vercel** (rewrite SPA de `/(.*)` para `/index.html`) |

> **Contradição na documentação** [OBS]: `client/CLAUDE.md:18` afirma *"Deploy: Render (via GitHub, branch main)"*, `README.md` afirma *"Deploy: Vercel (automático via GitHub)"*, e existe `vercel.json`. O `CLAUDE.md` está desatualizado. O briefing desta auditoria também mencionava Render. **A evidência aponta para Vercel.**

## Resultado do build [OBS]

Executado numa **cópia temporária em `/tmp`** com `npm ci` limpo, precisamente para não escrever em `client/dist` nem alterar o `node_modules` do repositório.

```
vite v7.3.1 building client environment for production...
✓ 453 modules transformed.
dist/index.html                          5.62 kB │ gzip:  1.66 kB
dist/assets/index-M9NQfIWS.css          15.72 kB │ gzip:  4.01 kB
dist/assets/vendor-react-Dmy3VYT0.js    45.88 kB │ gzip: 16.27 kB
dist/assets/vendor-motion-DPQffCq1.js  119.96 kB │ gzip: 39.61 kB
dist/assets/index-cQ3s8qtk.js          222.07 kB │ gzip: 66.12 kB
✓ built in 1.35s
```

**Build bem-sucedido, zero warnings, zero erros.** Os hashes gerados (`index-cQ3s8qtk`, `vendor-motion-DPQffCq1`, `vendor-react-Dmy3VYT0`, `index-M9NQfIWS`) são **idênticos** aos que estão em `client/dist/assets/`, o que confirma que a pasta `dist` local corresponde exactamente ao código-fonte atual [OBS].

## Nota importante sobre `node_modules` [OBS]

O `client/node_modules` existente **não funciona em Linux**: foi instalado em Windows e falta o binário nativo `@rollup/rollup-linux-x64-gnu`. Não é um defeito do projeto — é esperado. Registado apenas para explicar por que a auditoria construiu numa cópia isolada.

Adicionalmente, `npm ls --depth=0` reporta **`@vercel/analytics@1.6.1 extraneous`** [OBS]: o pacote está instalado em `node_modules` mas **não consta do `package.json`** e **não é importado em nenhum ficheiro de `src/`**. É resíduo de uma experiência abandonada.

## Estrutura real do repositório [OBS]

```
classica2/
├── .gitignore                 (ignora node_modules, dist, .env, .idea)
├── .idea/                     ← 5 ficheiros VERSIONADOS apesar de estarem no .gitignore
├── README.md                  (diz Vercel)
└── client/
    ├── CLAUDE.md              (diz Render — desatualizado)
    ├── README.md              (template Vite por defeito, não editado)
    ├── dist/                  ← 62 MB, não versionado, mas presente em disco (OneDrive)
    ├── eslint.config.js
    ├── index.html             (104 linhas — todo o SEO vive aqui)
    ├── package.json / package-lock.json
    ├── vercel.json
    ├── vite.config.js
    ├── public/
    │   ├── favicon.png        ← na verdade é um JPEG 1024×1024
    │   ├── google00462744c179bb85.html
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   ├── vite.svg           ← resíduo do template, nunca referenciado
    │   └── imagens/           ← 61 MB, 47 ficheiros
    └── src/
        ├── main.jsx           (20 linhas)
        ├── App.jsx            (72 linhas)
        ├── components/
        │   ├── ErrorBoundary.jsx    (60 linhas)
        │   ├── Desktop/Desktop.jsx  (53 linhas)
        │   ├── MenuBar/MenuBar.jsx  (63 linhas)
        │   ├── Dock/Dock.jsx        (138 linhas)
        │   ├── Dock/icons.jsx       (54 linhas)
        │   ├── NotFound/NotFound.jsx(55 linhas)
        │   └── Finder/
        │       ├── FinderWindow.jsx (99 linhas)
        │       ├── ProductGrid.jsx  (70 linhas)
        │       ├── ProductDetail.jsx(112 linhas)
        │       └── FinderStates.jsx (36 linhas)
        ├── data/
        │   ├── categories.js  (69 linhas, 6 categorias, 12 subcategorias)
        │   └── products.js    (633 linhas, 37 produtos)
        └── styles/
            ├── base.css       (140 linhas — tokens + reset)
            ├── desktop.css    (67)
            ├── menubar.css    (144)
            ├── dock.css       (203)
            ├── finder.css     (474)
            ├── responsive.css (159)
            └── animations.css (5 linhas, VAZIO e NÃO IMPORTADO)
```

A estrutura corresponde em grande medida ao que o briefing descrevia, com **três diferenças relevantes**: existem componentes não mencionados (`ErrorBoundary.jsx`, `NotFound/`, `Dock/icons.jsx`), existem folhas de estilo não mencionadas (`base.css`, `responsive.css`, `animations.css`), e o projeto **usa react-router-dom** — o briefing assumia navegação puramente por estado.

---

# Architecture Analysis

## A arquitetura real (não a documentada)

```
main.jsx
 └─ StrictMode
     └─ BrowserRouter                    ← react-router-dom
         └─ App
             └─ ErrorBoundary            ← class component, getDerivedStateFromError
                 └─ Routes
                     ├─ "/"  → MainSite  ← detém TODO o estado de topo
                     └─ "*"  → NotFound
```

`MainSite` (`App.jsx:15-57`) é o único dono de estado global:

| Estado | Tipo | Consumido por | Modificado por |
|---|---|---|---|
| `activeCategory` | objeto de `CATEGORIES` ou `null` | `FinderWindow` (prop `category`) | `openCategory`, `closeFinder` (via `setTimeout`) |
| `isFinderOpen` | boolean | render condicional do `FinderWindow` | `openCategory`, `closeFinder`, handler de Escape |
| `currentTime` | `Date` | `MenuBar` (prop `currentTime`) | `setInterval` de 60 s |

`FinderWindow` (`FinderWindow.jsx:12-97`) detém o estado local da exploração:

| Estado | Consumido por | Modificado por |
|---|---|---|
| `selectedSubcategory` | sidebar (classe `active`), `EmptyState`, efeito de carregamento | clique na sidebar, 2 efeitos |
| `products` | `ProductGrid` | 1 efeito |
| `selectedProduct` | `ProductDetail` vs `ProductGrid` | clique no card, botão Voltar, 2 efeitos |

`ProductDetail` detém `activeIdx` (índice da imagem ativa na galeria). `Dock` detém `isVisible`, `isMobile` e uma ref de timeout.

**Avaliação:** para uma aplicação de 11 componentes e 37 produtos estáticos, esta distribuição de estado é **adequada e não precisa de biblioteca de estado**. Não há prop drilling significativo (a profundidade máxima é 2 níveis), não há contexto desnecessário, não há abstrações prematuras. Recomendar Redux/Zustand aqui seria errado.

## Os três problemas arquiteturais reais

### A1 — O router está instalado mas a aplicação não é navegável por URL [OBS] · Severidade: MÉDIA

`react-router-dom` (45,9 KB / 16,3 KB gzip) é usado exclusivamente para:
- `BrowserRouter` + `Routes` com **duas** rotas (`/` e `*`)
- `useNavigate` numa única linha (`NotFound.jsx:44`) para voltar a `/`

Toda a navegação real — categoria, subcategoria, produto selecionado — vive em `useState` e **não tem representação no URL**. Consequências concretas:

- O botão Voltar do browser não fecha o Finder nem volta da vista de detalhe; sai do site [INF].
- Não é possível enviar a um cliente o link direto para um produto ("veja este catálogo") [OBS].
- Um refresh perde o contexto e devolve o utilizador à landing [OBS].
- O sitemap tem, com razão, apenas 1 URL — não há mais nada para indexar. Os 37 produtos, com descrições técnicas ricas em palavras-chave reais do setor, são **invisíveis para o Google** [INF].
- O `NotFound` é servido com HTTP **200** (rewrite SPA em `vercel.json`), o que o Google classifica como *soft 404* [INF].

Isto é, ao mesmo tempo, o maior custo de oportunidade do projeto e a correção com melhor relação benefício/risco: o router **já está pago**, apenas não está a ser usado.

### A2 — `MenuBar` fica acima do modal na ordem de empilhamento [OBS] · Severidade: ALTA

`base.css:58-62` define `--z-finder: 200` e `--z-menubar: 300`. Com o Finder aberto, a MenuBar continua visível, focável e clicável **por cima** do overlay. Isto é fiel ao macOS (a barra de menus do sistema está sempre no topo) mas cria dois problemas: quebra o isolamento do diálogo modal para tecnologias de apoio, e permite trocar de categoria com o Finder aberto — que é exactamente o caminho que aciona o bug **B2** descrito mais abaixo.

`--z-modal: 400` está definido e nunca é usado [OBS].

### A3 — Não existe camada de acesso a dados, só um getter [OBS] · Severidade: BAIXA

`getProducts(categoryId, subcategoryId)` (`products.js:626-631`) é o único ponto de acesso. Contém um ramo defensivo:

```js
if (!Array.isArray(categoryData)) return categoryData[subcategoryId] || [];
return categoryData;
```

O `return categoryData` final trata o caso de uma categoria ser um array plano em vez de um objeto de subcategorias. **Nenhuma categoria em `products.js` está nesse formato** [OBS] — é código defensivo para uma forma de dados que não existe. Não é prejudicial, mas é uma bifurcação que qualquer leitor futuro terá de decifrar. Não existe validação de esquema, nem em runtime nem em build.

---

# React Analysis

## O que está bem feito [OBS]

- **Limpeza de efeitos correta em todos os casos.** `App.jsx:24` (`clearInterval`), `App.jsx:43` (`removeEventListener`), `Dock.jsx:21-24` (dois `clearTimeout`). Não encontrei um único listener ou timer sem cleanup.
- **Chaves de lista corretas onde importa.** `product.id` no grid (`ProductGrid.jsx:52`), `category.id` na MenuBar e Dock, `sub.id` na sidebar. Os únicos `key={index}` estão em listas puramente estáticas e não reordenáveis (caracteres da tagline, thumbnails, especificações) — uso legítimo.
- **A memoização é real, não decorativa.** Verificado: `CATEGORIES` é constante de módulo (referência estável), `openCategory`/`closeFinder` estão em `useCallback` com deps corretas, e por isso o tick do relógio a cada 60 s **não** re-renderiza `Desktop`, `Dock` nem `FinderWindow`.
- **Closure obsoleta já corrigida.** O handler de Escape em `App.jsx:40-44` inclui `isFinderOpen` e `closeFinder` nas dependências — o histórico de commits confirma que isto foi corrigido deliberadamente.
- **`ErrorBoundary` presente**, o que evita a página branca em caso de exceção de render.

## Problemas confirmados

### R1 — Cascata de três efeitos encadeados no `FinderWindow` [OBS] · Severidade: ALTA

`FinderWindow.jsx:18-35` contém três `useEffect` que se acionam em série:

```js
useEffect(() => { setSelectedSubcategory(null); setSelectedProduct(null); }, [category]);          // 1
useEffect(() => { if (subs.length > 0 && !selectedSubcategory) setSelectedSubcategory(subs[0]); }, // 2
          [category, selectedSubcategory]);
useEffect(() => { if (selectedSubcategory) setProducts(getProducts(...)); },                        // 3
          [selectedSubcategory, category]);
```

O ESLint sinaliza-o explicitamente (regra `react-hooks/set-state-in-effect` do `eslint-plugin-react-hooks` v7) em **quatro** posições: `FinderWindow.jsx:19`, `:26`, `:33` e `Dock.jsx:15`.

O problema não é estilístico. `products` é **estado derivado** que não precisa de existir: é uma função pura de `(category.id, selectedSubcategory.id)`. Guardá-lo em estado força 3-4 renders por troca de categoria, e como `useEffect` corre **depois** da pintura, existe um intervalo em que o ecrã mostra o título da nova categoria com os produtos da antiga (ver bug **B2**).

A forma idiomática é derivar durante o render (`useMemo` ou cálculo direto), reduzindo três efeitos e duas variáveis de estado a zero efeitos e uma variável.

### R2 — Manipulação imperativa do DOM em conflito com o Framer Motion [OBS] · Severidade: ALTA

`ProductGrid.jsx:9-26`, dentro de um `motion.button`:

```js
const handleMouseMove = useCallback((e) => {
    const rect = card.getBoundingClientRect();       // leitura de layout
    ...
    card.style.transform = `perspective(600px) rotateX(...) rotateY(...) scale(1.03)`;  // escrita
}, []);
```

Três problemas simultâneos:

1. **Conflito de propriedade.** O mesmo elemento tem `initial={{ opacity: 0, y: 20 }}` / `animate={{ opacity: 1, y: 0 }}` — o Framer Motion controla `transform` através de estilos inline. O `handleMouseMove` sobrescreve esse `transform` diretamente. Quem escreve por último ganha, de forma não determinística. Se o utilizador passar o rato sobre um card durante a animação de entrada (`delay: index * 0.05`, portanto até ~600 ms com 12 cards), a animação de entrada é interrompida ou o tilt é anulado [INF].
2. **`getBoundingClientRect()` a cada evento de rato**, sem `requestAnimationFrame`, seguido imediatamente de escrita de estilo. É o padrão clássico de *layout thrashing*: leitura forçada de layout → escrita → leitura forçada no próximo evento [OBS].
3. **Nenhum equivalente para toque.** O efeito tilt 3D — que é um dos elementos visuais mais distintivos do site — simplesmente não existe em mobile [OBS].

A alternativa correta preserva exactamente o mesmo efeito visual usando os `MotionValue` do Framer (`useMotionValue` + `useTransform` + `style={{ rotateX, rotateY }}`), o que compõe em vez de competir, e é atualizado fora do ciclo de render do React.

### R3 — `AnimatePresence` ausente onde é indispensável [OBS] · Severidade: MÉDIA

`App.jsx:52-54`:

```jsx
{isFinderOpen && activeCategory && (
  <FinderWindow category={activeCategory} onClose={closeFinder} />
)}
```

O `FinderWindow` define `exit={{ opacity: 0 }}` no overlay e `exit={{ opacity: 0, scale: 0.95, y: 20 }}` na janela (`FinderWindow.jsx:38-44`). **Sem um `<AnimatePresence>` a envolver o render condicional, animações de `exit` nunca correm.** O componente é desmontado instantaneamente.

Consequência direta: o `setTimeout(() => setActiveCategory(null), 300)` em `closeFinder` (`App.jsx:36`) existe para dar tempo à animação de saída — animação que não acontece. O timeout mantém `activeCategory` preenchido durante 300 ms sem qualquer efeito visual, e **não é limpo** se o componente for desmontado nesse intervalo (risco teórico de `setState` após unmount; em React 19 é silencioso, não gera warning) [INF].

Resultado prático: a janela abre com uma animação de mola elegante e **fecha com um corte seco**. É uma quebra de qualidade percebida num produto cujo objetivo declarado é transmitir bom gosto.

### R4 — `AnimatePresence mode="sync"` a alternar irmãos em fluxo normal [OBS] · Severidade: MÉDIA

`FinderWindow.jsx:82` usa `mode="sync"` para alternar entre `ProductDetail`, `ProductGrid` e `EmptyState`. Em `sync`, o elemento que sai e o que entra estão montados **ao mesmo tempo**, e nenhum deles tem posicionamento absoluto — ambos participam no fluxo de `.finder-main-content`. Durante a transição, a altura do contentor é a soma das duas vistas, o que provoca um salto de scroll e de layout [INF]. `mode="wait"` (já usado corretamente na galeria em `ProductDetail.jsx:31`) ou posicionamento absoluto durante a transição resolvem isto.

### R5 — Estado de responsividade detetado uma única vez, sem escuta de alterações [OBS] · Severidade: MÉDIA

`Dock.jsx:13-16`:

```js
useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(touch);
    ...
}, []);
```

Duas fragilidades:

- **A deteção é de capacidade de toque, não de tamanho de ecrã.** Um MacBook com ecrã táctil, um Surface, ou um portátil Windows com touchscreen são classificados como `isMobile: true` e recebem o backdrop de fechar-ao-tocar-fora, apesar de terem rato. Inversamente, o CSS decide o layout por `max-width`, pelo que **JavaScript e CSS discordam sobre o que é "mobile"** [OBS]. São duas fontes de verdade independentes.
- Não há `matchMedia` nem listener de `resize`/`orientationchange` em nenhum ponto do projeto (0 ocorrências de `matchMedia`) [OBS]. Rodar o dispositivo ou redimensionar a janela não reavalia nada em JS.

### R6 — O relógio pode estar até 59 segundos desalinhado [OBS] · Severidade: BAIXA

`App.jsx:22` — `setInterval(..., 60000)` começa a contar no momento da montagem, não no segundo 0 do minuto. Se a página abre às 14:30:59, o relógio mostra 14:30 até às 14:31:59. Num elemento decorativo que imita a barra do macOS, é aceitável; registado por completude.

### R7 — `LoadingState` importado e nunca renderizado [OBS] · Severidade: BAIXA

`FinderWindow.jsx:8` importa `LoadingState`, que não aparece em nenhum ponto do JSX. O componente, o CSS `.loading-spinner` (`finder.css:460-468`) e a keyframe `@keyframes spin` são código morto. Isto é consequência lógica de uma decisão correta: o comentário em `FinderWindow.jsx:30` diz *"sem setTimeout artificial"* — os dados são sincronizados, logo não há nada para carregar. O import é o resíduo dessa limpeza.

---

# Data Model Analysis

Esta é a área mais forte do projeto. Executei uma verificação programática completa sobre `products.js` e `categories.js`.

## Resultados da verificação de integridade [OBS]

| Verificação | Resultado |
|---|---|
| Total de produtos | **37** |
| IDs duplicados | **0** |
| Produtos com `image` **e** `images` simultaneamente | **0** |
| Produtos sem qualquer imagem | **0** |
| Produtos sem `characteristics` | **0** |
| Campos obrigatórios em falta (`id`, `name`, `description`) | **0** |
| Caminhos de imagem que não existem em disco | **0** |
| Chaves em `PRODUCTS` sem categoria correspondente em `CATEGORIES` | **0** |
| Chaves de subcategoria órfãs dentro de `PRODUCTS` | **0** |
| Subcategorias declaradas mas vazias | **0** |
| Galerias com `label` em apenas parte das imagens | **0** |
| `getProducts('naoexiste', 'x')` | `[]` ✓ |
| `getProducts('livros', 'naoexiste')` | `[]` ✓ |
| `getProducts(undefined, undefined)` | `[]` ✓ |

Distribuição: **31 produtos** usam `image` (string), **6 produtos** usam `images` (array). Os multi-imagem são `cal4b`(2), `mc4`(2), `ct1`(2), `pos1`(2), `pos2`(2), `csec1`(3). Apenas `csec1` usa `label` nas imagens ("Aberto"/"Fechado"/"Lado").

## A convenção dupla `image` vs `images[]` está corretamente tratada [OBS]

Existem exactamente dois pontos de consumo e ambos normalizam:

- `ProductGrid.jsx:49` — `const thumbSrc = product.images ? product.images[0].src : product.image;`
- `ProductDetail.jsx:5-7` — `const imageList = product.images ? product.images : [{ src: product.image, label: null }];`

A lógica é correta e os dados respeitam a regra documentada em `CLAUDE.md:106` ("nunca ambos"). **Isto funciona.** O risco não é atual, é futuro: a regra é aplicada por disciplina humana, não por código. Um produto criado com ambos os campos faria com que `image` fosse silenciosamente ignorado; um produto criado com `images: []` (array vazio) faria `product.images[0].src` lançar `TypeError` e derrubar o `ProductGrid` inteiro até ao `ErrorBoundary` [INF].

## Achados

### D1 — Distribuição de produtos muito desequilibrada [OBS] · Severidade: BAIXA (UX)

| Categoria | Subcategoria | Produtos |
|---|---|---|
| Catálogos | Catálogos | 3 |
| Livros | Capa Mole | 8 |
| Livros | Capa Dura | 4 |
| Calendários | 3 Macetes | **1** |
| Calendários | 4 Macetes | 2 |
| Embalagens | Micro Canelado | 5 |
| Embalagens | Cartolina | 3 |
| Rotulagem | Rótulos | 5 |
| Outros | Brochuras | 2 |
| Outros | Postais | 2 |
| Outros | Calendários de Secretária | **1** |
| Outros | Embalagens Redondas | **1** |

Três subcategorias com um único produto. Numa grelha de `minmax(220px, 1fr)` com 24 px de espaçamento, um único card num painel de ~800 px de largura parece um erro de carregamento, não uma escolha editorial [INF]. `Catálogos › Catálogos` é também uma subcategoria redundante — repete o nome da categoria-pai porque só existe uma.

### D2 — Nome duplicado entre subcategorias [OBS] · Severidade: BAIXA

*"Gramática da Língua Chinesa"* existe como `lm3` (capa mole) e `ld1` (capa dura). É legítimo — são duas edições reais do mesmo título — mas os cards são visualmente indistinguíveis exceto pela imagem. Numa apresentação comercial, mostrar dois produtos com o mesmo nome sem qualificador ("Capa Mole" / "Capa Dura" no próprio nome) causa hesitação.

### D3 — `ld1` tem características contraditórias [OBS] · Severidade: MÉDIA (conteúdo)

`products.js:217-227`, produto *"Gramática da Língua Chinesa"* na subcategoria **capa dura**:

```js
{ label: 'Encadernação', value: 'Capa Dura' },
...
{ label: 'Acabamento capa', value: 'Cosido e brochado' }    // ← "brochado" = capa mole
```

"Cosido e brochado" é o acabamento de capa mole; capa dura é "cosido e cartonado" (como está corretamente em `ld2`, `ld3`, `ld4`). Além disso, `ld1` tem **dois** rótulos que começam por "Acabamento" e a sua descrição é genérica ("encadernação premium", "obras de referência"), ao contrário de todos os outros produtos, que têm descrições técnicas precisas. O bloco parece ter sido copiado de `lm3` e parcialmente adaptado.

**Isto é um erro de conteúdo visível ao cliente numa ficha técnica de uma gráfica** — precisamente o tipo de detalhe que um comprador profissional nota. Requer confirmação do proprietário [VER], mas a inconsistência interna é observável.

### D4 — Campos de dados nunca consumidos [OBS] · Severidade: BAIXA

`categories.js` define para cada categoria:
- `icon` — emoji (`'📋'`, `'📚'`, `'📅'`, `'📦'`, `'🏷️'`, `'🗂️'`) — **nunca usado**. A Dock usa o mapa `ICONS` de `icons.jsx`; a MenuBar usa apenas `name`.
- `description` — texto descritivo por categoria — **nunca usado** em nenhum componente.

As `description` de categoria são bom conteúdo (*"Catálogos profissionais para apresentação de produtos e serviços"*) que está a ser desperdiçado. Seriam úteis como subtítulo no cabeçalho do Finder e como texto indexável.

### D5 — Sem validação automatizada do modelo de dados [OBS] · Severidade: MÉDIA

`products.js` é descrito no próprio `CLAUDE.md:52` como *"⚠️ ficheiro principal"* e o workflow documentado é: copiar um bloco, editar à mão, commit, push, deploy automático. Não existe:
- validação de esquema (nem TypeScript, nem JSDoc verificado, nem Zod, nem script de verificação)
- verificação de que os caminhos de imagem existem
- verificação de unicidade de IDs
- qualquer teste

O estado atual é limpo, mas está limpo **por cuidado manual**, e o único mecanismo de deteção de erro é o deploy em produção. Um script de validação de ~40 linhas executado antes do build eliminaria toda esta classe de risco.

---

# Asset Analysis

## Inventário [OBS]

| Métrica | Valor |
|---|---|
| Total de ficheiros em `public/imagens/` | **47** |
| Peso total | **60,57 MB** |
| Formatos declarados | 41 `.jpg`, 6 `.png` |
| Formatos modernos (WebP / AVIF) | **0** |
| Imagens com `srcset` / `sizes` | **0** |
| Imagens com `width`/`height` intrínsecos no HTML | **0** |
| Imagens referenciadas mas inexistentes | **0** ✓ |
| Imagens existentes mas nunca referenciadas | **2** |
| `dist/imagens` (cópia do build em disco) | +62 MB |

## Os cinco ficheiros mais pesados [OBS]

| Ficheiro | Dimensões | Peso |
|---|---|---|
| `Livros/Capa_Dura/Livro_GPS_Peregrino_D.jpg` | 3072×4096 | **7 681 KB** |
| `Outros/Postais/Postal_Ordem_1_Fechado.jpg` | 4096×3072 | **6 897 KB** |
| `Outros/Postais/Postal_Ordem_2_Fechado.jpg` | 4096×3072 | **6 829 KB** |
| `Outros/Calendarios_Secretaria/..._Lado.jpg` | 3072×4096 | **6 749 KB** |
| `Outros/Postais/Postal_Ordem_1_Aberto.jpg` | 3072×4096 | **6 303 KB** |

Estes cinco ficheiros somam **34,4 MB**, ou seja **57% de toda a biblioteca**. São claramente fotografias diretas de câmara/telefone sem qualquer processamento. Nunca são exibidos a mais de ~650 px de largura (`finder.css:270`, `max-width: 650px`).

## Peso descarregado por vista [OBS]

Cálculo real: para a grelha conta-se a primeira imagem de cada produto; para o total, todas.

| Vista | Produtos | Grelha | Detalhe (todas) |
|---|---|---|---|
| Catálogos › Catálogos | 3 | 657 KB | 657 KB |
| Livros › Capa Mole | 8 | 1 505 KB | 1 505 KB |
| **Livros › Capa Dura** | 4 | **9 259 KB** | 9 259 KB |
| Calendários › 3 Macetes | 1 | 135 KB | 135 KB |
| Calendários › 4 Macetes | 2 | 1 426 KB | 1 739 KB |
| **Embalagens › Micro Canelado** | 5 | **5 786 KB** | 7 618 KB |
| Embalagens › Cartolina | 3 | 3 756 KB | 4 841 KB |
| **Rotulagem › Rótulos** | 5 | **5 700 KB** | 5 700 KB |
| Outros › Brochuras | 2 | 375 KB | 375 KB |
| **Outros › Postais** | 2 | **8 110 KB** | **21 241 KB** |
| Outros › Calendários de Secretária | 1 | 123 KB | 7 077 KB |
| Outros › Embalagens Redondas | 1 | 1 087 KB | 1 087 KB |
| **TOTAL** | 37 | **37,0 MB** | **59,8 MB** |

Interpretação do pior caso: **abrir "Postais" e clicar no primeiro postal descarrega 21,2 MB para ver dois postais.** Numa ligação 4G típica em Portugal (~20 Mbps efetivos), são ~8,5 segundos só para a grelha e mais de 20 segundos para o detalhe [INF]. Numa reunião com cliente, com rede móvel congestionada, isto é uma falha visível.

O `loading="lazy"` existe em todas as `<img>` da grelha (`ProductGrid.jsx:60`) e nas thumbnails, o que é correto — mas com 1 a 8 cards por subcategoria, **toda a grelha está dentro do viewport**, pelo que o lazy loading não evita praticamente nenhum download [INF].

## Anomalias de formato [OBS]

Verifiquei o formato real de cada ficheiro (via cabeçalho) contra a sua extensão. Três discrepâncias:

| Ficheiro | Extensão | Formato real | Impacto |
|---|---|---|---|
| `Logos/logo_white.jpg` | `.jpg` | **PNG RGBA**, 1686×418, 407 KB | É a imagem LCP, tem `<link rel="preload">` (`index.html:14`) e é usada 6 vezes. Um PNG com alfa de 407 KB para um logótipo apresentado a ≤420 px. Em WebP com a mesma transparência ficaria em ~20-30 KB [INF]. |
| `Outros/Brochuras/Brochura_Kenwood_1.png` | `.png` | **JPEG RGB** | Sem impacto funcional (os browsers detetam por conteúdo), mas engana ferramentas e o desenvolvedor. |
| `Outros/Brochuras/Brochura_nutribullet_1.png` | `.png` | **JPEG RGB** | Idem. |
| `public/favicon.png` | `.png` | **JPEG RGB**, 1024×1024, 55 KB | Declarado como `type="image/png"` com `sizes="48x48"` e `sizes="192x192"` (`index.html:7-9`) e também como `apple-touch-icon`. Um favicon de 1024×1024 e 55 KB é descarregado em todos os carregamentos. |

### Dois JPEG em espaço de cor CMYK [OBS] · Severidade: MÉDIA

- `Rotulos/Rotulo_Toskin_Cafe.jpg` — 1933×896, **CMYK**, 1 613 KB
- `Rotulos/Rotulo_Toskin_Colageno-frutos-vermelhos.jpg` — 1910×727, **CMYK**, 939 KB

JPEG em CMYK é uma consequência natural de um fluxo de trabalho de artes gráficas (é o espaço de cor de impressão), mas é **problemático na web**. O suporte varia entre browsers e a conversão para sRGB é feita pelo browser sem perfil ICC consistente, resultando tipicamente em cores dessaturadas ou incorretas — e, em casos com marcador Adobe APP14 invertido, em imagens com cores literalmente invertidas [INF]. Agravante: `finder.css:211` e `:285` aplicam `mix-blend-mode: multiply` a estas imagens, o que multiplica qualquer erro de cor pelo fundo.

**Requer verificação visual em Safari, Chrome e Firefox** [VER]. Para uma gráfica, apresentar rótulos com a cor errada é comercialmente pior do que não os apresentar.

### Caracteres problemáticos em nomes de ficheiro [OBS] · Severidade: BAIXA-MÉDIA

Duas violações da convenção que o próprio projeto documenta (`CLAUDE.md:144`: *"Nomes de pastas sem acentos no public/imagens/ para evitar erros no servidor"*):

- `Rotulos/Rotulo_Nutrimoa_Café.png` — contém **`é`**. É referenciado literalmente em `products.js:488` como `'/imagens/Rotulos/Rotulo_Nutrimoa_Café.png'`. Funciona porque os browsers modernos percent-encodam automaticamente e a Vercel serve UTF-8 corretamente, mas é frágil face a diferenças de normalização Unicode (NFC vs NFD — precisamente onde macOS e Linux divergem) [INF].
- `Embalagens/Micro_Canelado_MC/Embalagem_WAYUP(proteico)_MC_5.jpg` — contém **parênteses**. Funciona em `src` de `<img>`, mas quebraria imediatamente se alguma vez fosse usado em `url()` de CSS sem escape.

Ambos funcionam **hoje**. São dívida latente, não bugs.

## Ficheiros órfãos [OBS]

| Ficheiro | Peso | Notas |
|---|---|---|
| `Livros/Capa_Mole/Livro_Dialogos_resumo_M.jpg` | 254 KB | O commit `551f534` diz *"remove Diálogos Resumos"*. O produto foi removido de `products.js` (a sequência de IDs salta de `lm2` para `lm9` sem `lm1`), a imagem ficou. |
| `Logos/classica2.png` | 125 KB | Logótipo alternativo (913×253, PNG RGBA). Nunca referenciado. |
| `public/vite.svg` | 1,5 KB | Resíduo do template Vite. |

---

# CSS Analysis

## Avaliação global

1192 linhas em 7 ficheiros para uma aplicação deste tamanho é **proporcionado**. Encontrei sinais de disciplina genuína:

- **Zero `!important`** em todo o projeto [OBS]. Notável.
- **Especificidade baixa e consistente** — a maioria dos seletores é de classe única; o mais profundo tem 3 níveis (`.dock-item:hover .dock-label`) [OBS].
- **Zero classes CSS mortas** — verifiquei as 79 classes definidas contra os JSX: todas têm correspondência [OBS].
- **Tokens de design existem** e cobrem cores, tipografia, transições e camadas z (`base.css:6-63`).
- **Prefixos `-webkit-` presentes** onde importam (`backdrop-filter`, `background-clip`, `font-smoothing`) [OBS].
- **Reset moderno** com `box-sizing: border-box` global e `img { max-width: 100%; height: auto; display: block }`.
- **`:focus-visible` global definido** (`base.css:87-90`) com contorno de 2 px na cor de acento.

O sistema **não precisa** de ser substituído por CSS Modules, Tailwind ou styled-components. O CSS puro é adequado à escala e está a ser usado com competência. Os problemas são específicos, não estruturais.

## Problemas confirmados

### C1 — Tokens definidos e nunca usados [OBS] · Severidade: BAIXA

| Token | Definido | Usado |
|---|---|---|
| `--dock-bg` | ✓ | **0** |
| `--dock-blur` | ✓ | **0** |
| `--dock-border` | ✓ | **0** |
| `--dock-shadow` | ✓ | **0** |
| `--z-modal` | ✓ | **0** |
| `--transition-slow` | ✓ | **0** |
| `--accent-blue-hover` | ✓ | **0** |
| `--macos-bg` | ✓ | **0** |

Os quatro tokens da Dock são o caso mais grave porque **não são apenas mortos, são duplicados**: `base.css:18-24` define `--dock-bg: rgba(255,255,255,0.35)`, `--dock-blur: saturate(200%) blur(40px)` e uma sombra completa; `dock.css:53-62` define, hardcoded, `rgba(255,255,255,0.25)`, `saturate(180%) blur(30px)` e uma sombra diferente. **Existem dois sistemas visuais da Dock e o token está a mentir sobre qual está ativo.** Quem editar `base.css` a pensar em ajustar a Dock não verá alteração nenhuma.

### C2 — CSS `:hover` da Dock em conflito com `whileHover` do Framer Motion [OBS] · Severidade: MÉDIA

`dock.css:94-102`:
```css
.dock-item:hover { transform: translateY(-8px) scale(1.15); }
.dock-item:hover + .dock-item,
.dock-item:has(+ .dock-item:hover) { transform: translateY(-4px) scale(1.05); }
```

`Dock.jsx:121-126`, no mesmo elemento:
```jsx
whileHover={{ scale: 1.2, y: -14, ... }}
whileTap={{ scale: 1.05, y: -6 }}
```

O Framer Motion escreve `transform` como **estilo inline**, que vence qualquer regra CSS. Portanto:
- A regra `.dock-item:hover` (translateY -8px, scale 1.15) **nunca se aplica** — é sempre substituída pelos valores do Framer (-14px, 1.2). Código morto com aparência de código vivo.
- A ampliação dos **itens adjacentes** (o efeito de "onda" característico da Dock do macOS) funciona apenas até o utilizador passar o rato pela primeira vez sobre um item. A partir daí, o Framer deixou um `transform` inline permanente nesse elemento, que passa a ignorar a regra de vizinhança para sempre [INF].

Resultado: o efeito assinatura da Dock do macOS degrada-se silenciosamente após a primeira interação. **Requer confirmação visual** [VER], mas o mecanismo é determinístico.

### C3 — Números mágicos com dependências não declaradas [OBS] · Severidade: MÉDIA

| Valor | Local | Problema |
|---|---|---|
| `520px` | `dock.css:24` (largura da `.dock-thin-bar`) | Fixo. Numa janela de desktop estreita (<520 px) a barra é cortada. Não tem relação com a largura real da Dock. |
| `800px` | `dock.css:42` (largura da `.dock-trigger`) | Zona de hover mais larga do que um viewport de tablet inteiro. |
| `100px` | `desktop.css:14` (`padding-bottom`) e `finder.css:12` | Reserva espaço para a Dock. Se a altura da Dock mudar, é preciso alterar em dois ficheiros. Devia ser um token. |
| `3px` / `6px` | `dock.css:25`, `responsive.css:15` | Altura da barra fina. Ver **M2** — é o alvo de toque principal em mobile. |
| `80px` | `dock.css:199` (`.dock-backdrop { bottom: 80px }`) | Terceiro valor independente para "altura da Dock". |
| `480px` (max-height) | `finder.css:271` vs `440px` em `:283` | Duas alturas máximas encadeadas, com 24 px de padding entre elas. Frágil. |
| `52px` | `finder.css:92` (`.finder-toolbar`) | Espaçador vazio para centrar o título, igualando a largura dos semáforos. Coincidência mantida à mão. |
| `0.5px` | `dock.css:29` (`border-top`) | Arredonda para 0 em ecrãs com DPR 1 → bordo invisível em alguns browsers [INF]. |

### C4 — `overflow: hidden` global no `html`, `body` e `#root` [OBS] · Severidade: ALTA (mobile)

`base.css:74-79`:
```css
html, body, #root { height: 100%; width: 100%; overflow: hidden; }
```

Isto é uma decisão deliberada e correta para a metáfora de "desktop de sistema operativo": a página não faz scroll, as janelas fazem. O custo é que **qualquer conteúdo que exceda o viewport torna-se permanentemente inacessível** — não há scroll de recurso. Combinado com `height: 100%` (em vez de `dvh`), é a raiz de dois problemas de mobile documentados na secção seguinte (**M1** e **M7**).

### C5 — `responsive.css` contém estilos que não são responsivos [OBS] · Severidade: BAIXA

As linhas 99-159 de `responsive.css` contêm **todos** os estilos da página 404 (`.not-found`, `.not-found-logo`, `.not-found-code`, `.not-found-title`, `.not-found-text`, `.not-found-btn`). Não têm nada de responsivo. Estão ali por conveniência, não por organização. Deviam viver em `notfound.css` (ou junto do componente), deixando `responsive.css` apenas com media queries.

### C6 — `animations.css` é um ficheiro vazio e não importado [OBS] · Severidade: BAIXA

5 linhas, apenas um comentário: *"Reservado para animações futuras que não necessitem de Framer Motion"*. Não consta de `main.jsx`. É um placeholder que nunca foi preenchido.

### C7 — `.menubar-item.active` definido e nunca aplicado [OBS] · Severidade: BAIXA

`menubar.css:64-67` estiliza o estado ativo de um item de menu. `MenuBar.jsx` não aplica a classe `active` em nenhuma circunstância (grep confirma: zero ocorrências de "active" no ficheiro). Consequência funcional: **quando o Finder está aberto, nada na MenuBar indica qual a categoria em exibição.** O CSS para resolver isto já existe; só falta ligá-lo.

### C8 — `.menubar-logo:hover` sugere interatividade inexistente [OBS] · Severidade: BAIXA

`menubar.css:31-33` aplica um fundo em hover a uma `<div>` que não é botão nem link e não tem handler. O utilizador recebe *affordance* de clique e o clique não faz nada. No macOS real, o menu da aplicação abre um dropdown; aqui não abre nada.

### C9 — Breakpoints não tokenizados e sem `min-width` [OBS] · Severidade: BAIXA

Existem exactamente dois breakpoints, ambos `max-width` (768px e 480px), escritos literalmente. Não há tokens (as media queries não suportam `var()`, o que é uma limitação real do CSS, mas o projeto também não usa nenhuma convenção documentada). A abordagem é *desktop-first* por descarte (`display: none` para esconder), o que é coerente com a história do projeto mas torna cada adição mobile numa subtração.

---

# Mobile / Responsive Analysis

Esta é a secção mais importante do relatório.

## Ponto de partida factual

`client/CLAUDE.md:143` declara: **"Mobile não é prioritário — 99% dos clientes usam Mac desktop."** O CSS reflete fielmente esta decisão: 51 linhas de media queries que escondem elementos, mais 46 que ajustam dimensões. Não é negligência — é uma escolha assumida que agora precisa de ser revertida.

O resultado prático não é "o site está feio no telefone". É **o site está funcionalmente incompleto no telefone**.

## Os três bloqueadores funcionais

### M1 — 35% do catálogo é inalcançável em ecrãs ≤480px [OBS] · Severidade: **CRÍTICA**

**Causa exata:** `responsive.css:60-62` → `.finder-sidebar { display: none; }`

**Cadeia causal:**
1. A sidebar é o **único** elemento de UI que permite trocar de subcategoria (`FinderWindow.jsx:67-76`).
2. `FinderWindow.jsx:24-28` autoseleciona `category.subcategories[0]`.
3. Escondendo a sidebar, o utilizador fica preso na primeira subcategoria de cada categoria.

**Produtos inacessíveis num telemóvel — 13 de 37 (35%):**

| Categoria › Subcategoria | Produto | ID |
|---|---|---|
| Livros › Capa Dura | Gramática da Língua Chinesa | `ld1` |
| Livros › Capa Dura | GPS da Vida Cristã | `ld2` |
| Livros › Capa Dura | O Arquivo da Venerável Ordem Terceira de São Francisco do Porto | `ld3` |
| Livros › Capa Dura | GPS Peregrino | `ld4` |
| Calendários › 4 Macetes | Calendário de Parede 4 Macetes | `cal4a` |
| Calendários › 4 Macetes | Calendário Grupolis 4 Macetes | `cal4b` |
| Embalagens › Cartolina | Caixa Celeiro | `ct1` |
| Embalagens › Cartolina | Caixa Sun Booster | `ct2` |
| Embalagens › Cartolina | Caixa Ptit Truc | `ct3` |
| Outros › Postais | Postal Duotone | `pos1` |
| Outros › Postais | Postal a Cores | `pos2` |
| Outros › Calendários de Secretária | Calendário de Secretária JMV 2025 | `csec1` |
| Outros › Embalagens Redondas | Embalagem Redonda — Collagen Lemon | `emr1` |

Vale a pena notar **o que** está inacessível: a categoria inteira de capa dura (os trabalhos de encadernação mais prestigiantes), o calendário de secretária com impressão estocástica (o único produto que menciona explicitamente a técnica destacada no SEO), e as embalagens de cartolina. É, plausivelmente, o melhor material de portfólio da empresa.

Em ecrãs entre 481px e 768px a sidebar existe, mas com `width: 160px` (`responsive.css:22`) — cerca de 25% da largura de um tablet em retrato.

### M2 — A navegação principal desaparece e o substituto é um alvo de 6 px [OBS] · Severidade: **CRÍTICA**

**Causas combinadas:**
- `responsive.css:8-10` → `.menubar-nav { display: none; }` a partir de ≤768px. Os 6 links de categoria desaparecem.
- `Dock.jsx:18-19` → a Dock aparece a 2 800 ms e **esconde-se a 6 500 ms**. Janela de descoberta: 3,7 segundos.
- Depois disso, o único modo de a reabrir num dispositivo de toque é `onTouchStart` na `.dock-thin-bar` (`Dock.jsx:57`), que tem `height: 3px` no desktop e **`height: 6px`** em mobile (`responsive.css:15`).

**Consequências:**

1. **O alvo de toque tem 6 px de altura.** A WCAG 2.5.8 (AA) exige 24×24 CSS px; a WCAG 2.5.5 (AAA) e as diretrizes da Apple exigem 44×44. Estamos a 25% do mínimo AA.
2. **A posição é a pior possível.** `bottom: 0` num telefone é onde o iOS Safari desenha a sua barra de ferramentas (partilhar/tabs) e onde o iPhone tem a área do *home indicator*, que intercepta gestos verticais. Toques nessa faixa são frequentemente capturados pelo sistema ou pelo browser, não pela página [INF].
3. **A descoberta depende de uma animação temporizada.** Um utilizador que abra o site e olhe primeiro para o logótipo (a intenção do design, com o logo a animar durante 1,2 s e a tagline até aos 2,7 s) tem a atenção deliberadamente dirigida para o **centro** do ecrã exactamente durante os 3,7 s em que a Dock está visível no **fundo**. O design compete consigo mesmo.
4. **O elemento é `aria-hidden="true"`** (`Dock.jsx:58`) e é uma `motion.div` sem `role`, sem `tabIndex` e sem handler de teclado. Para um leitor de ecrã ou para navegação por teclado, **o mecanismo de reabertura da navegação não existe**.

Um utilizador de telemóvel que perca a janela de 3,7 segundos fica num site sem qualquer navegação visível. A única saída é recarregar a página.

### M3 — O contacto não é acessível em mobile [OBS] · Severidade: **CRÍTICA** (comercial)

`MenuBar.jsx:36-49`. O email `geral@classicaag.pt`:
- está dentro de `.contacts-hover-dropdown`, com `opacity: 0; pointer-events: none` por defeito
- só é revelado por `menubar.css:125` → `.contacts-hover-wrapper:hover .contacts-hover-dropdown`
- o `<button className="contacts-trigger">` **não tem `onClick`** [OBS]
- o email é texto num `<span>`, **não é um `<a href="mailto:">`** [OBS]

Em dispositivos de toque não existe `:hover`. O iOS Safari emula um hover no primeiro toque para elementos com regras `:hover`, mas o comportamento é inconsistente e o dropdown fecha ao toque seguinte em qualquer lugar. Mesmo que apareça, o email não é tocável para abrir o cliente de correio, nem existe número de telefone, nem endereço.

O único lugar onde o email é fiavelmente acessível em mobile é... dentro do `<noscript>` (`index.html:97`), que só é mostrado se o JavaScript estiver desativado.

**Para um site cuja função declarada é "apoio comercial", o contacto ser inalcançável no dispositivo que o proprietário provavelmente tem no bolso é o defeito mais caro do projeto.**

## Tabela de análise mobile por área

| Área | Estado atual | Problema | Severidade | Direção recomendada |
|---|---|---|---|---|
| **Landing** | `.desktop` fixed inset:0, logo `min(420px,55vw)`, tagline `clamp(18px,2.5vw,26px)` com `flex-wrap: nowrap` | Overflow horizontal estimado de **+11 px a 375 px** e **+66 px a 320 px** de viewport; com `overflow:hidden` global as primeiras e últimas letras são cortadas sem recurso [OBS+INF] | **ALTA** | Permitir `flex-wrap: wrap` em ≤480px ou reduzir `letter-spacing` e o mínimo do `clamp`; validar em 320/360/375 px |
| **Landing — CLS** | `.desktop-logo` tem `width` mas nenhum `height` nem `aspect-ratio` | A imagem LCP (1686×418) não reserva espaço; ao carregar, empurra a tagline. Contribui diretamente para CLS [INF] | **ALTA** | `aspect-ratio: 1686/418` + `width`/`height` explícitos |
| **MenuBar** | `height: 32px` fixa; nav escondida ≤768px; sem safe-area | 32 px é a altura do macOS, não de um telefone. Os itens têm ~24 px de altura útil (padding 4px + 13px de texto), abaixo do mínimo AA de 24 px. Perde toda a função de navegação | **ALTA** | Em mobile: altura ≥44 px, botão de menu explícito, contacto como ação primária |
| **Dock** | Auto-mostra 2,8 s → auto-esconde 6,5 s; reabre por toque numa barra de 6 px em `bottom:0` | Ver **M2**. Alvo 6 px vs mínimo 44 px; zona interceptada pelo browser/SO | **CRÍTICA** | Em mobile a Dock deve ser navegação permanente (barra de abas fixa) e não um elemento oculto acionado por hover |
| **Dock — hover** | `whileHover` do Framer + `.dock-item:hover` CSS + `.dock-label` só visível em hover | Os rótulos das categorias (`dock-label`) só aparecem em hover (`dock.css:190`) → num telefone os 6 ícones são **SVG sem texto**. "Rotulagem" é uma etiqueta, "Outros" são 4 quadrados: não são autoexplicativos | **ALTA** | Rótulos sempre visíveis em mobile, sob os ícones |
| **Finder — janela** | `width:100vw; height:92vh` a ≤480px; overlay `align-items:flex-end` | `92vh` no iOS Safari refere-se ao *large viewport*: com a barra do browser visível, ~8-15% da janela fica por baixo da UI do browser. Combinado com `align-items:flex-end`, o topo da janela (onde está o botão de fechar) é o que sobra visível, mas o fundo é cortado [INF] | **ALTA** | `100dvh`/`100svh`, `position: fixed` com `inset: 0`, tratar como vista de ecrã inteiro |
| **Finder — sidebar** | `display: none` a ≤480px; `width:160px` a ≤768px | Ver **M1**. 35% do catálogo inacessível | **CRÍTICA** | Segmented control horizontal no topo ou drawer; nunca remover sem substituto |
| **Product grid** | `1fr 1fr` a ≤480px, `gap:12px`; card com `padding:14px` e imagem `height:180px` | Duas colunas num telefone de 375 px dão ~168 px por card, com a imagem a 180 px de altura — proporção estranha. Alguns nomes de produto têm 60+ caracteres (`ld3`) e ocupam 4 linhas | **MÉDIA** | Uma coluna com card horizontal (imagem à esquerda, nome+resumo à direita) ou 2 colunas com altura de imagem proporcional |
| **Product card — tilt** | `onMouseMove` + `getBoundingClientRect` por evento | Não existe em toque. O `product-card:hover` (elevação, sombra, `scale(1.05)` na imagem) também não. Num telefone os cards não têm nenhum feedback de interatividade além do `whileTap` ausente | **MÉDIA** | Substituir por feedback de pressão (`whileTap`) em mobile; tilt apenas em dispositivos com ponteiro fino |
| **Product detail** | `.detail-info-vertical` com `max-width:720px; margin:0 auto`; imagem `max-width:650px; max-height:480px` | Sem media query específica. `.detail-spec` usa `justify-content: space-between` com `.spec-value { max-width: 60% }` — em 375 px, pares como "Impressão miolo" / "240p a 2/2 + 16p a 4/4 cores" comprimem-se a ~40%/60% de ~340 px, forçando quebras feias em ambas as colunas [INF] | **ALTA** | Especificações em duas linhas (label acima, valor abaixo) em ≤600px |
| **Product detail — imagem** | `loading="lazy"` na imagem principal (`ProductDetail.jsx:36`) | É o conteúdo principal da vista, nunca fora do viewport. Deveria ser `fetchpriority="high"`. Não impede o carregamento, mas atrasa a prioridade | **MÉDIA** | `loading="eager"` + `fetchpriority="high"` na imagem ativa |
| **Galeria** | Thumbnails `<button>` de 90×~80 px, `flex-wrap: wrap` | Os alvos de toque são adequados (>44 px) ✓. Mas não há gesto de arrastar entre imagens, não há indicador de posição ("1 de 3"), e a imagem grande não é ampliável (sem zoom/lightbox) | **ALTA** | Swipe horizontal + indicador de pontos + toque para ampliar em ecrã inteiro. Ver **CX3** |
| **Navegação/retorno** | Fechar = botão de 12 px ou toque no overlay; voltar = `.back-btn` | O `.traffic-light.close` tem **12×12 px** (`finder.css:45-46`) — 27% do mínimo de 44 px. O ícone `×` dentro só aparece em `:hover` do grupo (`finder.css:62`), logo em mobile o botão é um **círculo vermelho sem símbolo** | **ALTA** | Em mobile: botão de fechar ≥44 px com ícone sempre visível |
| **Botão Voltar do browser** | Nenhum estado na URL | Voltar sai do site em vez de fechar o Finder ou voltar da vista de detalhe. Em Android, onde o gesto de voltar é o principal padrão de navegação, isto é uma quebra de expectativa grave | **ALTA** | Sincronizar estado com a URL; usar o histórico |
| **Contacto** | Dropdown `:hover`, texto sem `mailto:` | Ver **M3**. Inacessível em toque | **CRÍTICA** | Contacto como item de navegação de primeiro nível; `<a href="mailto:">` e `<a href="tel:">` |
| **Scroll** | `html,body,#root { overflow:hidden }`; scroll apenas em `.finder-main-content` e `.finder-sidebar` | Se o conteúdo da landing exceder o viewport (telefone pequeno em paisagem), fica inacessível — não há scroll de recurso. Não existe `-webkit-overflow-scrolling` nem `overscroll-behavior: contain` nas áreas roláveis, pelo que o *scroll chaining* e o efeito de *rubber-band* do iOS podem propagar-se ao fundo [INF] | **MÉDIA** | `overscroll-behavior: contain` nos contentores roláveis; garantir que a landing nunca ultrapassa a altura do viewport |
| **Toque** | Nenhum `touch-action`; `onTouchStart` em 2 locais | Sem `touch-action: manipulation` nos botões → atraso de ~300 ms no clique em alguns browsers e risco de duplo-toque para zoom acidental. Overlay com `onClick` de fechar → um toque impreciso fecha a janela inteira | **MÉDIA** | `touch-action: manipulation` nos elementos interativos |
| **Orientação** | Nenhuma media query de `orientation`; `isMobile` medido uma só vez | Em paisagem num telefone (altura ~390 px), o Finder a `92vh` ≈ 360 px de altura menos 52 px de barra de título = ~300 px para a grelha. Rodar o dispositivo não reavalia `isMobile` | **MÉDIA** | Media query de `orientation: landscape` com alturas mínimas; `matchMedia` com listener |
| **Safe areas** | Sem `viewport-fit=cover`, sem `env(safe-area-inset-*)` | **Não é atualmente um bug.** Sem `viewport-fit=cover`, o iOS Safari já restringe o viewport à área segura e todos os `env()` valem 0. Só se torna necessário **se** a Fase 2 adotar desenho de bordo a bordo | **BAIXA (hoje)** | Só introduzir `viewport-fit=cover` **em conjunto** com `env(safe-area-inset-*)`; nunca um sem o outro |
| **Zoom** | `<meta viewport width=device-width, initial-scale=1.0>` sem `maximum-scale` nem `user-scalable=no` | **Correto.** O zoom do utilizador está permitido, cumprindo a WCAG 1.4.4. Boa decisão, explicitamente elogiada | ✓ | Manter |

## Estratégia responsiva recomendada

O princípio orientador deve ser: **mesmo produto, modelo de interação diferente onde é necessário.** Não é "adicionar media queries", nem substituir o conceito macOS por um site corporativo genérico.

### Desktop (≥1024px) — preservar integralmente

Nada a mudar no modelo de interação. Manter Desktop, MenuBar, Dock com hover, janela Finder com semáforos, sidebar, grelha e tilt 3D. As correções desta fase (acessibilidade do modal, reduced-motion, imagens, `AnimatePresence`) são invisíveis para o utilizador de desktop, exceto por serem melhores.

### Tablet (768–1023px) — desktop adaptado

O modelo de desktop **aguenta-se** aqui, com três ajustes:
- A MenuBar mantém a navegação de categorias (hoje desaparece aos 768px — o breakpoint está demasiado alto).
- A sidebar do Finder volta a `width: 200px` em vez de 160px.
- A Dock deixa de depender de hover: torna-se persistente ou é acionada por um botão explícito, porque um iPad é um dispositivo de toque com ecrã grande — exactamente o caso que a deteção atual `isMobile` classifica bem mas o CSS classifica mal.
- Grelha em 3 colunas.

### Mobile (≤767px) — modelo de interação nativo, identidade visual preservada

A metáfora macOS **não tem de ser abandonada**; tem de ser traduzida. A tradução natural é iOS, que é a mesma linguagem de design da Apple num formato de toque:

| Elemento desktop | Tradução mobile | Justificação |
|---|---|---|
| **MenuBar** (32 px, nav + relógio) | Barra superior de ~48 px: "Clássica" à esquerda, botão de contacto à direita. Sem relógio | O relógio é adorno de desktop; o espaço horizontal de um telefone é o recurso mais escasso |
| **Dock** (hover, autoesconde) | **Barra de abas inferior permanente** com os 6 ícones + rótulos, respeitando `env(safe-area-inset-bottom)` | Padrão nativo do iOS; resolve M2 sem inventar nada. A Dock do macOS e a tab bar do iOS são o mesmo conceito |
| **Janela Finder** (flutuante, semáforos) | **Vista de ecrã inteiro** que desliza de baixo para cima, com `100dvh` e um botão "Fechar"/chevron de ≥44 px no topo | Mantém a sensação de "abrir algo"; elimina o problema de `92vh` e do botão de 12 px |
| **Sidebar de subcategorias** | **Segmented control horizontal com scroll** logo abaixo do título | Resolve M1. Padrão iOS conhecido; mais descobrível do que um drawer, porque as opções estão sempre visíveis |
| **Grelha de produtos** | 1 coluna com cards horizontais, ou 2 colunas com proporção de imagem correta | Permite mostrar nome completo e um resumo |
| **Detalhe do produto** | Vista dedicada empilhada (push), com botão Voltar no topo e especificações em duas linhas | Padrão de navegação hierárquica iOS |
| **Galeria** | Carrossel com swipe + pontos indicadores + toque para ampliar em ecrã inteiro | Ver **CX3**: é o requisito comercial central |
| **Contacto** | Ação de primeiro nível na barra superior **e** na barra de abas, com `mailto:`/`tel:` | Resolve M3 |
| **Tilt 3D** | Substituído por `whileTap` (escala descendente) sob `@media (hover: none)` | Preserva o feedback de interação sem exigir ponteiro |

Recomendo **`@media (hover: hover) and (pointer: fine)`** como discriminador principal para efeitos de hover, em vez de `max-width`. É a pergunta certa: "este dispositivo tem um ponteiro preciso?" — e resolve corretamente o caso do portátil com touchscreen e do iPad com trackpad.

---

# Accessibility Analysis

Avaliação orientada por WCAG 2.2, níveis A e AA.

## O que já está correto [OBS]

| Item | Evidência |
|---|---|
| `<html lang="pt">` | `index.html:2` |
| Zoom do utilizador permitido (1.4.4) | `index.html:11` — sem `maximum-scale` nem `user-scalable=no` |
| `:focus-visible` global com contorno de 2 px (2.4.7) | `base.css:87-90` |
| Elementos interativos são `<button>`, não `<div>` | Todos os 5 pontos de interação verificados: MenuBar, Dock, sidebar, cards, thumbnails |
| Landmarks parciais | `<header class="menubar">`, `<nav aria-label="Menu principal">`, `<main class="desktop">`, `<aside class="finder-sidebar">`, `<header class="finder-titlebar">` |
| `aria-label` em botões cujo texto é insuficiente | `MenuBar.jsx:26`, `Dock.jsx:120`, `FinderWindow.jsx:49`, `ProductDetail.jsx:53` |
| `aria-hidden="true"` em elementos decorativos | `Dock.jsx:58`, `Dock.jsx:82` |
| `alt` descritivo nas imagens de conteúdo | `ProductGrid.jsx:60` (`alt={product.name}`), `Desktop.jsx:10`, `NotFound.jsx:13` |
| `role="toolbar"` na Dock | `Dock.jsx:90` |
| Fallback `<noscript>` com conteúdo real | `index.html:93-100` |

Isto é mais do que a maioria dos projetos desta dimensão tem. As falhas abaixo são reais, mas partem de uma base decente.

## Falhas confirmadas

### AC1 — O diálogo modal não é um diálogo [OBS] · WCAG 4.1.2, 2.4.3, 2.1.2 · Severidade: **ALTA**

`FinderWindow.jsx:38-46` — o overlay e a janela são `motion.div` sem qualquer semântica de diálogo:

- ❌ Sem `role="dialog"`
- ❌ Sem `aria-modal="true"`
- ❌ Sem `aria-labelledby` a apontar para o `<h1 class="finder-title">`
- ❌ Sem mover o foco para dentro da janela ao abrir (grep: zero ocorrências de `.focus()` em todo o projeto)
- ❌ Sem *focus trap* — Tab sai da janela para a MenuBar e para a Dock, que estão atrás do overlay mas continuam na ordem de tabulação
- ❌ Sem devolução de foco ao botão de origem quando fecha
- ❌ Sem `aria-hidden` ou `inert` no conteúdo de fundo

Consequência para um utilizador de teclado ou leitor de ecrã: abre-se uma janela e o foco permanece no botão da MenuBar/Dock que a abriu. Tabular percorre primeiro toda a MenuBar e a Dock (elementos visualmente escondidos atrás de um overlay escuro) antes de chegar ao conteúdo da janela — se chegar. Não há forma de saber que uma janela abriu.

**Nota positiva relacionada:** `Escape` funciona (`App.jsx:40-44`), o que cumpre parcialmente 2.1.2. É o único mecanismo de saída por teclado que existe.

### AC2 — Alvos de toque abaixo do mínimo [OBS] · WCAG 2.5.8 (AA, mínimo 24×24) · Severidade: **ALTA**

| Elemento | Dimensão | vs. 24×24 (AA) | vs. 44×44 (AAA/Apple) |
|---|---|---|---|
| `.dock-thin-bar` (mobile) | largura × **6 px** | ❌ 25% | ❌ 14% |
| `.dock-thin-bar` (desktop) | 520 × **3 px** | ❌ 13% | ❌ 7% |
| `.traffic-light` (fechar) | **12 × 12 px** | ❌ 50% | ❌ 27% |
| `.menubar-item` | auto × ~**24 px** | ⚠️ limite | ❌ 55% |
| `.finder-sidebar-item` | 100% × ~**34 px** | ✓ | ⚠️ 77% |
| `.product-thumb` | 90 × ~**80 px** | ✓ | ✓ |
| `.dock-item` | ~54 × ~**54 px** | ✓ | ✓ |
| `.back-btn` | auto × ~**33 px** | ✓ | ⚠️ 75% |

O botão de fechar a 12×12 px é agravado por `finder.css:55-64`: o `<svg>` com o símbolo `×` tem `opacity: 0` e só passa a `1` no `:hover` do grupo `.finder-traffic-lights`. Em mobile, **o botão de fechar é um círculo vermelho vazio de 12 px**.

### AC3 — Ausência total de suporte a `prefers-reduced-motion` [OBS] · WCAG 2.3.3 (AAA), 2.2.2 (A) · Severidade: **ALTA**

Zero ocorrências em todo o projeto. Inventário do que ignora a preferência do utilizador:

| Animação | Local | Duração | Notas |
|---|---|---|---|
| Logo (fade + scale) | `Desktop.jsx:13-15` | 1,2 s | |
| Tagline (bloco) | `Desktop.jsx:21-23` | 0,9 s, delay 0,8 s | |
| **Tagline (29 caracteres individuais)** | `Desktop.jsx:30-36` | 0,4 s cada, stagger 35 ms, delay base 1,0 s → **termina a ~2,0 s** | 29 elementos animados em sequência |
| Linha decorativa (scaleX) | `Desktop.jsx:44-46` | 0,8 s, delay 2,2 s → termina a **3,0 s** | |
| Dock (entrada por mola) | `Dock.jsx:92-98` | mola, dispara a 2,8 s | |
| Dock (auto-hide) | `Dock.jsx:19` | dispara a 6,5 s | Movimento não iniciado pelo utilizador |
| Dock item (hover/tap) | `Dock.jsx:121-126` | mola | |
| Finder overlay + janela | `FinderWindow.jsx:38-45` | mola (stiffness 300) | |
| Grelha (entrada em cascata) | `ProductGrid.jsx:55-57` | `delay: index * 0.05` → até 0,6 s com 12 cards | |
| **Tilt 3D** | `ProductGrid.jsx:9-20` | contínuo, ligado ao rato | Movimento perspetivado — gatilho conhecido de desconforto vestibular |
| Detalhe (slide-in) | `ProductDetail.jsx:13-16` | translação em X | |
| Troca de imagem da galeria | `ProductDetail.jsx:38-41` | 0,25 s | |
| Info do detalhe | `ProductDetail.jsx:65-68` | 0,35 s, delay 0,15 s | |
| Spinner | `finder.css:466` | rotação infinita | Nunca renderizado (código morto) |

A sequência de abertura da landing tem **~3 segundos de movimento contínuo** com 29 elementos animados individualmente. O tilt 3D é movimento com perspetiva controlado pelo ponteiro. Para utilizadores com sensibilidade vestibular, esta combinação é ativamente desconfortável.

A correção é desproporcionadamente simples face ao impacto: o Framer Motion tem `<MotionConfig reducedMotion="user">`, que aplicado uma vez em `App.jsx` desativa automaticamente animações de transformação em toda a árvore, preservando as de opacidade. Mais uma media query CSS para a rotação do spinner e para as transições CSS puras.

### AC4 — A página principal não tem `<h1>` [OBS] · WCAG 1.3.1, 2.4.6 · Severidade: MÉDIA

A landing (`Desktop.jsx`) contém apenas uma `<img>` e `<span>`s. **Nenhum elemento de cabeçalho.** O único `<h1>` do site está dentro do Finder (`FinderWindow.jsx:59`, o nome da categoria) e na página 404.

Para um leitor de ecrã, a página inicial é: um landmark de banner com uma nav, um main sem título, e uma imagem cujo `alt` é "Clássica Artes Gráficas". Não há estrutura de documento navegável por cabeçalhos.

Nota adicional: usar `<h1>` para o **nome da categoria** dentro de um diálogo é semanticamente discutível — o `<h1>` deveria ser o título da página; o título do diálogo deveria ser `<h2>` referenciado por `aria-labelledby`.

### AC5 — Navegação por teclado incompleta [OBS] · WCAG 2.1.1 · Severidade: ALTA

Teste conceitual dos caminhos de navegação:

| Ação | Funciona por teclado? | Detalhe |
|---|---|---|
| Abrir categoria pela MenuBar | ✅ | `<button>` nativo, Tab + Enter/Espaço |
| Abrir categoria pela Dock | ⚠️ | Os `<button>` são focáveis, mas a Dock tem `opacity: 0` e `pointerEvents: 'none'` quando escondida (`Dock.jsx:93-97`). **`opacity: 0` não remove da ordem de tabulação** → é possível focar um botão invisível e ativá-lo. Foco invisível = falha de 2.4.7 |
| Mostrar a Dock por teclado | ❌ | `show()` só é chamado por `onMouseEnter` / `onTouchStart`. Não há caminho por teclado |
| Trocar de subcategoria | ✅ | `<button>` nativo |
| Abrir produto | ✅ | O card é `motion.button` |
| Voltar do detalhe | ✅ | `.back-btn` é `<button>` |
| Navegar a galeria | ⚠️ | As thumbnails são `<button>` focáveis ✓, mas não há navegação por setas nem `role="tablist"`/`aria-selected` — o estado ativo é apenas visual (classe CSS `active`) |
| Fechar a janela | ✅ (2 formas) | `Escape` global + botão de fechar focável |
| Acessar contacto | ❌ | Depende exclusivamente de `:hover` CSS. O `<button>` "Contactos" é focável mas **não tem `onClick` nem `onFocus`** → focar não revela nada. O email é inalcançável por teclado |
| Voltar a estado anterior | ⚠️ | Só `Escape`/botão. Não há histórico |

**Não encontrei nenhuma armadilha de teclado** (nenhum elemento que capture o foco sem saída) [OBS]. O problema é o inverso: o foco escapa livremente para onde não devia.

Ponto adicional: **não existe link "saltar para o conteúdo"**, e não é necessário aqui — a nav tem 8 elementos. Não recomendo adicionar por ritual.

### AC6 — Estado ativo transmitido apenas por cor [OBS] · WCAG 1.4.1 · Severidade: MÉDIA

- `.finder-sidebar-item.active` (`finder.css:141-144`): fundo azul `--accent-blue` + texto branco. Não há `aria-current="true"` nem `aria-selected`. Para quem não distingue o azul ou usa leitor de ecrã, a subcategoria selecionada é indeterminável.
- `.product-thumb.active` (`finder.css:330-333`): bordo `rgba(0,0,0,0.25)` sobre fundo `rgba(0,0,0,0.04)` — um contraste de bordo muito subtil, sem indicação programática.

### AC7 — Contrastes no limite ou insuficientes [OBS+VER] · WCAG 1.4.3 · Severidade: MÉDIA

Cálculos sobre fundo branco (`#fff`) ou `--finder-bg`:

| Elemento | Cor | Contraste calculado | Requisito | Estado |
|---|---|---|---|---|
| `.tagline-text` | `rgba(0,0,0,0.35)` sobre gradiente `#e8e8ed`→`#f5f5f7` | **≈ 2,6:1** | 4,5:1 (texto normal) | ❌ **Falha** |
| `.empty-state` | `rgba(0,0,0,0.35)` sobre `#fff` | **≈ 3,0:1** | 4,5:1 | ❌ **Falha** |
| `.finder-sidebar-title` | `rgba(0,0,0,0.4)` sobre `#f5f5f7` | ≈ 3,3:1 | 4,5:1 (11 px, não é "grande") | ❌ **Falha** |
| `.detail-section-title` | `rgba(0,0,0,0.4)` sobre `#fff` | ≈ 3,5:1 | 4,5:1 (12 px) | ❌ **Falha** |
| `.spec-label` | `rgba(0,0,0,0.5)` sobre `#fbfbfb` | ≈ 4,4:1 | 4,5:1 (13 px) | ⚠️ Limite |
| `.product-thumb-label` | `rgba(0,0,0,0.5)` sobre `rgba(0,0,0,0.03)` | ≈ 4,4:1 | 4,5:1 (11 px) | ⚠️ Limite |
| `.product-description` | `rgba(0,0,0,0.65)` sobre `#fff` | ≈ 6,9:1 | 4,5:1 | ✓ |
| `.menubar-item` | `rgba(0,0,0,0.85)` sobre `rgba(255,255,255,0.72)` | ≈ 12:1 | 4,5:1 | ✓ |
| `.not-found-text` | `rgba(255,255,255,0.5)` sobre `#1d1d1f` | ≈ 5,3:1 | 4,5:1 | ✓ |

A **tagline é o caso mais grave**: é o texto de posicionamento da marca ("Fique com boa impressão nossa"), aparece sobre um gradiente claro a 35% de opacidade, e falha por uma margem larga. É deliberadamente subtil — é uma escolha estética consciente — mas a 2,6:1 muitos utilizadores simplesmente não a leem. Escurecer para `rgba(0,0,0,0.55)` mantém o carácter discreto e passa o critério [INF].

Os valores dependem do gradiente de fundo, pelo que **devem ser confirmados com ferramenta de contraste no browser** [VER].

### AC8 — `alt` redundante nas thumbnails [OBS] · Severidade: BAIXA

`ProductDetail.jsx:55`: `<img alt={img.label || 'Imagem N'}>` dentro de um `<button aria-label={img.label || 'Imagem N'}>`. O leitor de ecrã anuncia o mesmo texto duas vezes. A imagem é decorativa no contexto do botão → `alt=""` é o correto.

### AC9 — Botões desativados sem explicação [OBS] · Severidade: BAIXA

`FinderWindow.jsx:52-57`: os semáforos de minimizar e maximizar têm `disabled` e **nenhum `aria-label`**. Um leitor de ecrã anuncia "botão, indisponível" sem dizer que botão. São puramente decorativos (fidelidade ao macOS) → deveriam ser `aria-hidden="true"` em vez de botões desativados.

---

# Performance Analysis

## JavaScript [OBS]

| Chunk | Bruto | Gzip |
|---|---|---|
| `index-cQ3s8qtk.js` | 216,9 KB | **64,4 KB** |
| `vendor-motion-DPQffCq1.js` | 117,1 KB | **38,5 KB** |
| `vendor-react-Dmy3VYT0.js` | 44,8 KB | **15,8 KB** |
| `index-M9NQfIWS.css` | 15,4 KB | **3,9 KB** |
| `index.html` | 5,6 KB | 1,7 KB |
| **Total** | **399,8 KB** | **124,3 KB** |

124 KB gzip de JS+CSS para um site com esta riqueza de animação é **perfeitamente razoável**. Não é aqui que está o problema de performance.

### P1 — `manualChunks` não faz o que parece fazer [OBS] · Severidade: MÉDIA

`vite.config.js:14-17`:
```js
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-motion': ['framer-motion']
}
```

Inspeccionei o conteúdo real de cada chunk procurando assinaturas internas do react-dom:

| Assinatura | `index` | `vendor-react` |
|---|---|---|
| `__reactContainer` | **1** | 0 |
| `hydrateRoot` | **1** | 0 |
| `onRecoverableError` | **2** | 0 |
| `createBrowserRouter`/`RouterProvider`/`useNavigate` | 0 | **2** |

**Conclusão: o react-dom está no chunk `index` (222 KB), não no `vendor-react` (45,9 KB). O `vendor-react` contém apenas o react-router.**

A causa é precisa: `main.jsx:2` importa `react-dom/client`, que é um módulo diferente de `react-dom`. A chave `'react-dom'` no `manualChunks` só corresponde ao módulo resolvido para o especificador exato `react-dom`; `react-dom/client` e o seu grafo de dependências não correspondem e caem no chunk de entrada.

Impacto real de cache: o chunk que contém o react-dom (~186 KB) é o **mesmo** que contém os dados dos produtos (~21 KB medidos) e o código da aplicação. **Cada vez que o proprietário adiciona um produto, o utilizador volta a descarregar 222 KB, incluindo o react-dom inteiro** [INF] — exactamente o oposto do que a divisão em vendor chunks pretende. Como o workflow documentado é "adicionar produtos e fazer push", isto acontece com frequência.

A correção é usar a forma de função do `manualChunks` (`id.includes('node_modules/react-dom')`) ou simplesmente remover a configuração e deixar o Vite decidir — o resultado por defeito seria melhor do que o atual.

### P2 — Todo o catálogo está no bundle inicial [OBS] · Severidade: BAIXA — **não recomendo alterar**

`products.js` é importado estaticamente e contribui **~21 KB** (medidos no chunk minificado) para o bundle de entrada. Todos os 37 produtos, descrições e especificações são descarregados antes de o utilizador clicar em qualquer coisa.

**Isto está bem assim.** 21 KB brutos (~6 KB gzip) é menos do que uma única imagem miniatura. Fazer *code splitting* por categoria adicionaria complexidade, latência de rede por navegação e um estado de carregamento a gerir, para poupar alguns kilobytes. **Não fazer.** Registo o achado para o descartar explicitamente — se o catálogo crescer para centenas de produtos com descrições longas, a conclusão muda.

## Imagens [OBS] — o verdadeiro problema

Ver a secção *Asset Analysis*. Resumo do impacto em performance:

| Métrica | Valor |
|---|---|
| Peso total da biblioteca | **60,57 MB** |
| Pior grelha (Postais) | **8,1 MB** para 2 miniaturas de ~200 px |
| Pior fluxo (Postais → detalhe) | **21,2 MB** |
| Média por grelha | 3,1 MB |
| Imagens em formato moderno | 0 |
| Imagens com `srcset` | 0 |
| Imagens com dimensões intrínsecas | 0 |
| Sobredimensionamento típico | 3072–4096 px de largura para exibição a 200–650 px → **fator 5-15×** |

Estimativa conservadora do ganho com otimização (redimensionar para 2× o tamanho de exibição, converter para WebP com qualidade 82, gerar duas larguras com `srcset`): **60,57 MB → ~4-6 MB**, uma redução de 90-93% [INF]. Nos ficheiros de 6-7 MB a redução individual será superior a 97%.

Isto é, de longe, a intervenção de maior impacto do projeto inteiro.

## Animações [OBS]

### P3 — Layout thrashing no tilt 3D · Severidade: MÉDIA

`ProductGrid.jsx:9-20` executa `getBoundingClientRect()` (leitura forçada de layout) seguido de escrita em `style.transform` a **cada evento `mousemove`**, sem `requestAnimationFrame`. Com um rato a 1000 Hz de polling num monitor a 120 Hz, são dezenas de ciclos leitura-escrita por frame.

Mitigação parcial que já existe: as propriedades animadas (`rotateX`, `rotateY`, `scale`) são todas compostas em GPU, e `transition: transform 0.15s ease-out` (`ProductGrid.jsx:35`) suaviza. O `rect` de um card só muda se o layout mudar, pelo que poderia ser calculado uma vez em `mouseenter` em vez de em cada `mousemove` [INF]. **Requer medição em Performance profiler para quantificar** [VER].

### P4 — `mix-blend-mode` + `filter` + transformações 3D na mesma pilha · Severidade: MÉDIA

- `finder.css:211` — `.product-card-image img { mix-blend-mode: multiply }`
- `finder.css:285-286` — `.product-image { mix-blend-mode: multiply; filter: drop-shadow(0 4px 20px ...) }`
- `finder.css:314` — `.product-thumb img { mix-blend-mode: multiply }`
- `ProductGrid.jsx:19` — `perspective(600px) rotateX() rotateY() scale()` no contentor pai

`mix-blend-mode` força a criação de um contexto de empilhamento e obriga o compositor a ler o backdrop; combinado com uma transformação 3D no ancestral, pode invalidar a promoção para camada e forçar repintura por frame em vez de composição pura [INF]. `drop-shadow` numa imagem de 3072×4096 px é um filtro aplicado sobre a bitmap decodificada.

Adicionalmente, `backdrop-filter` aparece em 4 locais (`menubar.css:10`, `dock.css:27`, `dock.css:54`, `menubar.css:107`, `responsive.css:158`). Cada um é uma superfície de blur em tempo real. Em Safari iOS, `backdrop-filter` sobre uma área grande é notoriamente pesado [VER].

Nada disto é errado por si — o efeito visual é bom e é parte da identidade. É um custo a medir, não a eliminar por princípio.

### P5 — Cascata de entrada da grelha com atraso crescente [OBS] · Severidade: BAIXA

`ProductGrid.jsx:57` — `transition={{ delay: index * 0.05 }}`. Com 8 produtos, o último card aparece 400 ms depois do primeiro. É elegante e intencional. Registo apenas porque, combinado com imagens de vários MB, dá a sensação de que a interface é lenta quando o que é lento é a rede.

## Carregamento inicial [OBS]

O que é descarregado antes de qualquer interação:

| Recurso | Peso |
|---|---|
| `index.html` | 5,6 KB |
| CSS | 15,4 KB (3,9 gzip) |
| 3 chunks JS | 378,8 KB (118,7 gzip) |
| `logo_white.jpg` (**preload**, PNG real) | **407 KB** |
| `favicon.png` (JPEG 1024×1024) | **55 KB** |
| **Total** | **~862 KB** (**~584 KB** com compressão de texto) |

Mais de **70% do peso do carregamento inicial são duas imagens** — um logótipo e um favicon — que juntas deveriam pesar menos de 40 KB.

## Riscos de Core Web Vitals

| Métrica | Risco | Análise |
|---|---|---|
| **LCP** | **Alto** | O elemento LCP é `.desktop-logo`. Tem `<link rel="preload">` (bem feito, `index.html:14`) mas são 407 KB de PNG para exibir a ≤420 px. Além disso é animado com `initial={{ opacity: 0 }}` → **o Framer Motion renderiza-o com `opacity: 0` durante 1,2 s**. Um elemento com `opacity: 0` não conta como candidato a LCP; o LCP só é registado quando a opacidade se torna perceptível. **A animação de entrada está a atrasar deliberadamente o LCP em até 1,2 s** [INF]. Requer confirmação em campo [VER] |
| **CLS** | **Médio-Alto** | Nenhuma `<img>` tem `width`/`height` ou `aspect-ratio`. A grelha está protegida por `.product-card-image { height: 180px }` ✓. **Não protegidos:** `.desktop-logo` (elemento LCP, num flex centrado → deslocar a tagline ao carregar) e `.product-image` no detalhe (`max-height` apenas). A cascata de entrada e a tagline animada usam `transform`/`opacity`, que **não** contam para CLS ✓ |
| **INP** | **Médio** | O clique no card é uma mudança de estado que monta `ProductDetail` e inicia a descarga de uma imagem de vários MB. O `mousemove` do tilt não conta para INP (não é interação discreta) mas compete por main thread. A cascata de 3 efeitos do `FinderWindow` gera 3-4 renders por troca de categoria |
| **TTFB** | Baixo | Estático na CDN da Vercel |
| **Fontes** | **Nenhum risco** ✓ | `--font-system` usa apenas fontes do sistema (`-apple-system`, `BlinkMacSystemFont`, `SF Pro`, `Segoe UI`). **Zero webfonts, zero FOIT, zero FOUT.** Excelente decisão, e particularmente coerente com a estética macOS |

**Nota metodológica:** não executei Lighthouse nem recolhi métricas de campo. Não invento pontuações. Todas as conclusões acima são derivadas da estrutura do código e dos pesos reais dos ficheiros; a confirmação numérica exige uma passagem de Lighthouse/WebPageTest em produção [VER].

---

# Security Analysis

Apesar de ser um site estático sem backend, fiz uma revisão completa de segurança de frontend.

## Resultado das buscas por padrões perigosos [OBS]

| Padrão | Ocorrências em `src/` + `index.html` |
|---|---|
| `dangerouslySetInnerHTML` | **0** ✓ |
| `innerHTML` | **0** ✓ |
| `eval(` | **0** ✓ |
| `new Function` | **0** ✓ |
| `document.write` | **0** ✓ |
| `alert(` / `debugger` | **0** ✓ |
| `console.*` | **0** ✓ |
| `fetch(` / `axios` / `XMLHttpRequest` | **0** ✓ |
| `target="_blank"` | **0** ✓ (sem risco de reverse tabnabbing) |
| `<iframe>` | **0** ✓ |
| `localStorage` / `sessionStorage` / `document.cookie` | **0** ✓ |
| `http://` (recursos não seguros) | **0** ✓ |
| Scripts de terceiros / CDN externos | **0** ✓ |
| `.env*` no repositório | **0** ✓ |
| `process.env` / `import.meta.env` | **0** ✓ |
| Segredos, tokens, chaves versionados | **0** ✓ |

**Não foram encontrados segredos.** Nada a redigir.

O único uso de API do browser é `window.location.reload()` (`ErrorBoundary.jsx:39`) e `'ontouchstart' in window || navigator.maxTouchPoints` (`Dock.jsx:14`). Ambos benignos.

Todo o conteúdo dinâmico é interpolado como filhos de JSX (`{product.name}`, `{product.description}`, `{char.value}`), o que o React escapa automaticamente. Os dados são estáticos e controlados pelo autor — não há input de utilizador em nenhum ponto da aplicação. **A superfície de XSS é efetivamente nula.**

## Tabela de achados

| Achado | Severidade | Evidência | Recomendação |
|---|---|---|---|
| **Nenhum cabeçalho de segurança configurado** | **MÉDIA** | `client/vercel.json` contém apenas `rewrites`. Sem `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` [OBS] | Adicionar bloco `headers` no `vercel.json`. Uma CSP restritiva é viável **precisamente porque** não há scripts externos: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'`. Nota: os dois blocos `<script type="application/ld+json">` inline em `index.html` requerem `'unsafe-inline'` em `script-src` **ou** hashes SHA — preferir hashes |
| **Sem proteção contra enquadramento (clickjacking)** | **BAIXA** | Ausência de `X-Frame-Options` / `frame-ancestors` [OBS] | Incluir `frame-ancestors 'none'` na CSP. O risco real é baixo (não há ações autenticadas a sequestrar), mas o site poderia ser enquadrado por um terceiro a apresentar-se como a gráfica |
| **Rewrite SPA universal mascara 404 de assets** | **MÉDIA** | `vercel.json` reescreve `/(.*)` → `/index.html`. A Vercel serve ficheiros estáticos primeiro, pelo que assets existentes funcionam; mas um pedido a uma imagem **inexistente** devolve o documento HTML com **HTTP 200** em vez de 404 [INF] | Restringir o rewrite (ex.: excluir `/imagens/`, `/assets/`) para que assets em falta devolvam 404 real. Também melhora a deteção de erros e o comportamento de `onError` |
| **`react-router-dom` 7.13.0 com 4 advisories** | **MÉDIA** (contextualizada) | `npm audit`: GHSA-337j-9hxr-rhxg (SSR hydration), GHSA-chx6-hx7r-mcp5 (DoS por route matching), GHSA-2j2x-hqr9-3h42 (open redirect com `//`), GHSA-qwww-vcr4-c8h2 (CSRF em modo RSC). Severidade **high** no agregado [OBS] | Atualizar para ≥7.18.2. **Contexto importante:** três dos quatro advisories dizem respeito a SSR, RSC e ao servidor de rotas — modos que esta aplicação **não usa** (é 100% cliente, sem servidor). O de route matching é o único teoricamente aplicável, e com 2 rotas o vetor é irrelevante. É uma atualização de higiene, não uma emergência |
| **10 vulnerabilidades em dependências de build** | **BAIXA** (não expostas em produção) | `vite` (5 advisories), `rollup` (path traversal), `postcss`, `brace-expansion`, `minimatch`, `flatted`, `js-yaml`, `picomatch`, `ajv`, `@babel/core` [OBS] | Atualizar quando conveniente. **Nenhuma destas chega ao browser** — são ferramentas de compilação. Vários advisories do Vite (`server.fs.deny` bypass, WebSocket arbitrary file read) afetam apenas o **dev server**, que nunca está exposto publicamente. O de `launch-editor`/NTLM é específico do dev em Windows |
| **Dependência extraneous não declarada** | **BAIXA** | `@vercel/analytics@1.6.1` presente em `node_modules`, ausente do `package.json`, não importado em `src/` [OBS] | Remover de `node_modules` (via `npm ci`) ou declarar e usar. Um pacote instalado fora do lockfile é uma inconsistência de cadeia de fornecimento, ainda que benigna |
| **`.idea/` versionado apesar de estar no `.gitignore`** | **BAIXA** | `git ls-files .idea` devolve 5 ficheiros; `.gitignore:26` contém `.idea/` [OBS] | `git rm --cached -r .idea`. Os ficheiros atuais (`.iml`, `misc.xml`, `modules.xml`, `vcs.xml`) não contêm dados sensíveis, mas `workspace.xml` — presente em disco, **não** versionado — contém histórico de ficheiros abertos e configurações locais. O padrão está a um commit acidental de expor isso |
| **`robots.txt` refere um `/admin/` inexistente** | **INFORMACIONAL** | `Disallow: /admin/` [OBS] | Remover. Não há painel de admin. Anunciar caminhos administrativos inexistentes é ruído; anunciar existentes seria pior |
| **Sem integridade de subrecursos** | **N/A** ✓ | Não há recursos externos | Nada a fazer — mencionado só para registar que foi verificado |
| **HSTS / TLS** | **REQUER VERIFICAÇÃO** | Gerido pela Vercel; não inspecionável a partir do repositório [VER] | Confirmar em produção que o domínio `www.classicaag.pt` força HTTPS e envia HSTS, e que `classicaag.pt` (sem www) redireciona para a versão canónica |

---

# Dependency Analysis

## Dependências de produção

| Dependência | Versão | Propósito | Usada? | Risco | Recomendação |
|---|---|---|---|---|---|
| `react` | 19.2.4 | Framework | ✅ Sim | Nenhum | Manter. Patch disponível (19.2.8) — **opcional** |
| `react-dom` | 19.2.4 | Renderizador DOM | ✅ Sim (`react-dom/client`) | Nenhum | Manter. Patch 19.2.8 — **opcional** |
| `framer-motion` | 12.31.0 | Todas as animações | ✅ Sim, extensivamente (8 dos 11 componentes) | Nenhum advisory | **Manter.** 38,5 KB gzip é substancial mas justificado — é a identidade visual do produto. Há 13.0.0 (major) disponível; **não atualizar em major durante a Fase 2**, é risco desnecessário. Aproveitar `MotionConfig reducedMotion="user"`, que já existe na versão instalada |
| `react-router-dom` | 7.13.0 | 2 rotas + `useNavigate` | ⚠️ **Subutilizada** | 4 advisories (ver acima) | **Atualizar para ≥7.18.2** e depois **usar a fundo**: URLs para categoria/subcategoria/produto. Já se paga o custo de 15,8 KB gzip por duas rotas; usá-la resolve deep linking, botão Voltar e indexação SEO de uma só vez. Removê-la seria a decisão errada |

## Dependências de desenvolvimento

| Dependência | Versão | Propósito | Usada? | Risco | Recomendação |
|---|---|---|---|---|---|
| `vite` | 7.3.1 | Build + dev server | ✅ Sim | 5 advisories, **só em dev** | Atualizar para 7.3.6 (patch, seguro). **Não** ir para 8.x durante a Fase 2 |
| `@vitejs/plugin-react` | 5.1.3 | JSX + Fast Refresh | ✅ Sim | Nenhum | Manter |
| `eslint` | 9.39.2 | Linting | ⚠️ Configurado mas **inutilizável** (ver **Q1**) | Nenhum | Corrigir a configuração antes de atualizar |
| `@eslint/js` | 9.39.2 | Regras base | ✅ Sim | Nenhum | Manter |
| `eslint-plugin-react-hooks` | 7.0.1 | Regras de hooks | ✅ Sim — **está a apanhar problemas reais** (4 erros `set-state-in-effect`) | Nenhum | Manter. Está a fazer o seu trabalho |
| `eslint-plugin-react-refresh` | 0.4.26 | Validação de HMR | ✅ Sim | Nenhum | Manter |
| `globals` | 16.5.0 | Globais do browser para ESLint | ✅ Sim | Nenhum | Manter |
| `@types/react` | 19.2.11 | Tipos TS | ❌ **Não** — o projeto não usa TypeScript e não há `jsconfig.json`/`tsconfig.json` | Nenhum | Inofensivo. Só ajuda se o editor estiver configurado para inferência de tipos em JS. Manter ou remover, indiferente |
| `@types/react-dom` | 19.2.3 | Tipos TS | ❌ **Não** | Nenhum | Idem |
| **`eslint-plugin-react`** | **AUSENTE** | Regra `react/jsx-uses-vars` | — | **É a causa de Q1** | **Adicionar.** É a única dependência nova que recomendo |

## Recomendação priorizada de dependências

**Críticas:** nenhuma. Não há vulnerabilidade explorável na aplicação em produção.

**Importantes:**
1. Adicionar `eslint-plugin-react` (ou reconfigurar `no-unused-vars`) para tornar `npm run lint` utilizável.
2. `react-router-dom` → ≥7.18.2.

**Opcionais:** patches de `vite`, `react`, `react-dom`, `framer-motion` (dentro da mesma major).

**Explicitamente NÃO recomendo:** atualizações de versão major (`vite` 8, `framer-motion` 13, `eslint` 10, `@vitejs/plugin-react` 6) durante a Fase 2. Introduzem risco de regressão sem benefício para os objetivos definidos. Também **não recomendo** `npm audit fix --force`, que faria exactamente isso.

---

# SEO Analysis

## O que está muito bem feito [OBS]

Esta é a segunda área mais forte do projeto, e está claramente acima do típico:

| Item | Estado |
|---|---|
| `<title>` descritivo com localização | ✅ "Clássica Artes Gráficas — Impressão de Qualidade no Porto" (57 caracteres, dentro do ideal) |
| `<meta name="description">` | ✅ 243 caracteres, com produtos e localização. Ligeiramente acima dos ~160 que o Google exibe, mas o excedente não penaliza |
| `<link rel="canonical">` | ✅ `https://www.classicaag.pt/` |
| `<html lang="pt">` | ✅ |
| Open Graph completo | ✅ `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale` (`pt_PT`), `og:site_name` |
| Twitter Card | ✅ `summary_large_image` com título, descrição e imagem |
| JSON-LD `LocalBusiness` | ✅ nome, URL, logo, email, endereço, descrição, `priceRange`, `knowsAbout` com 17 competências |
| JSON-LD `WebSite` | ✅ |
| `robots.txt` | ✅ Presente, com `Sitemap:` declarado |
| `sitemap.xml` | ✅ Válido, com `lastmod`, `changefreq`, `priority` |
| Verificação do Search Console | ✅ `google00462744c179bb85.html` |
| Fallback `<noscript>` | ✅ Com `<h1>`, descrição e email — indexável mesmo sem JS |
| Meta geo | ✅ `geo.region: PT-13`, `geo.placename: Porto` |

## Problemas

### S1 — Existe um único URL indexável para 37 produtos [OBS] · Severidade: **ALTA**

Este é o problema de SEO do projeto, e é o mesmo problema de **A1**.

O conteúdo de `products.js` é, do ponto de vista de SEO, ouro: 37 fichas técnicas com terminologia real e específica do setor — *"impressão estocástica"*, *"cosido e cartonado"*, *"micro canelado fundo automático"*, *"Munken Pure 90gr"*, *"verniz UV mate"*, *"plastificação alimentar"*, *"lombo redondo, transfil e fitilho"*. São exactamente os termos que um comprador profissional de artes gráficas escreve no Google.

Neste momento **nada disto é indexável**, porque:
- Todo o conteúdo é renderizado por JavaScript após interação do utilizador (clique numa categoria).
- Não existe URL para nenhuma categoria, subcategoria ou produto.
- O sitemap tem, corretamente, uma única entrada — não há mais nada a apontar.
- O Googlebot renderiza JavaScript, mas **não clica** em botões para descobrir conteúdo escondido atrás de estado local.

O `<meta name="keywords">` (`index.html:19`) — com 60+ termos — é uma tentativa de compensar isto. **O Google ignora `keywords` desde 2009.** Não prejudica, mas não faz nada. O conteúdo real que essas keywords tentam representar já existe em `products.js`; falta apenas dar-lhe URLs.

Introduzir rotas (`/produtos/:categoria/:subcategoria` e `/produto/:id`) e gerar o sitemap a partir dos dados transformaria 1 URL indexável em ~44 (1 + 6 categorias + 37 produtos), cada um com título, descrição e imagem próprios [INF]. Este é o maior ganho de SEO disponível e não requer backend nem SSR — apenas rotas no cliente e um sitemap gerado no build.

### S2 — A página principal não tem `<h1>` [OBS] · Severidade: MÉDIA

Ver **AC4**. A hierarquia de cabeçalhos na landing é: nenhuma. O `<h1>` do `<noscript>` só conta para agentes sem JS.

### S3 — Falta `og:image:width` / `height` e `og:image:alt` [OBS] · Severidade: BAIXA

Sem dimensões declaradas, algumas plataformas (LinkedIn em particular) não pré-renderizam a pré-visualização no primeiro acesso. Além disso, `og:image` aponta para `logo_white.jpg` — 1686×418, que é uma proporção de ~4:1 e está declarado como `summary_large_image` (que espera ~1.91:1). O logótipo aparecerá com barras ou recortado [INF]. Uma imagem OG dedicada de 1200×630 resolveria.

### S4 — `og:image` é um PNG de 407 KB com extensão `.jpg` [OBS] · Severidade: BAIXA

Ver secção de assets. Alguns *crawlers* de pré-visualização recusam imagens acima de determinados limites ou que não correspondam ao `Content-Type` esperado [VER].

### S5 — 404 devolve HTTP 200 [OBS] · Severidade: BAIXA

O rewrite universal em `vercel.json` faz com que qualquer URL inexistente devolva o `index.html` com estado 200, e o React mostra `NotFound`. O Google classifica isto como *soft 404*. Com apenas um URL válido o impacto atual é mínimo; **passa a importar assim que existirem rotas de produto** (URLs antigos, links partilhados com erros de escrita, etc.).

### S6 — JSON-LD sem `telephone`, `streetAddress` nem `openingHours` [OBS] · Severidade: MÉDIA (SEO local)

O bloco `LocalBusiness` (`index.html:44-80`) tem `addressLocality: "Porto"`, `addressRegion`, `addressCountry` — mas **não tem `streetAddress`, `postalCode`, `telephone`, `geo` nem `openingHoursSpecification`**. Para SEO local (o vetor mais valioso para uma gráfica no Porto), estes campos são os que alimentam o painel de conhecimento e os resultados de mapa. Se a empresa tem morada e telefone públicos, omiti-los é deixar valor na mesa. Requer informação do proprietário [VER].

### S7 — Não há `ImageObject` nem `Product` no structured data [OBS] · Severidade: BAIXA

Só faz sentido depois de existirem URLs por produto (**S1**). Nesse momento, `Product` ou `CreativeWork` por item, com `image` e `material`, seria genuinamente útil — não é um truque de SEO, é descrever com precisão o que a página contém.

### S8 — Contacto não é marcado como dados de contacto [OBS] · Severidade: MÉDIA

O email existe em três locais (`MenuBar.jsx:3`, `index.html:51` no JSON-LD, `index.html:97` no noscript) mas em nenhum deles como `<a href="mailto:">` no documento visível. Isto prejudica simultaneamente a UX (M3), a acessibilidade (AC5) e a extração automática de dados de contacto.

---

# Browser Compatibility Analysis

## Funcionalidades usadas e o seu suporte

| Funcionalidade | Uso | Chrome | Safari | Firefox | Edge | Safari iOS | Chrome Android | Notas |
|---|---|---|---|---|---|---|---|---|
| `backdrop-filter` | 5 locais, com prefixo `-webkit-` ✓ | ✅ | ✅ | ✅ 103+ | ✅ | ✅ | ✅ | Bem prefixado. **Custo de performance** em áreas grandes no iOS [VER] |
| `:has()` | `dock.css:100` | ✅ 105+ | ✅ 15.4+ | ✅ 121+ | ✅ | ✅ 15.4+ | ✅ | Degradação graciosa (perde-se apenas o efeito de vizinhança da Dock) |
| `mix-blend-mode` | 3 locais | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Comportamento com CMYK JPEG e PNG com alfa **requer verificação visual** [VER] |
| `clamp()` / `min()` | `desktop.css:20,42`, `finder.css:17,18` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Amplamente suportado |
| `aspect-ratio` | **Não usado** | — | — | — | — | — | — | Devia ser (ver CLS) |
| `100dvh` / `100svh` / `100lvh` | **Não usado** | — | — | — | — | — | — | **É aqui que está o problema.** Ver abaixo |
| `env(safe-area-inset-*)` | **Não usado** | — | — | — | — | — | — | Não é bug hoje (sem `viewport-fit=cover`) |
| `transform: perspective/rotate3d` | Tilt 3D | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Composição em GPU |
| `position: fixed` | MenuBar, Desktop, Dock, overlay | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | No iOS Safari, `position: fixed` com teclado virtual aberto tem comportamento errático. **Não aplicável aqui** — não há inputs de texto no site ✓ |
| `-webkit-background-clip: text` | `menubar.css:38-41` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Tem também `background-clip: text` sem prefixo ✓ |
| `::-webkit-scrollbar` | `base.css:118-140` | ✅ | ✅ | ❌ | ✅ | n/a | n/a | Firefox ignora. Degradação graciosa (scrollbar nativa). Sem fallback `scrollbar-width`/`scrollbar-color` |
| `border: 0.5px` | `dock.css:29` | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | Arredonda para 0 (bordo invisível) em DPR 1 fora do Safari [INF] |
| `white-space: pre-line` | `finder.css:395` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Como as descrições usam `\n` (31 de 37 produtos), isto é essencial e está correto ✓ |

## Tratamento moderno do viewport móvel [OBS] · Severidade: ALTA

Esta é a lacuna de compatibilidade mais relevante.

**Uso atual de unidades de viewport:**

| Local | Valor | Problema |
|---|---|---|
| `base.css:75` | `html,body,#root { height: 100% }` | Com `overflow: hidden`, `100%` resolve para a altura do *layout viewport*. No iOS Safari, quando a barra de ferramentas está visível, parte do conteúdo fica por baixo dela [INF] |
| `responsive.css:89` | `.finder-window { height: 92vh }` (≤480px) | **`vh` = large viewport height no iOS.** Com a barra do browser visível, 92vh pode exceder a área realmente visível. Combinado com `align-items: flex-end` no overlay (`responsive.css:95`), a janela é alinhada ao fundo → o fundo da janela fica sob a UI do browser |
| `responsive.css:27` | `.finder-window { height: 88vh }` (≤768px) | Mesmo problema, com 12% de margem em vez de 8% |
| `finder.css:18` | `height: min(700px, 80vh)` | Em desktop é seguro; em tablets herda o problema |
| `responsive.css:88` | `width: 100vw` | Em mobile é equivalente a 100%. Em desktop com scrollbar visível causaria overflow, mas `overflow: hidden` global evita-o ✓ |
| `responsive.css:104` | `.not-found { min-height: 100vh }` | Mesmo problema, com impacto menor (a página tem conteúdo curto e centrado) |

**Recomendação (aplicar apenas onde é apropriado):**

- `100dvh` para o Finder em mobile — segue a barra do browser dinamicamente. É a unidade correta para uma vista de ecrã inteiro que deve caber sempre.
- `100svh` como *fallback* conservador se o *reflow* de `dvh` durante o scroll se revelar visualmente instável.
- **Não** usar `100lvh` — é precisamente o comportamento problemático de `vh`.
- Padrão de progressive enhancement: `height: 92vh; height: 92dvh;` — browsers antigos ignoram a segunda declaração.
- `env(safe-area-inset-bottom)` **apenas se** a Fase 2 introduzir uma barra de abas fixa no fundo (que é a recomendação de **M2**). Nesse caso, `padding-bottom: env(safe-area-inset-bottom)` na barra e `viewport-fit=cover` na meta viewport passam a ser obrigatórios **em conjunto**. Introduzir `viewport-fit=cover` sem tratar os insets **cria** um bug que hoje não existe.

## Riscos que requerem teste em dispositivo real [VER]

1. Renderização dos dois JPEG CMYK em Safari (desktop e iOS) vs Chrome vs Firefox.
2. `mix-blend-mode: multiply` sobre PNG com canal alfa (os 3 rótulos Nutrimoa e o `logo_white.jpg`) — pode escurecer as zonas transparentes.
3. Custo de `backdrop-filter` no iOS Safari com a MenuBar sempre visível + Dock + dropdown simultâneos.
4. Comportamento de toque na `.dock-thin-bar` a 6 px em `bottom: 0` no iOS Safari e no Chrome Android com barra de navegação por gestos.
5. Se `overflow: hidden` no `body` impede o *scroll chaining* de forma consistente no iOS (historicamente, `body { overflow: hidden }` sozinho é insuficiente no iOS Safari; requer `position: fixed` no body ou `overscroll-behavior`).

---

# Code Quality Findings

## Classificação de severidade usada

- **CRÍTICO** — pode causar quebra grave, problema de segurança ou falha significativa em produção.
- **ALTO** — problema técnico ou de UX significativo.
- **MÉDIO** — questão relevante de qualidade, performance ou manutenibilidade.
- **BAIXO** — melhoria menor.
- **INFORMACIONAL** — não é problema; vale documentar.

## Achados

### Q1 — `npm run lint` está inutilizável [OBS] · Severidade: **ALTA**

Executei `npx eslint .`: **12 erros**. Oito deles são **falsos positivos**:

```
src/components/Desktop/Desktop.jsx     2:10  'motion' is defined but never used
src/components/Dock/Dock.jsx           2:10  'motion' is defined but never used
src/components/Finder/FinderStates.jsx 2:10  'motion' is defined but never used
src/components/Finder/FinderWindow.jsx 2:10  'motion' is defined but never used
src/components/Finder/ProductDetail.jsx 2:10 'motion' is defined but never used
src/components/Finder/ProductGrid.jsx  2:10  'motion' is defined but never used
src/components/NotFound/NotFound.jsx   2:10  'motion' is defined but never used
```

`motion` **é** usado — como `<motion.div>`, `<motion.button>`, `<motion.img>`. A causa raiz é precisa: o ESLint core não reconhece identificadores referenciados dentro de JSX como "usados". A regra que resolve isto é `react/jsx-uses-vars`, do `eslint-plugin-react`, que **não está instalado**. A configuração (`eslint.config.js:23-25`) sobrescreve `no-unused-vars` com `varsIgnorePattern: '^[A-Z_]'`, que só perdoa identificadores em maiúscula — `motion` é minúsculo.

Consequência prática: `npm run lint` devolve sempre erro, logo **nunca é usado**, logo os 4 avisos legítimos de `react-hooks/set-state-in-effect` — que apontam exactamente para o problema **R1** — passam invisíveis. Uma ferramenta de qualidade que grita sempre é uma ferramenta desligada.

Há também `vite.config.js:10:25  '__dirname' is not defined  no-undef`. Este é tecnicamente correto (o pacote é `"type": "module"`, e `__dirname` não existe em ESM), mas **funciona na prática** porque o Vite compila o ficheiro de configuração antes de o executar. O build confirma-o. É ruído de lint, não um bug — mas contribui para o mesmo problema de credibilidade.

### Q2 — Estilos inline dispersos [OBS] · Severidade: BAIXA

8 ocorrências de `style={{...}}`:

| Local | Avaliação |
|---|---|
| `ErrorBoundary.jsx:20,32,35,40` | **Justificado.** Um error boundary não pode depender de CSS que pode ter falhado a carregar. Decisão correta e deliberada |
| `FinderStates.jsx:7` | Dimensões de SVG (16×16) — deviam ser CSS |
| `ProductDetail.jsx:21` | Dimensões de SVG (16×16) — deviam ser CSS |
| `ProductGrid.jsx:35` | `transition` inline no `TiltCard` — está aqui porque colide com o Framer Motion; parte do problema **R2** |
| `NotFound.jsx:30` | `display:flex; flexDirection:column; gap:8px` — devia ser uma classe |

Existe um padrão: os `<svg>` inline recebem dimensões via `style` num ficheiro (`FinderStates.jsx`, `ProductDetail.jsx`) e via CSS noutros (`.detail-section-icon`, `.empty-state-icon`, `.dock-icon svg`). Duas convenções em paralelo para a mesma coisa.

### Q3 — Strings e valores hardcoded que deviam ser configuração [OBS] · Severidade: MÉDIA

| Valor | Locais | Problema |
|---|---|---|
| `geral@classicaag.pt` | `MenuBar.jsx:3`, `index.html:51`, `index.html:97` | **Três fontes de verdade.** Alterar o email exige encontrar as três |
| `https://www.classicaag.pt` | `index.html` × 8 | Aceitável em meta tags, mas impede pré-visualizações em ambientes de staging |
| `'Fique com boa impressão nossa'` | `Desktop.jsx:26` | O slogan da empresa embutido em lógica de animação |
| `/imagens/Logos/logo_white.jpg` | `Desktop.jsx:9`, `NotFound.jsx:11`, `index.html:14,33,41,50` | 6 locais |
| `2800` / `6500` ms | `Dock.jsx:18-19` | Os tempos que determinam a descoberta da navegação em mobile (**M2**), sem nome nem comentário que explique a escolha |
| `300` ms | `App.jsx:36` | Deve corresponder à animação de saída — que não existe (**R3**) |
| `-8` / `8` graus | `ProductGrid.jsx:17-18` | Comentado ✓ (`// tilt max 8°`) |
| `60000` ms | `App.jsx:22` | Intervalo do relógio |

### Q4 — Nomenclatura inconsistente entre camadas [OBS] · Severidade: BAIXA

O projeto mistura português e inglês de forma sistemática mas não documentada:

- **Inglês:** nomes de componentes, ficheiros, classes CSS, props, funções, variáveis de estado (`FinderWindow`, `selectedSubcategory`, `.product-card`, `onCategoryClick`).
- **Português:** dados, textos de UI, comentários, caminhos de imagem (`categories.js`, `/imagens/`, "Voltar", "A carregar...").

Isto é, na verdade, uma escolha **coerente e defensável**: código em inglês, conteúdo em português. O problema é que não está escrito em nenhum sítio, e há fugas nos dois sentidos:
- `finder.css:184` — comentário em português dentro de CSS com nomes em inglês: `/* Animacao movida para framer-motion no Component / JS */` (com erro de acentuação: "Animacao").
- `products.js:16` — a pasta `Micro_Canelado_MC` mistura português e um sufixo `MC` cujo significado só é explicado num comentário.
- `Rotolos`/`rotulagem`/`rotulos` — a categoria chama-se `rotulagem` mas a subcategoria e a pasta chamam-se `rotulos`/`Rotulos`.

### Q5 — Ausência de `.gitattributes` gera diffs fantasma [OBS] · Severidade: MÉDIA

`git status` no repositório mostra **10 ficheiros modificados** — e a análise dos diffs revela que **todas** as alterações são exclusivamente de fim de linha (CRLF vs LF). O conteúdo é byte-a-byte idêntico exceto pelos `\r`:

```
 M .gitignore                    (64 linhas "alteradas" — 32 removidas, 32 adicionadas, idênticas)
 M .idea/.gitignore
 M .idea/classica2.iml
 M .idea/misc.xml
 M .idea/modules.xml
 M .idea/vcs.xml
 M README.md
 M client/public/robots.txt
 M client/src/data/categories.js  (138 linhas "alteradas" — o ficheiro tem 69)
 M client/vercel.json
```

**Estas modificações eram pré-existentes e não foram causadas por esta auditoria** (confirmado: registei o estado de `git status` antes de qualquer operação e nada foi escrito no repositório além de `AUDIT_REPORT.md`).

O impacto é real: `git diff` é inútil, `git status` mostra sempre ruído, e existe risco de commitar acidentalmente 179 linhas de alterações vazias que escondem uma alteração verdadeira. É particularmente provável neste projeto por ser editado em Windows dentro de uma pasta OneDrive. Um `.gitattributes` com `* text=auto eol=lf` resolve definitivamente.

### Q6 — `client/README.md` é o template do Vite, não editado [OBS] · Severidade: BAIXA

Contém texto genérico sobre `@vitejs/plugin-react` vs `plugin-react-swc`, React Compiler e migração para TypeScript. Nenhum é relevante. Entretanto `CLAUDE.md`, no mesmo diretório, é excelente documentação real e específica do projeto. Há um `README.md` útil na raiz. Três ficheiros de documentação, um dos quais é ruído e outro (`CLAUDE.md`) está desatualizado quanto à plataforma de deploy.

### Q7 — Comentários: bons na maioria, com dois casos de desalinhamento [OBS] · Severidade: BAIXA

A qualidade geral dos comentários é **acima da média** — os separadores `// ─── Secção ───` são consistentes, `products.js` tem um cabeçalho de 24 linhas que documenta o workflow de adição de produtos, e `getProducts` tem JSDoc.

Dois comentários que não correspondem ao código:
- `FinderWindow.jsx:5` — `// Componentes extraídos (Single Responsibility Principle)`. A extração está feita e é boa; invocar SRP é decorativo.
- `finder.css:184` — `/* Animacao movida para framer-motion no Component / JS, mas shadow continua aqui */`. A sombra está de facto em CSS ✓, mas o comentário não menciona que o `transform` é escrito imperativamente por `ProductGrid.jsx` — que é a informação que um leitor futuro precisa (ver **R2**).

### Q8 — Zero testes [OBS] · Severidade: MÉDIA

Não existe qualquer ficheiro de teste, nem vitest/jest, nem CI. Para um site vitrina estático, **não recomendo uma suite de testes de componentes** — o retorno não justifica o esforço de manutenção.

Recomendo, isso sim, **uma coisa concreta**: um script de validação de dados (`npm run validate`) que verifique IDs únicos, existência dos caminhos de imagem, presença de campos obrigatórios e ausência de `image`+`images` simultâneos. São ~40 linhas de Node, cobrem exactamente a classe de erro que o workflow manual de `products.js` pode introduzir, e podem correr antes do build. Isso é teste com retorno; testar se um botão renderiza não é.

---

# Dead Code / Duplication

## Código morto confirmado [OBS]

| Item | Local | Evidência |
|---|---|---|
| **`animations.css`** | `src/styles/animations.css` | 5 linhas, apenas comentário. **Não importado** em `main.jsx` |
| **`LoadingState`** | `FinderStates.jsx:14-21` | Exportado e importado (`FinderWindow.jsx:8`) mas nunca renderizado |
| **`.loading-spinner`** | `finder.css:460-468` | Só usado por `LoadingState` |
| **`@keyframes spin`** | `finder.css:470-474` | Só usado por `.loading-spinner` |
| **Animações `exit`** | `FinderWindow.jsx:38,44` | Nunca executam por falta de `AnimatePresence` (**R3**) |
| **`setTimeout` de 300 ms** | `App.jsx:36` | Existe para dar tempo a uma animação que não corre |
| **`.dock-item:hover { transform }`** | `dock.css:94-96` | Sempre sobreposto pelo `whileHover` inline do Framer (**C2**) |
| **`.menubar-item.active`** | `menubar.css:64-67` | A classe nunca é aplicada em `MenuBar.jsx` |
| **`--dock-bg`, `--dock-blur`, `--dock-border`, `--dock-shadow`** | `base.css:18-24` | 0 usos; a Dock hardcoda valores diferentes |
| **`--z-modal`, `--transition-slow`, `--accent-blue-hover`, `--macos-bg`** | `base.css` | 0 usos |
| **`category.icon`** (6 emojis) | `categories.js:10,19,29,39,49,58` | Nunca lido; a Dock usa `ICONS` de `icons.jsx` |
| **`category.description`** (6 textos) | `categories.js` | Nunca lida por nenhum componente |
| **Ramo `return categoryData`** | `products.js:630` | Trata uma forma de dados (categoria como array plano) que não existe em `PRODUCTS` |
| **`public/vite.svg`** | | Resíduo do template Vite, nunca referenciado |
| **`Livros/Capa_Mole/Livro_Dialogos_resumo_M.jpg`** | | 254 KB. Produto removido no commit `551f534`, imagem ficou |
| **`Logos/classica2.png`** | | 125 KB. Logótipo alternativo nunca referenciado |
| **`@vercel/analytics`** | `node_modules` | Instalado, não declarado, não importado |
| **`@types/react`, `@types/react-dom`** | `package.json` | Sem TypeScript nem `jsconfig.json` no projeto |
| **`Disallow: /admin/`** | `robots.txt` | Não existe `/admin/` |
| **`.menubar-logo:hover`** | `menubar.css:31-33` | Afordância de clique sem handler (**C8**) |

## Duplicação confirmada [OBS]

| Duplicação | Locais | Impacto |
|---|---|---|
| **Definição visual da Dock** | `base.css:18-24` (tokens) vs `dock.css:53-62` (hardcoded, valores diferentes) | Fonte de verdade ambígua. Editar os tokens não tem efeito |
| **Altura da Dock, três vezes** | `desktop.css:14` (`padding-bottom: 100px`), `finder.css:12` (`100px`), `dock.css:199` (`bottom: 80px`) | Três números independentes para a mesma dimensão física |
| **Email de contacto, três vezes** | `MenuBar.jsx:3`, `index.html:51`, `index.html:97` | Alterações desincronizáveis |
| **Caminho do logótipo, seis vezes** | `Desktop.jsx:9`, `NotFound.jsx:11`, `index.html:14,33,41,50` | Idem |
| **Ícone de pasta SVG** | `FinderStates.jsx:8` e `FinderStates.jsx:29` — mesmo `path` em `FolderIcon` e no ícone do `EmptyState` | Duplicação trivial mas real (o `d` é idêntico) |
| **Descrições de produto idênticas** | `cat2`/`cat3` (Catálogo Madalena/Valadares) — descrição byte-a-byte igual; `ld2`/`ld4` (GPS da Vida Cristã / GPS Peregrino) — idem; `rot3`/`rot4`/`rot5` (Nutrimoa) — idem exceto o sabor; `cal4a`/`cal4b` — idem | **É legítimo** (são produtos tecnicamente idênticos), mas num contexto comercial, quatro fichas com o mesmo texto lado a lado parecem preenchimento. E para SEO, conteúdo duplicado entre URLs (após **S1**) exigiria atenção |
| **Padrão de normalização `images`/`image`** | `ProductGrid.jsx:49` e `ProductDetail.jsx:5-7` | Duas implementações da mesma regra. Correta em ambas hoje; divergirá quando a regra mudar. Um helper `getProductImages(product)` centralizaria |
| **Estrutura das `motion` props de entrada** | `initial={{opacity:0, y:20}} animate={{opacity:1,y:0}}` repetido em 6 componentes | Candidato natural a variantes partilhadas do Framer Motion |
| **`dist/imagens` vs `public/imagens`** | 62 MB + 61 MB em disco | Não versionado, mas **123 MB a sincronizar via OneDrive**. Vale limpar `dist` localmente |

---

# Bugs / Potential Bugs

## Bugs confirmados (evidência direta no código)

### B1 — As animações de saída do Finder nunca correm [OBS] · Severidade: MÉDIA
**Ficheiros:** `App.jsx:52-54`, `FinderWindow.jsx:38-45`
O render condicional não está envolvido em `<AnimatePresence>`. As props `exit` são ignoradas e a janela desaparece instantaneamente. Ver **R3**.
**Efeito visível:** a janela abre com animação de mola e fecha com corte seco.

### B2 — Estado inconsistente ao trocar de categoria com o Finder aberto [OBS] · Severidade: ALTA
**Ficheiros:** `FinderWindow.jsx:18-35`, `App.jsx:48` (MenuBar acima do overlay por z-index)
**Caminho de reprodução:** com o Finder aberto em "Livros", clicar em "Embalagens" na MenuBar (possível porque `--z-menubar: 300` > `--z-finder: 200`).
**Mecanismo:** a prop `category` muda → o render acontece **antes** dos efeitos → é pintado o título "Embalagens" com os produtos de "Livros" ainda em estado. Só após 2-3 ciclos de efeito (que correm depois da pintura) o conteúdo fica coerente.
**Efeito visível:** um "flash" de produtos errados sob o título novo, e a subcategoria selecionada salta.
**Nota:** o commit `31e520e` ("fix: ... fix Finder navigation performance") sugere que este caminho já causou problemas antes. A correção anterior não eliminou a causa raiz.

### B3 — A navegação por teclado permite ativar botões invisíveis na Dock [OBS] · Severidade: MÉDIA
**Ficheiro:** `Dock.jsx:93-97`
```js
animate={{ opacity: isVisible ? 1 : 0, y: ..., pointerEvents: isVisible ? 'auto' : 'none' }}
```
`opacity: 0` **não** remove elementos da ordem de tabulação, e `pointerEvents: 'none'` só bloqueia o rato — não bloqueia `Enter` num botão focado. Com a Dock escondida (o estado normal após 6,5 s), tabular a partir da MenuBar atravessa 6 botões invisíveis. Premir Enter abre uma categoria sem qualquer indicação visual de qual foi selecionada. Isto é simultaneamente um bug funcional e uma falha de WCAG 2.4.7.

### B4 — Duas fontes de verdade contraditórias para "é mobile" [OBS] · Severidade: MÉDIA
**Ficheiros:** `Dock.jsx:14` (JS: capacidade de toque) vs `responsive.css:5,57` (CSS: largura)
Um portátil Windows com ecrã táctil a 1920px recebe o `dock-backdrop` de fechar-ao-tocar-fora (comportamento mobile) com o layout de desktop. Um iPad Pro em paisagem (1366px) recebe comportamento mobile em JS e layout de desktop em CSS. Ver **R5**.

### B5 — `setTimeout` não limpo em `closeFinder` [OBS] · Severidade: BAIXA
**Ficheiro:** `App.jsx:36`
`setTimeout(() => setActiveCategory(null), 300)` não guarda o handle nem o limpa. Se o componente desmontar nesse intervalo, há um `setState` sobre um componente desmontado (silencioso em React 19). Combinado com **B1**, o timeout não serve propósito nenhum.

### B6 — Erros de conteúdo na ficha técnica de `ld1` [OBS] · Severidade: MÉDIA (conteúdo)
**Ficheiro:** `products.js:217-227`
Livro de **capa dura** com `Acabamento capa: 'Cosido e brochado'` (acabamento de capa mole), dois rótulos começados por "Acabamento", e descrição genérica em contraste com todos os outros produtos. Ver **D3**. **Requer confirmação do proprietário** [VER] — a inconsistência interna é observável, o valor correto não.

### B7 — `favicon.png` é um JPEG declarado como PNG [OBS] · Severidade: BAIXA
**Ficheiros:** `public/favicon.png` (JPEG real, 1024×1024, 55 KB), `index.html:7-9`
Declarado como `type="image/png"` com `sizes="48x48"` e `sizes="192x192"`, e como `apple-touch-icon`. Funciona (os browsers detetam por conteúdo) mas os `sizes` declarados são falsos e um favicon de 55 KB é descarregado em cada visita.

### B8 — `logo_white.jpg` é um PNG [OBS] · Severidade: BAIXA (mas com impacto em LCP)
Imagem LCP, com `preload`, 407 KB, PNG com alfa e extensão `.jpg`. Funciona; é ineficiente e engana qualquer ferramenta de análise.

## Bugs suspeitos (mecanismo identificado, requer verificação em runtime)

### S-B1 — Overflow horizontal da tagline em telefones pequenos [OBS+INF] · Severidade: ALTA · [VER]
**Ficheiros:** `desktop.css:41-47`, `Desktop.jsx:26`
`.tagline-text` tem `flex-wrap: nowrap`, `letter-spacing: 0.12em`, `text-transform: uppercase` e `font-size: clamp(18px, 2.5vw, 26px)`. Em viewports estreitos o `clamp` fixa-se no mínimo de 18px, pelo que a largura do texto **deixa de escalar com o ecrã**.

Estimativa (29 caracteres, avanço médio ≈ 0,62em + 0,12em de espaçamento):

| Viewport | Fonte resolvida | Largura estimada | Overflow |
|---|---|---|---|
| 320 px (iPhone SE 1ª ger.) | 18 px | ~386 px | **+66 px** |
| 360 px (Android comum) | 18 px | ~386 px | **+26 px** |
| 375 px (iPhone SE/mini) | 18 px | ~386 px | **+11 px** |
| 390 px (iPhone 14/15) | 18 px | ~386 px | −4 px (limite) |
| 414 px+ | 18 px | ~386 px | folgado |

Com `overflow: hidden` global e `.desktop` a centrar o conteúdo, o excedente é cortado **simetricamente** nos dois lados — a primeira e a última letra do slogan da empresa desaparecem, sem scroll possível. Precisa de confirmação com métricas de fonte reais [VER], mas a margem em 320-375 px é demasiado estreita para ser segura.

### S-B2 — Janela do Finder cortada pela UI do browser no iOS [INF] · Severidade: ALTA · [VER]
`responsive.css:87-96`: `height: 92vh` + `.finder-overlay { padding: 0; align-items: flex-end }`. Com `vh` = *large viewport*, e a janela alinhada ao fundo, a barra de ferramentas do Safari cobre a base da janela. Ver secção de viewport.

### S-B3 — Cores incorretas nos rótulos To Skin (CMYK) [OBS+INF] · Severidade: MÉDIA · [VER]
Dois JPEG em CMYK, com `mix-blend-mode: multiply` aplicado. O resultado varia por browser. Numa gráfica, cor errada num rótulo é um problema comercial.

### S-B4 — `mix-blend-mode: multiply` sobre PNG com alfa [INF] · Severidade: MÉDIA · [VER]
Os 3 rótulos Nutrimoa são PNG RGBA e o `logo_white.jpg` é PNG RGBA. `multiply` sobre zonas transparentes pode produzir halos ou escurecimento indesejado dependendo do compositor.

### S-B5 — Efeito de vizinhança da Dock deixa de funcionar após o primeiro hover [OBS+INF] · Severidade: BAIXA · [VER]
Ver **C2**. O Framer deixa um `transform` inline permanente que passa a ignorar a regra CSS `:has()`.

### S-B6 — Tilt 3D a interromper a animação de entrada dos cards [OBS+INF] · Severidade: MÉDIA · [VER]
Ver **R2**. Reproduzível movendo o rato sobre a grelha durante os ~600 ms da cascata de entrada.

### S-B7 — Imagens em falta devolvem HTML com estado 200 [INF] · Severidade: BAIXA · [VER]
O rewrite universal em `vercel.json`, combinado com a **ausência total de handlers `onError`** nas `<img>`, significa que uma imagem em falta produz um ícone de imagem quebrada sem qualquer fallback nem log. Atualmente não há imagens em falta ✓, mas o workflow manual de `products.js` torna isto uma questão de tempo.

## Comportamento em cenários de erro [OBS]

| Cenário | Comportamento atual | Avaliação |
|---|---|---|
| Imagem inexistente | Ícone de imagem quebrada. **Sem `onError`**, sem placeholder, sem log | ❌ Sem tratamento |
| `product.images` array vazio | `product.images[0].src` → `TypeError` → o `ProductGrid` inteiro cai para o `ErrorBoundary` | ❌ Frágil (não ocorre hoje) |
| Produto sem `description` | Renderiza `<p>` vazio | ⚠️ Degradação silenciosa |
| Produto sem `characteristics` | A secção é omitida corretamente (`ProductDetail.jsx:87`) | ✅ Bem tratado |
| Subcategoria sem produtos | `EmptyState` com mensagem específica: *"Ainda não existem produtos em «X»"* | ✅ **Bem feito** |
| Categoria inexistente | `openCategory` verifica `if (category)` antes de abrir | ✅ **Bem feito** |
| `getProducts` com IDs inválidos | Devolve `[]` em todos os casos testados | ✅ **Bem feito** |
| Rota inexistente | Componente `NotFound` com logo, código 404 e botão de regresso | ✅ **Bem feito** (embora com HTTP 200) |
| Exceção de render | `ErrorBoundary` com mensagem em português e botão de recarregar | ✅ **Bem feito** |
| Erro em `ErrorBoundary` | Não regista o erro (`getDerivedStateFromError` sem `componentDidCatch`) | ⚠️ Sem diagnóstico |

**Avaliação global do tratamento de erros: bom.** Existem estados vazios, um error boundary e verificações defensivas. As duas lacunas reais são o `onError` nas imagens e a ausência de `componentDidCatch` para registo.

---

# UX Findings

## Desktop

### Pontos fortes [OBS]

1. **O conceito é o ativo mais valioso do projeto.** Uma gráfica com um site que se parece com o macOS comunica exactamente o que o briefing pede: bom gosto, atenção ao detalhe, familiaridade com o mundo do design. Um site corporativo genérico seria uma perda.
2. **A landing é bem calibrada** — logo, slogan animado, linha decorativa, ~3 s até ao repouso. Comunica confiança sem explicar nada.
3. **A metáfora do Finder é imediatamente legível** para o público-alvo (designers, editoras, agências, marcas — todos utilizadores de Mac).
4. **O detalhe de produto está bem estruturado:** imagem grande → título → Descrição → Especificações em tabela zebrada. A hierarquia de leitura é correta e as fichas técnicas são genuinamente informativas.
5. **`white-space: pre-line`** nas descrições preserva os parágrafos escritos à mão. Detalhe pequeno, bem resolvido.
6. **Sair é fácil e óbvio:** três formas de fechar (botão, clique fora, Escape) e um botão "Voltar" claro no detalhe.

### Problemas

| # | Problema | Severidade | Detalhe |
|---|---|---|---|
| UX1 | **A Dock esconde-se aos 6,5 s e a descoberta depende de hover num alvo de 3 px** | ALTA | O mesmo mecanismo de **M2**, menos grave em desktop porque a MenuBar mantém a navegação e porque `.dock-trigger` (800×12 px) dá uma zona de hover generosa. Mas um utilizador que não passe o rato pelo fundo do ecrã nunca volta a ver a Dock |
| UX2 | **Nada indica qual a categoria aberta** | MÉDIA | `.menubar-item.active` existe em CSS e nunca é aplicado (**C7**). Com o Finder aberto, a MenuBar não dá contexto |
| UX3 | **"Contactos" abre um dropdown mas parece um botão** | MÉDIA | É um `<button>` sem `onClick`. Clicar não faz nada. O email não é clicável (`mailto:`) mesmo quando visível |
| UX4 | **Subcategorias com um único produto parecem erro de carregamento** | MÉDIA | Ver **D1**. Um card isolado numa grelha de 220px-mínimo com 24px de gap num painel de ~800px |
| UX5 | **`Catálogos › Catálogos`** | BAIXA | Subcategoria redundante. A sidebar mostra "TIPOS DE CATÁLOGOS" com um único item chamado "Catálogos" |
| UX6 | **Os cards não indicam que há mais informação** | BAIXA | Card = imagem + nome. Nada sugere que clicar revela uma ficha técnica completa. O tilt 3D dá feedback de interatividade mas não de conteúdo |
| UX7 | **Nomes de produto muito longos quebram a grelha** | BAIXA | `ld3` — "O Arquivo da Venerável Ordem Terceira de São Francisco do Porto" — 62 caracteres num card de 220px ocupa 4 linhas, desalinhando a fila |
| UX8 | **A galeria não indica quantas imagens existem** | MÉDIA | As thumbnails aparecem abaixo da imagem grande. Sem contador ("1 de 3"), sem setas. Para `csec1` (3 imagens com rótulos Aberto/Fechado/Lado) funciona; para `mc4` (2 imagens sem rótulos) o utilizador pode não perceber que há uma segunda vista |
| UX9 | **Não é possível ampliar uma imagem** | ALTA | A imagem de detalhe está limitada a `max-width: 650px; max-height: 440px`. Não há lightbox nem zoom. Para inspecionar a qualidade de impressão — que é o ponto de todo o exercício — 650px é insuficiente. Existem ficheiros de 3072×4096 no servidor que o utilizador **nunca consegue ver em tamanho útil** |
| UX10 | **Botões de minimizar/maximizar desativados** | BAIXA | Fidelidade visual ao macOS. Alguns utilizadores vão tentar clicar. Aceitável como decoração, mas deveriam ser `aria-hidden` em vez de `<button disabled>` |
| UX11 | **A tagline é quase ilegível** | MÉDIA | `rgba(0,0,0,0.35)` sobre gradiente claro ≈ 2,6:1. O slogan da empresa é o texto menos legível do site (**AC7**) |
| UX12 | **Escape fecha tudo em vez de voltar** | BAIXA | Com um produto aberto, Escape fecha a janela inteira em vez de regressar à grelha. O padrão esperado é sair um nível de cada vez |

## Mobile

Todos os problemas de desktop aplicam-se, mais os seguintes. A avaliação global é **má** — não por acabamento, mas por funcionalidade.

| # | Problema | Severidade |
|---|---|---|
| MX1 | **35% do catálogo é inalcançável** (sidebar `display: none`) — ver **M1** | **CRÍTICA** |
| MX2 | **Navegação desaparece aos 6,5 s; substituto é um alvo de 6 px na pior posição do ecrã** — ver **M2** | **CRÍTICA** |
| MX3 | **O contacto é inalcançável** (dropdown só por hover, sem `mailto:`) — ver **M3** | **CRÍTICA** |
| MX4 | **Os ícones da Dock não têm rótulo** — `.dock-label` só aparece em `:hover` (`dock.css:190`). Num telefone, a navegação são 6 SVG monocromáticos sem texto. "Rotulagem" é uma etiqueta genérica; "Outros" são quatro quadrados | **ALTA** |
| MX5 | **O botão de fechar é um círculo vermelho de 12 px sem símbolo** — o `×` tem `opacity: 0` até haver hover | **ALTA** |
| MX6 | **O slogan é cortado nas duas pontas em telefones ≤375 px** — ver **S-B1** | **ALTA** |
| MX7 | **A base da janela do Finder fica sob a barra do Safari** (`92vh`) — ver **S-B2** | **ALTA** |
| MX8 | **O botão Voltar do sistema sai do site** em vez de fechar a janela ou voltar da vista de detalhe. Em Android é o gesto de navegação primário | **ALTA** |
| MX9 | **Não há gestos** — nenhum swipe para trocar de imagem na galeria, nenhum swipe para fechar a vista. Tudo depende de toques em alvos pequenos | **ALTA** |
| MX10 | **Não é possível ampliar imagens** (UX9 agravado) — num ecrã de 375 px, um catálogo A4 é apresentado a ~340 px de largura. É impossível avaliar qualidade de impressão | **ALTA** |
| MX11 | **Sem feedback de toque nos cards** — o `:hover` (elevação + sombra + `scale`) e o tilt 3D não existem; não há `whileTap`. Tocar num card não dá confirmação visual antes da transição | **MÉDIA** |
| MX12 | **Especificações comprimidas** — `justify-content: space-between` com `max-width: 60%` no valor força quebras feias em ~340 px de largura | **MÉDIA** |
| MX13 | **Tempos de espera longos** — 3,1 MB por grelha em média, 8,1 MB no pior caso, sem indicador de progresso (o `LoadingState` existe mas nunca é usado) | **ALTA** |
| MX14 | **Toque no overlay fecha a janela** — um toque impreciso na faixa superior de 8% descarta todo o contexto | **MÉDIA** |
| MX15 | **A grelha de 2 colunas dá cards de ~168 px com imagem de 180 px de altura** — proporção estranha e nomes longos ocupam 4-5 linhas | **MÉDIA** |

---

# Commercial UX Audit

O objetivo declarado no briefing é duplo: **portfólio exploratório** e **ferramenta de apresentação de vendas**. Avaliei os dois.

## Cenário 1 — Cliente encontra o site sozinho (desktop)

| Critério | Avaliação |
|---|---|
| Velocidade para encontrar uma categoria | ✅ Boa — 6 categorias visíveis na MenuBar, um clique |
| Velocidade para encontrar um item de portfólio | ✅ Boa — 2-3 cliques até ao detalhe |
| Qualidade de apresentação | ⚠️ Mista — o enquadramento é excelente, mas as imagens estão limitadas a 650px e algumas têm cor suspeita (CMYK) |
| Legibilidade | ⚠️ 4 elementos de texto falham o contraste AA, incluindo o slogan |
| Acessibilidade do contacto | ❌ Escondido atrás de hover, não clicável |
| Credibilidade | ✅ **Alta** — as fichas técnicas com gramagens, papéis e acabamentos concretos demonstram competência real |
| Profissionalismo percebido | ✅ **Alto** em desktop |
| Consistência visual | ✅ Boa — tokens de design, tipografia do sistema, paleta coerente |

**Veredicto: funciona bem.** As fichas técnicas são o diferenciador — um comprador percebe imediatamente que está a lidar com quem domina o ofício.

## Cenário 2 — O proprietário mostra o site numa reunião, em portátil

| Critério | Avaliação |
|---|---|
| Chegar rápido a uma categoria relevante | ✅ Um clique |
| Mostrar vários produtos em sequência | ✅ Grelha → detalhe → Voltar funciona bem |
| Ampliar uma imagem para inspeção | ❌ **Impossível.** Máximo 650×440 px. Ver **UX9** |
| Regressar sem se perder | ✅ Escape / Voltar / clique fora |
| Chegar ao contacto | ⚠️ Precisa de manter o rato parado sobre "Contactos" |
| Impressão premium | ✅ Sim |

**Veredicto: bom, com uma falha central.** A incapacidade de ampliar uma imagem é o problema mais grave do ponto de vista comercial. Quando um cliente pergunta *"a impressão fica assim tão nítida?"*, a resposta atual é uma imagem de 650 px. Os ficheiros de 3072×4096 px estão no servidor, pagos em largura de banda, e inacessíveis ao utilizador.

## Cenário 3 — O proprietário mostra o site no telemóvel

Este é o cenário explicitamente identificado no briefing como prioritário. É também onde o site falha.

| Pergunta do briefing | Resposta |
|---|---|
| *Consegue chegar rapidamente a uma categoria relevante?* | ❌ **Não.** Se passaram mais de 6,5 s desde o carregamento, tem de encontrar uma barra de 6 px no fundo do ecrã. A MenuBar não tem navegação |
| *Consegue mostrar vários produtos?* | ⚠️ **Parcialmente.** Só os da primeira subcategoria de cada categoria — 24 dos 37 |
| *Consegue abrir uma imagem grande o suficiente para inspecionar?* | ❌ **Não.** ~340 px de largura, sem zoom |
| *Consegue voltar sem se perder?* | ⚠️ Botão de 12 px sem símbolo, ou toque numa faixa estreita do overlay. O botão Voltar do sistema sai do site |
| *Consegue chegar ao contacto imediatamente?* | ❌ **Não.** O email está atrás de um dropdown de hover e não é clicável |
| *A interface parece premium num telefone?* | ❌ Parece um site de desktop encolhido |
| *A interação parece intencional?* | ❌ Parece avariada |

**Veredicto: não utilizável para o fim pretendido.** Numa reunião, o proprietário abriria o site, não encontraria navegação, e a demonstração falharia. O risco reputacional é maior do que não ter site em telefone — porque o cliente vê a tentativa a falhar.

Note-se que existe **um caminho que funciona por acidente**: se o proprietário abrir o site e tocar na Dock dentro da janela de 2,8-6,5 s, e escolher uma categoria cuja primeira subcategoria contenha o material que quer mostrar, a experiência é aceitável. Depende de conhecer o site intimamente e agir depressa. Não é um produto; é um truque.

## O que é mais valioso preservar

Recomendo explicitamente **não** tocar em:

1. O conceito macOS/Finder — é o ativo diferenciador.
2. As fichas técnicas de produto — são o que gera credibilidade.
3. A tipografia do sistema — zero webfonts, coerente com a estética, e boa para performance.
4. A landing minimalista com logo + slogan.
5. As descrições multi-parágrafo com `pre-line`.
6. A paleta clara com glassmorphism subtil.

---

# Anti-Pattern Detection

Procurei explicitamente cada anti-padrão da lista. Registo tanto os que existem como os que **não** existem — para não inventar trabalho.

| Anti-padrão | Presente? | Evidência / consequência real |
|---|---|---|
| Abstração prematura | ❌ Não | Os componentes foram extraídos **depois** de crescerem, não antes. `icons.jsx` separa dados de apresentação de forma legítima |
| Sobre-engenharia | ❌ Não | Não há Context desnecessário, HOCs, render props, factories nem camadas de serviço. Para 11 componentes, está proporcionado |
| Prop drilling | ❌ Não | Profundidade máxima de 2 níveis (`MainSite` → `Dock` → `DockItem`). Não justifica Context |
| Componentes gigantes | ❌ Não | O maior é `Dock.jsx` (138 linhas). `products.js` tem 633 linhas mas é **dados**, não lógica — apropriado |
| Ficheiros CSS gigantes | ⚠️ Limite | `finder.css` tem 474 linhas (40% do CSS total). Cobre janela + sidebar + grelha + card + detalhe + galeria + especificações + estados vazios. Candidato razoável a divisão, mas não urgente |
| Lógica de negócio duplicada | ⚠️ Ligeiro | A normalização `image`/`images` está implementada duas vezes (`ProductGrid.jsx:49`, `ProductDetail.jsx:5-7`). Correta em ambas hoje; divergirá quando a regra mudar |
| Dados duplicados | ✅ **Sim** | Email em 3 locais, caminho do logo em 6, altura da Dock em 3 valores diferentes, definição visual da Dock em 2 sistemas contraditórios |
| Magic strings | ✅ **Sim** | Ver **Q3** |
| Magic numbers | ✅ **Sim** | Ver **C3** — `520px`, `800px`, `100px`, `80px`, `2800`, `6500`, `300`, `480px`/`440px` |
| Estado desnecessário | ✅ **Sim** | `products` no `FinderWindow` é estado derivado que deveria ser calculado no render (**R1**) |
| Efeitos desnecessários | ✅ **Sim** | 3 dos 3 efeitos do `FinderWindow` são evitáveis. O ESLint confirma em 4 posições |
| Abuso de efeitos | ✅ **Sim** | Cascata de efeitos encadeados a sincronizar estado com estado (**R1**) |
| Manipulação do DOM em vez de React | ✅ **Sim** | `ProductGrid.jsx:19,25` escreve `card.style.transform` diretamente, num elemento que o Framer Motion também controla (**R2**) |
| Memoização desnecessária | ❌ Não | Verifiquei: `memo` em `Desktop`, `Dock`, `MenuBar`, `FinderWindow`, `ProductGrid`, `ProductDetail`, `DockItem`, `EmptyState`, `LoadingState`. **Todas funcionam** porque as props são estáveis. Não é memoização decorativa |
| Otimização prematura | ⚠️ Ligeiro | O `manualChunks` foi adicionado com boa intenção mas **não funciona** (**P1**). É otimização que se auto-anulou |
| Pressupostos exclusivos de desktop | ✅ **Sim, extensivamente** | Larguras fixas (520/800px), navegação que desaparece, sidebar removida, alvos de 3-12px, deteção de mobile feita uma só vez |
| UX dependente de hover | ✅ **Sim, criticamente** | Contacto (`menubar.css:125`), rótulos da Dock (`dock.css:190`), símbolo do botão de fechar (`finder.css:62`), reabertura da Dock, tilt 3D, elevação dos cards |
| Teatro de acessibilidade | ⚠️ Parcial | `aria-label` está aplicado com correção genuína em 4 locais ✓. Mas `role="toolbar"` na Dock (`Dock.jsx:90`) é ARIA aplicado sem os requisitos que o acompanham: um `toolbar` deve gerir foco com setas e ter `tabindex` roving. Aqui é apenas um contentor com botões. Não prejudica ativamente, mas promete uma semântica que não cumpre |
| Uso indevido de ARIA | ⚠️ Menor | Além do `role="toolbar"`: `aria-hidden="true"` na `.dock-thin-bar` (`Dock.jsx:58`) esconde de tecnologias de apoio o **único mecanismo de reabrir a navegação em mobile**. Está correto marcá-la como decorativa **e** errado não ter alternativa acessível |
| `key={index}` perigoso | ❌ Não | Os 3 usos (`Desktop.jsx:29`, `ProductDetail.jsx:50,99`) são em listas estáticas, nunca reordenadas nem filtradas. Uso legítimo |
| Estado global desnecessário | ❌ Não | Não há biblioteca de estado, e bem |
| Efeitos sem cleanup | ❌ Não | Todos os 4 efeitos com subscrições limpam corretamente |
| Fugas de memória | ❌ Nenhuma confirmada | Uma exceção teórica: `App.jsx:36` (**B5**) |
| `console.log` esquecidos | ❌ Nenhum | Zero ocorrências |
| `TODO`/`FIXME`/`HACK` | ❌ Nenhum | Zero ocorrências |

---

# Recommended Architecture After Remediation

Esta é a arquitetura que recomendo **depois** das melhorias. Não é implementada nesta fase.

## Princípio orientador

> **Mesmo produto, modelo de interação diferente onde é necessário.**

Não substituir o conceito macOS. Não redesenhar a identidade visual. Traduzir a interação para toque onde o hover não existe, e dar URLs ao que já existe.

## Componentes

```
main.jsx
 └─ BrowserRouter
     └─ MotionConfig reducedMotion="user"          ← NOVO: uma linha resolve AC3
         └─ ErrorBoundary                          ← + componentDidCatch para registo
             └─ Routes
                 ├─ /                                          → Landing (Desktop)
                 ├─ /:categoria                                → Finder (categoria)
                 ├─ /:categoria/:subcategoria                  → Finder (subcategoria)
                 ├─ /:categoria/:subcategoria/:produtoId       → Finder (detalhe)
                 └─ *                                          → NotFound
```

Componentes novos ou alterados:

| Componente | Estado | Responsabilidade |
|---|---|---|
| `Shell` | **novo** | Layout persistente: MenuBar + Desktop + navegação (Dock em desktop, TabBar em mobile) + `<Outlet/>` |
| `MenuBar` | alterado | Desktop: como hoje + `aria-current` na categoria ativa. Mobile: altura ≥44 px, sem relógio, com botão de contacto |
| `Navigation` | **novo** (substitui `Dock`) | Escolhe entre `<Dock>` (ponteiro fino) e `<TabBar>` (toque) com base em `useMediaQuery('(hover: hover) and (pointer: fine)')` |
| `Dock` | simplificado | Sem lógica de `isMobile`, sem timers de auto-hide, sem `.dock-thin-bar`. Persistente ou acionada por trigger explícito |
| `TabBar` | **novo** | Barra inferior fixa, 6 ícones com rótulos visíveis, ≥44 px, com `env(safe-area-inset-bottom)` |
| `FinderWindow` | alterado | Recebe `category`/`subcategory`/`product` de `useParams`. Zero `useEffect`. `role="dialog"` + `aria-modal` + focus trap. Envolvido em `AnimatePresence` |
| `SubcategoryNav` | **novo** | Desktop: sidebar (como hoje). Mobile: segmented control horizontal com scroll — **resolve M1** |
| `ProductGrid` | alterado | Tilt via `useMotionValue`/`useTransform` em vez de escrita direta no DOM. `whileTap` em toque |
| `ProductCard` | **novo** (extraído) | Card isolado com `<picture>`, `srcset`, `width`/`height`, `onError` |
| `ProductDetail` | alterado | Especificações em duas linhas em ≤600 px. Imagem principal `eager` + `fetchpriority="high"`. Botão de ampliar |
| `Gallery` | **novo** (extraído) | Swipe horizontal, indicador de posição, `role="tablist"` nas thumbnails, navegação por setas |
| `Lightbox` | **novo** | Imagem em ecrã inteiro com zoom e pan — **resolve UX9/MX10**, o principal requisito comercial |
| `ContactPanel` | **novo** | Substitui o dropdown de hover. Acionado por clique, com `<a href="mailto:">` e `<a href="tel:">` |
| `SmartImage` | **novo** | Wrapper único: `<picture>` com AVIF/WebP/fallback, `srcset`, dimensões intrínsecas, `loading` e `onError` configuráveis |

## Estado

| Estado | Onde vive | Alteração |
|---|---|---|
| Categoria ativa | **URL** (`useParams`) | ← era `useState` em `MainSite` |
| Subcategoria ativa | **URL** (`useParams`) | ← eram 2 `useEffect` no `FinderWindow` |
| Produto selecionado | **URL** (`useParams`) | ← era `useState` no `FinderWindow` |
| Lista de produtos | **derivada** no render (`useMemo`) | ← era `useState` + `useEffect` (**elimina R1**) |
| Índice da imagem na galeria | `useState` em `Gallery` | Mantém-se local. Não pertence ao URL |
| Lightbox aberto | `useState` em `ProductDetail` | Local |
| Painel de contacto | `useState` em `Shell` | Local |
| Hora do relógio | `useState` em `MenuBar` | **Move-se para dentro da MenuBar** — é a única consumidora; deixa de re-renderizar a raiz a cada minuto |
| Tipo de ponteiro / breakpoint | `useMediaQuery` (hook novo, com `matchMedia` + listener) | ← era `isMobile` medido uma vez (**elimina R5/B4**). **Uma única fonte de verdade** partilhada entre JS e CSS |

Resultado: de 3 variáveis de estado de navegação + 3 efeitos encadeados para **zero** — a navegação passa a ser derivada do URL. Sem biblioteca de estado. Sem Context, exceto (opcionalmente) um para o resultado de `useMediaQuery`.

## Navegação

- URLs legíveis em português: `/livros/capa-dura/ld2`, `/embalagens/cartolina/ct1`.
- Botão Voltar do browser e gesto Voltar do Android funcionam naturalmente.
- Deep linking: o proprietário pode enviar a um cliente o link direto de um produto.
- Sitemap gerado no build a partir de `categories.js` + `products.js` → ~44 URLs.
- `<title>` e `<meta description>` por rota (via `react-helmet-async` ou simples efeito no `document.title`).
- Rewrite da Vercel restringido para que assets em falta devolvam 404 real.

**Isto não é converter a aplicação para React Router.** O React Router já está instalado, pago em bytes e a servir duas rotas. É passar a usar aquilo que já existe. É a alteração com melhor relação valor/risco de todo o plano: resolve simultaneamente A1, S1, S5, MX8, UX12 e parte de R1.

## Estratégia responsiva

| Breakpoint | Modelo |
|---|---|
| `≥1024px` | Experiência macOS atual, intacta |
| `768–1023px` | Desktop adaptado: MenuBar com navegação, sidebar 200px, Dock persistente, grelha de 3 colunas |
| `≤767px` | Modelo de toque: TabBar inferior, Finder em ecrã inteiro (`100dvh`), segmented control de subcategorias, detalhe em vista empilhada, galeria com swipe, lightbox |
| Discriminador de hover | `@media (hover: hover) and (pointer: fine)` para **todos** os efeitos de hover — não `max-width` |

## Organização do CSS

**Manter CSS puro.** Não introduzir CSS Modules, Tailwind nem styled-components. A escala não o justifica e a abordagem atual está a ser bem executada.

```
styles/
├── tokens.css       ← todas as custom properties, sem duplicação e sem tokens mortos
├── base.css         ← reset, tipografia, scrollbar, focus
├── shell.css        ← menubar + desktop + navegação
├── finder.css       ← janela + sidebar/segmented + estados  (dividido)
├── product.css      ← grelha + card + detalhe + galeria + lightbox  (dividido)
├── notfound.css     ← extraído de responsive.css
└── responsive.css   ← APENAS media queries
```

Regras: eliminar os 8 tokens mortos; resolver a contradição dos tokens da Dock; tokenizar a altura da navegação (usada hoje em 3 valores diferentes); adicionar `aspect-ratio` a todas as imagens; adicionar `touch-action: manipulation` e `overscroll-behavior: contain`; adicionar um bloco `@media (prefers-reduced-motion: reduce)`; substituir `92vh`/`88vh` por `dvh` com fallback.

## Modelo de dados

Manter a estrutura atual — funciona e está limpa. Três adições:

1. **Normalizar para `images: []` sempre**, com um helper `getProductImages(product)` que aceita as duas formas. Elimina a duplicação e o risco de `images: []` vazio. A convenção `image` para caso simples pode continuar a existir na escrita.
2. **`npm run validate`** — script de ~40 linhas que verifica IDs únicos, existência de imagens, campos obrigatórios e ausência de `image`+`images`. Ligado ao `prebuild`.
3. **Aproveitar `category.description`** (hoje morta) como subtítulo do Finder e conteúdo indexável. Remover `category.icon` ou usá-lo.

Opcionalmente, adicionar `jsconfig.json` com `checkJs` e JSDoc nos tipos de produto — dá verificação de tipos no editor sem migrar para TypeScript.

## Acessibilidade

| Área | Estratégia |
|---|---|
| Diálogo | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + foco inicial no primeiro elemento + focus trap + devolução de foco + `inert` no fundo |
| Cabeçalhos | `<h1>` visualmente oculto (não `display:none`) na landing; título do Finder passa a `<h2>` |
| Estado ativo | `aria-current="true"` na subcategoria e categoria ativas; `role="tablist"`/`aria-selected` na galeria |
| Alvos de toque | Mínimo de 44×44 px em todos os controlos de mobile |
| Hover | Todos os conteúdos revelados por hover ganham equivalente por clique/foco |
| Foco | Manter `:focus-visible` global; garantir que elementos com `opacity: 0` recebem `visibility: hidden` ou `inert` (resolve **B3**) |
| Contraste | Elevar os 4 elementos que falham AA para ≥4,5:1 |
| Imagens | `alt=""` nas decorativas (thumbnails), `alt` descritivo nas de conteúdo |

## Animação

| Decisão | Detalhe |
|---|---|
| **Manter o Framer Motion** | É a identidade do produto. Não substituir por CSS |
| `<MotionConfig reducedMotion="user">` | Uma linha em `App.jsx`; desativa automaticamente animações de transformação quando o SO pede movimento reduzido, preservando as de opacidade |
| `@media (prefers-reduced-motion: reduce)` | Para as transições CSS puras e a rotação do spinner, que o MotionConfig não cobre |
| Envolver o Finder em `AnimatePresence` | Corrige **B1** e torna o `setTimeout` de 300ms desnecessário |
| `mode="wait"` em vez de `sync` | Corrige o salto de layout na troca grelha↔detalhe (**R4**) |
| Tilt com `MotionValue` | `useMotionValue` + `useTransform` + `style={{ rotateX, rotateY }}` — mesmo efeito visual, sem conflito nem *layout thrashing* (**R2**) |
| Variantes partilhadas | Centralizar os padrões `initial/animate` repetidos em 6 componentes |
| Tilt só com ponteiro fino | Em toque, substituir por `whileTap` |
| Reduzir a cascata da landing | 29 caracteres animados individualmente é o maior custo de movimento; considerar animar por palavra |

---

# PHASE 2 IMPLEMENTATION PLAN

Cada item indica prioridade, ficheiros afetados, razão, benefício esperado, risco e dependências.

**Legenda de risco:** 🟢 baixo (isolado, reversível) · 🟡 médio (afeta comportamento visível) · 🔴 alto (afeta arquitetura ou muitos ficheiros)

---

## Phase 2A — Correções Críticas

Objetivo: tornar o site funcional em telemóvel e utilizável numa reunião. **Nada nesta fase altera o desktop de forma visível.**

### 2A.1 — Tornar as subcategorias acessíveis em mobile 🟡
- **Prioridade:** P0 — a mais alta do plano
- **Ficheiros:** `responsive.css` (linha 60), `FinderWindow.jsx`, novo `SubcategoryNav.jsx`, novo CSS
- **Razão:** `display: none` na sidebar torna 13 de 37 produtos (35%) inalcançáveis (**M1**)
- **Benefício:** 100% do catálogo acessível em qualquer dispositivo
- **Risco:** 🟡 introduz um componente de UI novo em mobile; nenhuma alteração em desktop
- **Depende de:** nada. **Pode começar imediatamente**
- **Nota:** a correção mínima (remover `display: none` e transformar a sidebar num segmented control horizontal) resolve o problema sem esperar pela reestruturação de navegação

### 2A.2 — Navegação permanente em mobile 🟡
- **Prioridade:** P0
- **Ficheiros:** `Dock.jsx`, `responsive.css` (linhas 8, 14-18), `dock.css`, novo `TabBar.jsx`
- **Razão:** a navegação desaparece aos 6,5 s e o substituto é um alvo de 6 px na zona interceptada pelo browser (**M2**)
- **Benefício:** navegação sempre visível e tocável; elimina a dependência de um temporizador
- **Risco:** 🟡 componente novo; a Dock de desktop deve ficar intacta
- **Depende de:** idealmente de 2B.4 (`useMediaQuery`), mas pode ser feito com media queries CSS puras

### 2A.3 — Contacto acessível e clicável 🟢
- **Prioridade:** P0
- **Ficheiros:** `MenuBar.jsx`, `menubar.css` (linha 125), novo `ContactPanel.jsx`
- **Razão:** o email só existe atrás de `:hover` e não é `mailto:` (**M3**)
- **Benefício:** contacto alcançável por toque, teclado e leitor de ecrã. É o objetivo comercial do site
- **Risco:** 🟢 muito localizado
- **Depende de:** nada
- **Requer do proprietário:** confirmar se telefone e morada devem ser publicados [VER]

### 2A.4 — Corrigir overflow do slogan 🟢
- **Prioridade:** P0
- **Ficheiros:** `desktop.css` (linhas 41-47)
- **Razão:** o slogan da empresa é cortado nas duas pontas em telefones ≤375 px (**S-B1**)
- **Benefício:** a primeira impressão deixa de estar visualmente quebrada no dispositivo mais comum
- **Risco:** 🟢 uma ou duas propriedades CSS
- **Depende de:** nada. Deve ser verificado em 320/360/375 px

### 2A.5 — Botão de fechar utilizável em mobile 🟢
- **Prioridade:** P0
- **Ficheiros:** `finder.css` (linhas 44-68), `FinderWindow.jsx`
- **Razão:** 12×12 px, e o `×` só aparece em hover — em mobile é um círculo vermelho vazio (**MX5**, **AC2**)
- **Benefício:** sair da janela deixa de ser adivinhação
- **Risco:** 🟢
- **Depende de:** nada

### 2A.6 — Corrigir alturas de viewport em mobile 🟢
- **Prioridade:** P1
- **Ficheiros:** `responsive.css` (linhas 27, 89, 104), `base.css` (linha 75)
- **Razão:** `92vh`/`88vh` colocam a base da janela sob a barra do Safari (**S-B2**)
- **Benefício:** a janela cabe sempre na área visível
- **Risco:** 🟢 com o padrão `height: 92vh; height: 92dvh;`
- **Depende de:** nada. **Requer teste em iPhone real** [VER]

### 2A.7 — Corrigir o conteúdo de `ld1` 🟢
- **Prioridade:** P1
- **Ficheiros:** `products.js` (linhas 213-228)
- **Razão:** livro de capa dura com acabamento de capa mole e dois rótulos "Acabamento" (**D3**/**B6**)
- **Benefício:** elimina um erro técnico visível a um comprador profissional
- **Risco:** 🟢
- **Bloqueado por:** confirmação do proprietário sobre os valores corretos [VER]

---

## Phase 2B — Arquitetura e Qualidade de Código

### 2B.1 — Navegação baseada em URL 🔴
- **Prioridade:** P1 — **maior valor/risco do plano**
- **Ficheiros:** `App.jsx`, `main.jsx`, `FinderWindow.jsx`, `MenuBar.jsx`, `Dock.jsx`, novo `Shell.jsx`, `vercel.json`
- **Razão:** resolve **A1**, **S1**, **S5**, **MX8**, **UX12** e elimina a raiz de **R1** numa só alteração. O React Router já está instalado
- **Benefício:** deep linking, botão Voltar funcional, ~44 URLs indexáveis, refresh preserva contexto
- **Risco:** 🔴 toca em todos os componentes de navegação. Mitigação: fazer **depois** de 2A estar validado, e num branch separado
- **Depende de:** 2A concluída (para não misturar correções críticas com refactoring)

### 2B.2 — Eliminar a cascata de efeitos do `FinderWindow` 🟡
- **Prioridade:** P1
- **Ficheiros:** `FinderWindow.jsx` (linhas 13-35)
- **Razão:** 3 efeitos encadeados a sincronizar estado com estado; causa **B2** e 4 erros de ESLint (**R1**)
- **Benefício:** de 3-4 renders para 1 por navegação; elimina o flash de conteúdo desatualizado
- **Risco:** 🟡 altera a lógica central do componente
- **Depende de:** melhor feito **em conjunto** com 2B.1, que já move este estado para o URL

### 2B.3 — Corrigir o tilt 3D 🟡
- **Prioridade:** P2
- **Ficheiros:** `ProductGrid.jsx` (linhas 6-41)
- **Razão:** escrita direta no DOM em conflito com o Framer Motion + `getBoundingClientRect` por evento (**R2**, **P3**, **S-B6**)
- **Benefício:** elimina a condição de corrida e o *layout thrashing*, preservando o efeito visual exacto
- **Risco:** 🟡 o efeito é visualmente distintivo; qualquer regressão é notada. Validar com atenção
- **Depende de:** nada

### 2B.4 — Hook `useMediaQuery` como fonte única de verdade 🟢
- **Prioridade:** P1
- **Ficheiros:** novo `hooks/useMediaQuery.js`, `Dock.jsx` (linhas 13-16)
- **Razão:** JS e CSS discordam sobre o que é "mobile" (**R5**, **B4**); rodar o dispositivo não reavalia nada
- **Benefício:** comportamento coerente; suporta mudança de orientação e redimensionamento
- **Risco:** 🟢
- **Depende de:** nada. **É pré-requisito conveniente para 2A.2 e 2C**

### 2B.5 — Envolver o Finder em `AnimatePresence` 🟢
- **Prioridade:** P2
- **Ficheiros:** `App.jsx` (linhas 52-54), `App.jsx` (linha 36 — remover o `setTimeout`)
- **Razão:** as animações de saída nunca correm (**B1**, **R3**)
- **Benefício:** a janela fecha com a mesma elegância com que abre. Elimina código morto
- **Risco:** 🟢
- **Depende de:** nada

### 2B.6 — `mode="wait"` na alternância grelha↔detalhe 🟢
- **Prioridade:** P2
- **Ficheiros:** `FinderWindow.jsx` (linha 82)
- **Razão:** `mode="sync"` monta as duas vistas em fluxo simultaneamente, somando alturas (**R4**)
- **Benefício:** elimina o salto de layout
- **Risco:** 🟢
- **Depende de:** nada

### 2B.7 — Tornar `npm run lint` utilizável 🟢
- **Prioridade:** P1
- **Ficheiros:** `eslint.config.js`, `package.json`
- **Razão:** 8 de 12 erros são falsos positivos, pelo que a ferramenta está desligada e os 4 avisos reais passam invisíveis (**Q1**)
- **Benefício:** o linting volta a ter valor; os avisos de hooks passam a ser vistos
- **Risco:** 🟢
- **Depende de:** nada. **Fazer cedo** — ajuda a validar todo o resto do trabalho

### 2B.8 — Script de validação de dados 🟢
- **Prioridade:** P2
- **Ficheiros:** novo `scripts/validate-data.mjs`, `package.json` (`prebuild`)
- **Razão:** `products.js` é editado à mão e o único mecanismo de deteção de erro é o deploy (**D5**, **Q8**)
- **Benefício:** IDs duplicados, imagens em falta e campos ausentes passam a falhar o build em vez de a produção
- **Risco:** 🟢
- **Depende de:** nada

### 2B.9 — Helper único de imagens de produto 🟢
- **Prioridade:** P3
- **Ficheiros:** `products.js`, `ProductGrid.jsx` (linha 49), `ProductDetail.jsx` (linhas 5-7)
- **Razão:** a normalização `image`/`images` está duplicada; `images: []` vazio derrubaria a grelha
- **Benefício:** uma fonte de verdade; robustez contra arrays vazios
- **Risco:** 🟢
- **Depende de:** nada

### 2B.10 — Limpeza de código morto 🟢
- **Prioridade:** P3
- **Ficheiros:** `animations.css` (apagar), `FinderStates.jsx` + `FinderWindow.jsx:8` (`LoadingState`), `finder.css:460-474`, `base.css` (8 tokens mortos), `menubar.css:31-33,64-67`, `dock.css:94-102`, `categories.js` (`icon`), `products.js:630`, `public/vite.svg`, 2 imagens órfãs, `robots.txt`
- **Razão:** ver secção *Dead Code*
- **Benefício:** menos ruído; o CSS deixa de mentir sobre o que está ativo
- **Risco:** 🟢 — exceto `dock.css:94-102`, que exige confirmar que o `whileHover` cobre o efeito antes de remover
- **Depende de:** 2B.7 (o lint ajuda a confirmar o que é morto)

### 2B.11 — `.gitattributes` 🟢
- **Prioridade:** P2
- **Ficheiros:** novo `.gitattributes`, `git rm --cached -r .idea`
- **Razão:** 10 ficheiros com diffs fantasma de CRLF; `.idea` versionado contra o `.gitignore` (**Q5**)
- **Benefício:** `git diff` volta a ser útil; risco de commits acidentais eliminado
- **Risco:** 🟢 — mas gera **um** commit grande de normalização. Fazer isoladamente, antes de qualquer outro trabalho, para não contaminar diffs
- **Depende de:** nada. **Recomendo que seja o primeiro commit da Fase 2**

### 2B.12 — Atualizar `CLAUDE.md` e `client/README.md` 🟢
- **Prioridade:** P3
- **Ficheiros:** `client/CLAUDE.md` (linhas 18, 143), `client/README.md`
- **Razão:** diz Render quando é Vercel; diz que mobile não é prioritário quando passou a ser; o README é o template do Vite (**Q6**)
- **Benefício:** a documentação deixa de induzir em erro
- **Risco:** 🟢
- **Depende de:** conclusão do trabalho que descreve

---

## Phase 2C — Responsivo / Mobile

### 2C.1 — Discriminador de hover por capacidade 🟡
- **Prioridade:** P1
- **Ficheiros:** todos os `.css` com `:hover` (16 ocorrências em 4 ficheiros)
- **Razão:** efeitos de hover a decidir funcionalidade em dispositivos sem hover
- **Benefício:** trata corretamente portáteis com touchscreen, iPad com trackpad e telefones
- **Risco:** 🟡 muitos ficheiros tocados, cada alteração é trivial
- **Depende de:** 2A.2, 2A.3 (que removem as dependências *funcionais* de hover)

### 2C.2 — Grelha de produtos para toque 🟢
- **Prioridade:** P2 · **Ficheiros:** `responsive.css` (48-50, 81-84), `finder.css` (169-224)
- **Razão:** cards de ~168 px com imagem de 180 px e nomes de 4-5 linhas (**MX15**, **UX7**)
- **Benefício:** cards legíveis com nome completo · **Risco:** 🟢 · **Depende de:** nada

### 2C.3 — Detalhe de produto responsivo 🟢
- **Prioridade:** P2 · **Ficheiros:** `finder.css` (398-434), `responsive.css`
- **Razão:** especificações em `space-between` com `max-width: 60%` comprimem-se em ~340 px (**MX12**)
- **Benefício:** fichas técnicas legíveis no telefone — é o conteúdo de maior valor do site · **Risco:** 🟢

### 2C.4 — Galeria com gestos e indicadores 🟡
- **Prioridade:** P2 · **Ficheiros:** `ProductDetail.jsx` (46-60), novo `Gallery.jsx`, `finder.css`
- **Razão:** sem swipe, sem contador, estado ativo só visual (**MX9**, **UX8**, **AC6**)
- **Benefício:** navegação natural entre vistas do mesmo produto
- **Risco:** 🟡 gestos podem conflituar com o scroll vertical; usar `drag="x"` do Framer com `dragConstraints`
- **Depende de:** 2C.5 (que partilha a extração do componente)

### 2C.5 — Lightbox com zoom 🟡
- **Prioridade:** **P1 — requisito comercial central**
- **Ficheiros:** novo `Lightbox.jsx`, `ProductDetail.jsx`, novo CSS
- **Razão:** é impossível ampliar uma imagem; existem ficheiros de 3072×4096 px que o utilizador nunca vê acima de 650 px (**UX9**, **MX10**)
- **Benefício:** responde à pergunta *"a impressão fica assim tão nítida?"* — o momento decisivo de uma apresentação comercial
- **Risco:** 🟡 componente novo, com foco, Escape e gestos a gerir
- **Depende de:** 2D.1 (partilha o padrão de diálogo acessível), 2E.1 (para que a imagem ampliada tenha uma variante de alta resolução a servir)

### 2C.6 — Comportamento de scroll e toque 🟢
- **Prioridade:** P2 · **Ficheiros:** `base.css`, `finder.css` (103-110, 159-163)
- **Razão:** sem `overscroll-behavior: contain` nem `touch-action: manipulation`
- **Benefício:** elimina *scroll chaining*, rubber-band indesejado e atraso de 300 ms no toque · **Risco:** 🟢

### 2C.7 — Paisagem em telefone 🟢
- **Prioridade:** P3 · **Ficheiros:** `responsive.css`, `desktop.css`
- **Razão:** nenhuma media query de `orientation`; a ~390 px de altura sobram ~300 px para a grelha
- **Benefício:** o site deixa de ser inutilizável quando o telefone é rodado · **Risco:** 🟢 · **Depende de:** 2B.4

### 2C.8 — Safe areas (condicional) 🟡
- **Prioridade:** P2 — **apenas se** 2A.2 introduzir a TabBar fixa
- **Ficheiros:** `index.html` (linha 11), CSS da TabBar
- **Razão:** uma barra fixa no fundo tem de respeitar `env(safe-area-inset-bottom)`
- **Risco:** 🟡 `viewport-fit=cover` e `env()` têm de ser introduzidos **em conjunto**; um sem o outro **cria** um bug que hoje não existe
- **Depende de:** 2A.2

---

## Phase 2D — Acessibilidade

### 2D.1 — Diálogo modal acessível 🟡
- **Prioridade:** P1
- **Ficheiros:** `FinderWindow.jsx`, novo `hooks/useFocusTrap.js`, `App.jsx`
- **Razão:** sem `role="dialog"`, sem `aria-modal`, sem gestão de foco, sem trap, sem devolução de foco (**AC1**)
- **Benefício:** a janela passa a ser operável por teclado e anunciada corretamente
- **Risco:** 🟡 gestão de foco é fácil de fazer mal. Testar com Tab/Shift+Tab e VoiceOver
- **Depende de:** nada. **É pré-requisito de 2C.5**

### 2D.2 — Respeitar `prefers-reduced-motion` 🟢
- **Prioridade:** P1
- **Ficheiros:** `App.jsx` (`MotionConfig`), `base.css` ou `responsive.css` (bloco de media query)
- **Razão:** 14 animações ignoram a preferência do SO, incluindo ~3 s de movimento na landing e tilt 3D com perspetiva (**AC3**)
- **Benefício:** conformidade WCAG e conforto real para utilizadores com sensibilidade vestibular
- **Risco:** 🟢 — `<MotionConfig reducedMotion="user">` é literalmente uma linha e o Framer trata do resto
- **Depende de:** nada. **Melhor relação esforço/benefício de toda a Fase 2D**

### 2D.3 — Alvos de toque ≥44 px 🟢
- **Prioridade:** P1 · **Ficheiros:** `finder.css` (44-46), `menubar.css` (54-60), `dock.css` (19-35), `responsive.css`
- **Razão:** 4 controlos abaixo do mínimo AA de 24×24, alguns a 13% dele (**AC2**)
- **Benefício:** conformidade WCAG 2.5.8 e menos toques falhados · **Risco:** 🟢 · **Sobrepõe-se a:** 2A.2, 2A.5

### 2D.4 — Foco visível e sem armadilhas invisíveis 🟢
- **Prioridade:** P1 · **Ficheiros:** `Dock.jsx` (93-97)
- **Razão:** `opacity: 0` não remove da ordem de tabulação → é possível ativar botões invisíveis (**B3**)
- **Benefício:** elimina um bug funcional **e** uma falha de WCAG 2.4.7 · **Risco:** 🟢 (`visibility: hidden` ou `inert`)

### 2D.5 — Hierarquia de cabeçalhos 🟢
- **Prioridade:** P2 · **Ficheiros:** `Desktop.jsx`, `FinderWindow.jsx` (59)
- **Razão:** a página principal não tem `<h1>`; o `<h1>` existente é o nome de uma categoria dentro de um diálogo (**AC4**, **S2**)
- **Benefício:** estrutura navegável por leitor de ecrã e sinal correto para o Google · **Risco:** 🟢

### 2D.6 — Estado ativo programático 🟢
- **Prioridade:** P2 · **Ficheiros:** `FinderWindow.jsx` (67-76), `ProductDetail.jsx` (48-58), `MenuBar.jsx`
- **Razão:** o estado selecionado é transmitido apenas por cor (**AC6**); `.menubar-item.active` nunca é aplicada (**C7**, **UX2**)
- **Benefício:** `aria-current`/`aria-selected` + indicação visual da categoria aberta · **Risco:** 🟢 · **Depende de:** 2B.1 para a categoria ativa

### 2D.7 — Contrastes 🟢
- **Prioridade:** P2 · **Ficheiros:** `desktop.css` (46), `finder.css` (119, 388, 423, 444), `menubar.css`
- **Razão:** 4 elementos falham AA, incluindo o slogan a ~2,6:1 (**AC7**)
- **Benefício:** conformidade WCAG 1.4.3 e legibilidade real
- **Risco:** 🟢 tecnicamente, 🟡 esteticamente — a subtileza é intencional. Escurecer o mínimo necessário
- **Requer:** verificação com ferramenta de contraste no browser [VER]

### 2D.8 — Limpeza de ARIA 🟢
- **Prioridade:** P3 · **Ficheiros:** `Dock.jsx` (90), `FinderWindow.jsx` (52-57), `ProductDetail.jsx` (55)
- **Razão:** `role="toolbar"` sem foco roving; botões `disabled` sem label; `alt` redundante nas thumbnails
- **Benefício:** ARIA que corresponde ao comportamento real · **Risco:** 🟢

---

## Phase 2E — Performance

### 2E.1 — Pipeline de otimização de imagens 🟡
- **Prioridade:** **P0 — maior impacto único de todo o plano**
- **Ficheiros:** `public/imagens/**` (47 ficheiros), `products.js` (caminhos), novo `SmartImage.jsx`, novo `scripts/optimize-images.mjs`, `package.json`
- **Razão:** 60,57 MB de imagens; 8,1 MB numa grelha de 2 miniaturas; 5 ficheiros acima de 6 MB; zero formatos modernos, zero `srcset` (**Asset Analysis**)
- **Benefício estimado:** **60,57 MB → ~4-6 MB (−90 a −93%)**. Grelha de Postais: 8,1 MB → ~250 KB. Transforma a experiência mobile mais do que qualquer outra alteração
- **Risco:** 🟡 — mexe em todos os assets. Mitigações: manter os originais numa pasta fora de `public/` (ou no OneDrive) como fonte de verdade; gerar derivados por script reproduzível; validar visualmente cada categoria antes de publicar; tratar os dois JPEG CMYK e o `logo_white.jpg` (PNG) como casos especiais
- **Depende de:** nada. **Pode correr em paralelo com 2A**
- **Sub-tarefas:**
  - 2E.1a — Converter os 2 JPEG CMYK para sRGB e verificar visualmente em Safari/Chrome/Firefox (**S-B3**)
  - 2E.1b — Corrigir extensões enganadoras: `logo_white.jpg`→`.png` ou WebP, `Brochura_*.png`→`.jpg`, `favicon.png` (JPEG) (**B7**, **B8**)
  - 2E.1c — Redimensionar: máximo 1600 px no lado maior para detalhe, 600 px para miniaturas
  - 2E.1d — Gerar WebP (e opcionalmente AVIF) com fallback via `<picture>`
  - 2E.1e — `srcset` + `sizes` para grelha vs detalhe
  - 2E.1f — Adicionar `width`/`height` ou `aspect-ratio` a **todas** as imagens (resolve CLS)
  - 2E.1g — Renomear os 2 ficheiros com acento/parênteses
  - 2E.1h — Remover as 2 imagens órfãs e o `vite.svg`
  - 2E.1i — Substituir o `og:image` por uma imagem dedicada de 1200×630 (**S3**)

### 2E.2 — Otimizar a imagem LCP 🟢
- **Prioridade:** P1 · **Ficheiros:** `index.html` (14), `Desktop.jsx` (8-16), `desktop.css` (19-26)
- **Razão:** 407 KB de PNG para exibir a ≤420 px, **e** `initial={{ opacity: 0 }}` durante 1,2 s a atrasar o registo do LCP (**P-LCP**)
- **Benefício:** LCP potencialmente vários segundos mais rápido; ~380 KB poupados no carregamento inicial
- **Risco:** 🟢 tecnicamente; a animação de entrada do logo é identidade — reduzir a duração ou começar com opacidade não-zero, não eliminar
- **Depende de:** 2E.1

### 2E.3 — Corrigir `manualChunks` 🟢
- **Prioridade:** P2 · **Ficheiros:** `vite.config.js` (12-19)
- **Razão:** o react-dom está no chunk da aplicação; cada produto adicionado invalida 222 KB de cache (**P1**)
- **Benefício:** separação real de vendor; adicionar produtos passa a invalidar ~40 KB em vez de 222 KB
- **Risco:** 🟢 — verificar o resultado com inspeção do bundle após a alteração

### 2E.4 — Prioridade de carregamento das imagens de conteúdo 🟢
- **Prioridade:** P2 · **Ficheiros:** `ProductDetail.jsx` (36)
- **Razão:** a imagem principal do detalhe tem `loading="lazy"` apesar de ser sempre o conteúdo em foco
- **Benefício:** a imagem aparece mais cedo · **Risco:** 🟢

### 2E.5 — Avaliar o custo de `mix-blend-mode` e `backdrop-filter` 🟡
- **Prioridade:** P3 · **Ficheiros:** `finder.css` (211, 285, 314), `menubar.css` (10, 107), `dock.css` (27, 54)
- **Razão:** blend modes + filtros + transformações 3D na mesma pilha; 5 superfícies de `backdrop-filter` (**P4**)
- **Benefício:** possível ganho de fluidez em Safari iOS
- **Risco:** 🟡 — estes efeitos **são** a identidade glassmorphism. **Medir primeiro** [VER]; só reduzir onde a medição mostrar custo real. Não remover por princípio

### 2E.6 — Deixar `products.js` como está 🟢
- **Prioridade:** — · **Decisão explícita:** **não fazer code splitting** dos dados. 21 KB brutos (~6 KB gzip) para 37 produtos não justifica a complexidade (**P2**). Registado para evitar trabalho desnecessário

---

## Phase 2F — Segurança

### 2F.1 — Cabeçalhos de segurança 🟢
- **Prioridade:** P1 · **Ficheiros:** `client/vercel.json`
- **Razão:** nenhum cabeçalho de segurança configurado
- **Benefício:** CSP restritiva é viável **precisamente porque** não há scripts externos
- **Risco:** 🟢 se testado em preview antes de produção; 🟡 se aplicado diretamente — uma CSP mal formada pode quebrar o site. **Testar num deploy de preview**
- **Nota:** os dois blocos `<script type="application/ld+json">` inline exigem `'unsafe-inline'` ou hashes SHA-256 em `script-src`. Preferir hashes

### 2F.2 — Restringir o rewrite SPA 🟢
- **Prioridade:** P2 · **Ficheiros:** `client/vercel.json`
- **Razão:** `/(.*)` → `index.html` faz com que assets em falta devolvam HTML com HTTP 200 (**S-B7**, **S5**)
- **Benefício:** 404 reais para assets; melhor diagnóstico; elimina *soft 404* de assets
- **Risco:** 🟢 — validar que as rotas de 2B.1 continuam a funcionar
- **Depende de:** 2B.1 (as rotas novas têm de ser consideradas no padrão)

### 2F.3 — Atualizar `react-router-dom` 🟢
- **Prioridade:** P2 · **Ficheiros:** `package.json`, `package-lock.json`
- **Razão:** 4 advisories, dos quais 3 não se aplicam (SSR/RSC) e 1 é irrelevante com 2 rotas
- **Benefício:** higiene de dependências; `npm audit` limpo na dependência de runtime
- **Risco:** 🟢 dentro da mesma major (7.13 → 7.18)
- **Depende de:** fazer **antes** de 2B.1, para não refatorar contra uma versão que vai mudar

### 2F.4 — Atualizar dependências de build 🟢
- **Prioridade:** P3 · **Ficheiros:** `package.json`, `package-lock.json`
- **Razão:** 10 advisories em ferramentas de build (não expostas em produção)
- **Benefício:** higiene · **Risco:** 🟢 se restringido a patches
- **Explicitamente NÃO fazer:** `npm audit fix --force`, nem majors (Vite 8, ESLint 10, Framer 13)

### 2F.5 — Higiene de repositório 🟢
- **Prioridade:** P3 · **Ficheiros:** `.gitignore`, `.idea/`, `client/dist/`, `robots.txt`
- **Razão:** `.idea` versionado contra o `.gitignore`; `@vercel/analytics` extraneous; `Disallow: /admin/` inexistente; 123 MB de imagens duplicadas a sincronizar via OneDrive
- **Benefício:** menos ruído, menos risco de exposição acidental · **Risco:** 🟢
- **Sobrepõe-se a:** 2B.11

---

## Phase 2G — SEO

### 2G.1 — URLs e metadados por rota 🟡
- **Prioridade:** P1 (consequência direta de 2B.1)
- **Ficheiros:** rotas de 2B.1, `index.html`, possivelmente `react-helmet-async`
- **Razão:** 1 URL indexável para 37 fichas técnicas ricas em terminologia de setor (**S1**)
- **Benefício:** ~44 URLs indexáveis, cada um com título, descrição e imagem próprios. É o maior ganho de SEO disponível e não exige backend nem SSR
- **Risco:** 🟡 depende inteiramente de 2B.1
- **Depende de:** 2B.1

### 2G.2 — Sitemap gerado no build 🟢
- **Prioridade:** P2 · **Ficheiros:** novo `scripts/generate-sitemap.mjs`, `package.json`, `public/sitemap.xml`
- **Razão:** o sitemap é mantido à mão e tem 1 URL
- **Benefício:** sitemap sempre sincronizado com os dados · **Risco:** 🟢 · **Depende de:** 2G.1

### 2G.3 — Completar o `LocalBusiness` 🟢
- **Prioridade:** P2 · **Ficheiros:** `index.html` (44-80)
- **Razão:** faltam `streetAddress`, `postalCode`, `telephone`, `geo`, `openingHoursSpecification` — os campos que alimentam o SEO local (**S6**)
- **Benefício:** melhor visibilidade em buscas locais, que é o vetor mais valioso para uma gráfica no Porto
- **Risco:** 🟢 · **Bloqueado por:** decisão do proprietário sobre publicar morada e telefone [VER]

### 2G.4 — Metadados Open Graph 🟢
- **Prioridade:** P3 · **Ficheiros:** `index.html` (28-41), novo asset OG
- **Razão:** falta `og:image:width/height/alt`; a imagem OG é um logo 4:1 declarado como `summary_large_image` (**S3**, **S4**)
- **Benefício:** pré-visualizações corretas no LinkedIn e WhatsApp — canais reais de partilha B2B · **Risco:** 🟢 · **Depende de:** 2E.1i

### 2G.5 — Remover o `<meta keywords>` 🟢
- **Prioridade:** P3 · **Ficheiros:** `index.html` (19)
- **Razão:** ignorado pelo Google desde 2009; 60+ termos que 2G.1 passa a cobrir com conteúdo real indexável
- **Benefício:** menos ruído. **Não é urgente e não prejudica** — só fazer depois de 2G.1 estar a funcionar · **Risco:** 🟢

---

## Phase 2H — Polimento Final de UX

### 2H.1 — Indicar a categoria ativa 🟢
- **Prioridade:** P2 · **Ficheiros:** `MenuBar.jsx`, `menubar.css` (64-67 — o CSS já existe) · **Razão:** **UX2**, **C7** · **Risco:** 🟢 · **Depende de:** 2B.1

### 2H.2 — Escape sai um nível de cada vez 🟢
- **Prioridade:** P3 · **Ficheiros:** `App.jsx` (40-44), `FinderWindow.jsx` · **Razão:** **UX12** · **Benefício:** navegação hierárquica previsível · **Risco:** 🟢 · **Depende de:** 2B.1

### 2H.3 — Aproveitar `category.description` 🟢
- **Prioridade:** P3 · **Ficheiros:** `FinderWindow.jsx`, `finder.css` · **Razão:** 6 descrições de boa qualidade nunca usadas (**D4**) · **Benefício:** contexto na janela + conteúdo indexável · **Risco:** 🟢

### 2H.4 — Resolver subcategorias com um único produto 🟢
- **Prioridade:** P3 · **Ficheiros:** `categories.js`, `products.js`, `finder.css` (169-173)
- **Razão:** 3 subcategorias com 1 produto parecem erro de carregamento; `Catálogos › Catálogos` é redundante (**D1**, **UX4**, **UX5**)
- **Opções:** ajustar a grelha para não esticar cards isolados; fundir subcategorias; ou esconder a navegação de subcategoria quando há apenas uma
- **Risco:** 🟢 · **Requer:** decisão editorial do proprietário [VER]

### 2H.5 — Diferenciar produtos com nome igual 🟢
- **Prioridade:** P3 · **Ficheiros:** `products.js` (`lm3`, `ld1`) · **Razão:** **D2** · **Risco:** 🟢

### 2H.6 — Afordância dos cards 🟢
- **Prioridade:** P3 · **Ficheiros:** `ProductGrid.jsx`, `finder.css` (175-224) · **Razão:** nada indica que clicar revela uma ficha técnica (**UX6**) · **Risco:** 🟢

### 2H.7 — `onError` nas imagens + `componentDidCatch` 🟢
- **Prioridade:** P2 · **Ficheiros:** novo `SmartImage.jsx`, `ErrorBoundary.jsx`
- **Razão:** nenhum handler de erro em imagens; o `ErrorBoundary` não registra nada (**S-B7**, *Error Handling*)
- **Benefício:** placeholder em vez de ícone quebrado; diagnóstico de falhas · **Risco:** 🟢 · **Depende de:** 2E.1

### 2H.8 — Corrigir a afordância falsa do logo 🟢
- **Prioridade:** P3 · **Ficheiros:** `menubar.css` (31-33) · **Razão:** hover de clique numa `div` sem ação (**C8**) · **Risco:** 🟢

### 2H.9 — Reorganizar o CSS 🟢
- **Prioridade:** P3 · **Ficheiros:** todos os `styles/`
- **Razão:** `responsive.css` contém a página 404; `finder.css` tem 474 linhas com 6 responsabilidades; tokens duplicados/contraditórios (**C1**, **C5**)
- **Benefício:** manutenção mais previsível · **Risco:** 🟢 mecanicamente, mas **fazer por último** — reorganizar CSS a meio do trabalho responsivo cria conflitos desnecessários

---

## Ordem de execução recomendada

```
Passo 0  │ 2B.11 (.gitattributes)  ← primeiro commit, isolado, para limpar os diffs fantasma
         │ 2B.7  (lint utilizável) ← para que o resto do trabalho seja validável
         │ 2F.3  (react-router)    ← antes de refatorar contra ele
         ▼
Passo 1  │ FASE 2A completa (críticos de mobile) ────┐
CRÍTICO  │ 2E.1 (imagens) ── em paralelo ────────────┤ Ambos independentes.
         │ 2D.2 (reduced-motion) ── 1 linha ─────────┘ Já entregam site utilizável em mobile.
         ▼
Passo 2  │ 2B.4 (useMediaQuery) → 2D.1 (diálogo acessível) → 2D.3/2D.4 (alvos e foco)
         │ 2E.2, 2E.3, 2E.4 (LCP, chunks, prioridade)
         │ 2F.1 (headers, testar em preview)
         ▼
Passo 3  │ 2B.1 (URLs) ← branch separado, a maior alteração
ROUTER   │ └→ 2B.2 (cascata de efeitos) · 2G.1 (metadados) · 2G.2 (sitemap)
         │ └→ 2F.2 (rewrite) · 2D.6 · 2H.1 · 2H.2
         ▼
Passo 4  │ 2C.1 a 2C.8 (modelo de interação de toque) · 2C.5 (lightbox) é P1 dentro deste passo
         │ 2B.3 (tilt), 2B.5 (AnimatePresence), 2B.6 (mode=wait)
         ▼
Passo 5  │ 2D.5, 2D.7, 2D.8 · 2G.3, 2G.4, 2G.5 · 2B.8, 2B.9, 2B.10 · 2F.4, 2F.5
         ▼
Passo 6  │ FASE 2H (polimento) · 2H.9 (reorganizar CSS) em último · 2B.12 (documentação)
```

**Racional:** o Passo 0 evita que todo o trabalho seguinte fique enterrado em ruído de diff. O Passo 1 entrega, isoladamente, um site que funciona num telemóvel — se a Fase 2 parasse aqui, já teria resolvido o problema de negócio. O Passo 3 está deliberadamente depois, porque é a alteração de maior risco e beneficia de uma base já estabilizada.

---

# Acceptance Criteria

Critérios objetivos e verificáveis que a Fase 2 deve satisfazer. Cada um é redigido para ser testável, não interpretável.

## Desktop — preservação (regressão zero)

- [ ] A identidade visual está preservada: landing com logo + slogan animado, MenuBar com glassmorphism, Dock com ampliação, janela Finder com semáforos.
- [ ] A navegação por categorias na MenuBar funciona com um clique, como hoje.
- [ ] A janela Finder abre com animação de mola **e fecha com animação de saída** (melhoria face ao estado atual).
- [ ] A sidebar de subcategorias funciona e indica visualmente a subcategoria ativa.
- [ ] A grelha de produtos mostra todos os produtos da subcategoria selecionada.
- [ ] O efeito de tilt 3D dos cards está visualmente indistinguível do atual, sem interromper a animação de entrada.
- [ ] O detalhe de produto mostra imagem, título, descrição com parágrafos preservados e tabela de especificações.
- [ ] A galeria de thumbnails funciona nos 6 produtos multi-imagem.
- [ ] O contacto é alcançável e o email é clicável.
- [ ] Fechar a janela funciona por: botão, clique fora e `Escape`.
- [ ] A Dock continua a aparecer por hover na zona inferior.
- [ ] **Nenhuma regressão visual** em ≥1024 px, confirmada por comparação de capturas antes/depois em cada uma das 12 subcategorias.

## Mobile — funcionalidade

- [ ] **Os 37 produtos são alcançáveis num ecrã de 375×667 px.** Verificável: navegar até cada um dos 13 produtos hoje inacessíveis.
- [ ] A navegação por categorias está permanentemente visível ou acessível através de um controlo com ≥44×44 px, **sem depender de qualquer temporizador**.
- [ ] Não existe qualquer overflow horizontal em 320, 360, 375, 390, 414 e 430 px de largura. Verificável: `document.documentElement.scrollWidth === document.documentElement.clientWidth` em cada largura.
- [ ] O slogan da landing está integralmente visível em 320 px, sem letras cortadas.
- [ ] **Nenhuma informação ou ação essencial depende de `:hover`.** Verificável: desativar hover em DevTools e confirmar que contacto, rótulos de navegação, símbolo de fechar e estado ativo continuam acessíveis.
- [ ] Todos os controlos interativos têm ≥44×44 px (mínimo absoluto 24×24 para conformidade AA).
- [ ] Um utilizador que nunca viu o site consegue encontrar uma categoria e abrir um produto sem instruções.
- [ ] A janela do Finder cabe integralmente na área visível de um iPhone com a barra do Safari visível, em retrato **e** em paisagem.
- [ ] É possível ampliar uma imagem de produto para além da largura do ecrã, com zoom.
- [ ] A galeria é navegável por toque (swipe ou thumbnails com ≥44 px) e indica a posição atual.
- [ ] A ficha de especificações é legível em 375 px, sem palavras cortadas nem quebras a cada palavra.
- [ ] O contacto é alcançável em ≤2 toques a partir de qualquer estado, e o email abre o cliente de correio.
- [ ] O botão/gesto Voltar do sistema fecha a janela ou regressa um nível, **não** sai do site.
- [ ] Se existir barra fixa no fundo, respeita `env(safe-area-inset-bottom)` num iPhone com home indicator.
- [ ] Rodar o dispositivo mantém o site utilizável e não perde o estado de navegação.

## Acessibilidade

- [ ] Toda a aplicação é operável exclusivamente por teclado: abrir categoria, trocar subcategoria, abrir produto, navegar galeria, ampliar imagem, fechar, acessar contacto.
- [ ] O foco é visível em todos os elementos focáveis (`:focus-visible` com contraste ≥3:1 contra o fundo adjacente).
- [ ] **Não é possível focar elementos invisíveis.** Verificável: com a Dock escondida, tabular da MenuBar não alcança botões da Dock.
- [ ] A janela Finder tem `role="dialog"`, `aria-modal="true"` e `aria-labelledby`; o foco entra na janela ao abrir, fica retido enquanto aberta, e regressa ao elemento de origem ao fechar.
- [ ] Com `prefers-reduced-motion: reduce` ativo no SO, não há animações de transformação, translação, escala nem tilt. Transições de opacidade são aceitáveis.
- [ ] A página principal tem exactamente um `<h1>` e a hierarquia de cabeçalhos não salta níveis.
- [ ] O estado selecionado (categoria, subcategoria, imagem da galeria) é comunicado programaticamente (`aria-current` / `aria-selected`), não apenas por cor.
- [ ] Todo o texto atinge ≥4,5:1 de contraste (≥3:1 para texto ≥24 px ou ≥19 px bold). Especificamente: slogan, estados vazios, títulos da sidebar, títulos de secção e rótulos de especificação.
- [ ] Imagens de produto têm `alt` descritivo; imagens decorativas (thumbnails dentro de botões rotulados) têm `alt=""`.
- [ ] O zoom do utilizador continua permitido (sem `maximum-scale` nem `user-scalable=no`).
- [ ] Testado com VoiceOver (macOS/iOS) ou NVDA: é possível compreender e operar a exploração de produtos.

## Performance

- [ ] **Nenhuma imagem individual excede 400 KB.** Hoje há 5 acima de 6 MB.
- [ ] **Nenhuma subcategoria requer mais de 1,5 MB de imagens para renderizar a grelha.** Hoje o pior caso é 8,1 MB.
- [ ] Peso total da biblioteca de imagens ≤8 MB. Hoje: 60,57 MB.
- [ ] Todas as imagens são servidas em formato moderno (WebP/AVIF) com fallback.
- [ ] Todas as imagens têm `width`/`height` ou `aspect-ratio` declarados.
- [ ] Imagens fora do viewport usam `loading="lazy"`; a imagem principal do detalhe **não**.
- [ ] O carregamento inicial (HTML + CSS + JS + imagem LCP) ≤300 KB comprimido. Hoje: ~584 KB.
- [ ] O react-dom está num chunk separado do código da aplicação. Verificável por inspeção do bundle.
- [ ] Nenhum ciclo de render descontrolado: verificável com React DevTools Profiler — trocar de categoria produz **um** commit de render, não 3-4.
- [ ] Nenhuma fuga de memória: abrir e fechar a janela 50 vezes não aumenta a contagem de listeners nem de nós DOM retidos.
- [ ] O tilt 3D não gera *layout thrashing*: verificável no Performance profiler — nenhum "Forced reflow" durante o movimento do rato.
- [ ] `npm run build` conclui sem erros nem warnings.
- [ ] `npm run lint` conclui com **zero** erros. Hoje: 12.
- [ ] Lighthouse em produção (mobile): Performance ≥80, Accessibility ≥95, Best Practices ≥95, SEO ≥95. *(Baseline atual não medida — estabelecer antes de começar, para poder comparar.)*

## Segurança

- [ ] Zero ocorrências de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`.
- [ ] Zero segredos, tokens, chaves ou ficheiros `.env` no repositório ou no bundle.
- [ ] Cabeçalhos de segurança presentes em produção: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Verificável por inspeção dos cabeçalhos de resposta.
- [ ] A CSP não usa `'unsafe-eval'`; `script-src` usa `'self'` mais hashes para os blocos JSON-LD inline.
- [ ] `npm audit` não reporta vulnerabilidades em dependências de **runtime** (`react`, `react-dom`, `framer-motion`, `react-router-dom`).
- [ ] Nenhuma dependência extraneous (`npm ls` sem avisos).
- [ ] Assets inexistentes devolvem HTTP 404, não HTML com 200.
- [ ] Nenhum link externo com `target="_blank"` sem `rel="noopener noreferrer"` (hoje não existem links externos).
- [ ] `.idea/` deixou de estar versionado.

## Dados

- [ ] `npm run validate` passa: IDs únicos, todos os caminhos de imagem existem, campos obrigatórios presentes, nenhum produto com `image` **e** `images`, nenhum array `images` vazio.
- [ ] Não existem imagens órfãs em `public/imagens/`.
- [ ] Não existem nomes de ficheiro com acentos, parênteses ou espaços.
- [ ] Todas as extensões correspondem ao formato real do ficheiro.
- [ ] As inconsistências de conteúdo em `ld1` foram resolvidas com o proprietário.

---

# FINAL AUDIT SCORE

Pontuações de 0 a 10 relativas ao **estado atual** do repositório (commit `6bee56a`), avaliadas por padrões de produção para um site vitrina profissional.

| Dimensão | Nota | Justificação |
|:---|:---:|:---|
| **Arquitetura** | **6,5 / 10** | Estrutura correta e proporcionada à escala: componentes bem divididos, estado num único ponto, sem abstrações desnecessárias e sem prop drilling. Penalizada por três coisas concretas: navegação sem representação no URL apesar de o React Router estar instalado (A1), `MenuBar` acima do modal na ordem de empilhamento (A2), e ausência de qualquer camada de validação de dados num projeto cuja base de dados é editada à mão. |
| **Qualidade React** | **6 / 10** | Fundamentos sólidos e verificados: todos os efeitos limpam, chaves de lista corretas, memoização que **de facto** funciona, closures sem problemas de obsolescência, `ErrorBoundary` presente. Descontos por três problemas reais: cascata de três efeitos a sincronizar estado com estado (R1, confirmada por 4 erros de ESLint), escrita direta no DOM em conflito com o Framer Motion (R2), e `AnimatePresence` ausente onde é indispensável (R3/B1). |
| **Qualidade de código** | **6,5 / 10** | Ficheiros pequenos, nomenclatura consistente, zero `console.log`, zero `TODO`, comentários acima da média, `products.js` com documentação de workflow genuinamente útil. Penalizada sobretudo por `npm run lint` estar inutilizável (Q1) — 8 falsos positivos que fazem com que 4 avisos legítimos passem invisíveis — e pelos diffs fantasma de CRLF em 10 ficheiros por falta de `.gitattributes` (Q5). |
| **Manutenibilidade** | **6,5 / 10** | Adicionar um produto é genuinamente simples e está bem documentado. Nenhum ficheiro é intimidante. Prejudicada por duplicação de dados (email em 3 sítios, logo em 6, altura da Dock em 3 valores diferentes), tokens de CSS que contradizem os valores realmente aplicados (C1), ausência de validação automatizada, e zero testes de qualquer tipo. |
| **Segurança** | **7 / 10** | Superfície de ataque em runtime praticamente nula, confirmada por busca exaustiva: zero XSS, zero HTML não seguro, zero segredos, zero scripts de terceiros, zero `fetch`. Descontos por ausência total de cabeçalhos de segurança (nenhuma CSP num site onde uma CSP restritiva seria trivial de aplicar), rewrite universal que mascara 404 de assets, e 12 vulnerabilidades em dependências — ainda que 10 sejam apenas de build e as 4 do router não se apliquem a este modo de utilização. |
| **Acessibilidade** | **3,5 / 10** | Há uma base real: elementos semânticos corretos, `lang`, `:focus-visible` global, `aria-label` bem aplicado, zoom permitido, `<noscript>` funcional. Mas as falhas são estruturais: o diálogo modal não tem semântica de diálogo nem gestão de foco (AC1), `prefers-reduced-motion` é ignorado em 14 animações (AC3), alvos de toque a 13-50% do mínimo (AC2), a página principal não tem `<h1>` (AC4), o contacto é inalcançável por teclado (AC5), 4 elementos falham o contraste AA (AC7), e é possível ativar botões invisíveis (B3). |
| **Performance** | **4 / 10** | O JavaScript está bem: 124 KB comprimido, sem webfonts, sem dependências desnecessárias, com memoização eficaz. **A nota é determinada pelas imagens:** 60,57 MB, cinco ficheiros acima de 6 MB, 8,1 MB para renderizar uma grelha de duas miniaturas, zero formatos modernos, zero `srcset`, zero dimensões intrínsecas. Agrava-se com a imagem LCP de 407 KB que a animação de entrada atrasa em até 1,2 s, e o `manualChunks` que se auto-anula. |
| **SEO** | **6 / 10** | O SEO técnico *on-page* é genuinamente bom e acima do típico: título, description, canonical, OG completo, Twitter Card, dois blocos JSON-LD, robots, sitemap, verificação do Search Console, `<noscript>` indexável. A nota é limitada por uma única razão de peso: existe **um** URL indexável para 37 fichas técnicas ricas em terminologia real do setor (S1). O conteúdo mais valioso do site é invisível para o Google. |
| **UX Desktop** | **8 / 10** | O ponto mais forte do projeto. O conceito macOS é distintivo, adequado ao público (designers e editoras, utilizadores de Mac) e comunica bom gosto sem precisar de o afirmar. As fichas técnicas com gramagens e acabamentos concretos criam credibilidade real. Descontos por: impossibilidade de ampliar imagens (UX9 — a falha mais custosa em contexto comercial), Dock que se esconde e depende de hover, nada a indicar a categoria aberta, e o slogan da empresa a ser o texto menos legível do site. |
| **UX Mobile** | **2 / 10** | Não é uma questão de acabamento. **35% do catálogo é inalcançável** num telefone (M1), a navegação desaparece após 6,5 s e o seu substituto é um alvo de 6 px na pior zona possível do ecrã (M2), o contacto é inacessível (M3), o botão de fechar é um círculo vermelho sem símbolo, o slogan é cortado em ecrãs ≤375 px, e uma grelha pode exigir 8,1 MB. Os pontos concedidos reconhecem que existe esforço mobile deliberado (dois breakpoints, deteção de toque, backdrop de fechar-ao-tocar-fora, ícones e grelha ajustados) — a intenção existe, a execução está incompleta. |
| **Compatibilidade de browsers** | **6,5 / 10** | Prefixos `-webkit-` corretamente aplicados em `backdrop-filter` e `background-clip`; `:has()`, `clamp()` e `mix-blend-mode` estão dentro do suporte atual; a degradação graciosa é razoável. Descontos pelo tratamento do viewport móvel moderno — `92vh`/`88vh` em vez de `dvh`/`svh` (o problema mais concreto), `border: 0.5px` que desaparece em DPR 1, e dois riscos que exigem verificação em dispositivo: JPEG em CMYK e `mix-blend-mode` sobre PNG com alfa. |
| **Preparação para produção (global)** | **5 / 10** | Em desktop, este site está pronto para produção e apresenta bem a empresa. Em mobile, não cumpre o seu objetivo declarado — e o briefing identifica explicitamente o cenário mobile como prioritário. A nota reflete essa divisão: o build é limpo, não há vetores de segurança, os dados estão íntegros e a arquitetura é sã, mas um terço do portfólio é inalcançável e o contacto é inatingível no dispositivo que o proprietário tem no bolso. |

### Nota média ponderada

| Agrupamento | Nota |
|---|---|
| Fundamentos técnicos (arquitetura, React, código, manutenibilidade) | **6,4 / 10** |
| Postura de risco (segurança, compatibilidade) | **6,8 / 10** |
| Experiência do utilizador (desktop + mobile) | **5,0 / 10** |
| Qualidade não funcional (acessibilidade, performance, SEO) | **4,5 / 10** |
| **Global** | **5,5 / 10** |

### Leitura da pontuação

A distribuição é reveladora: **as notas altas estão nas dimensões difíceis de corrigir e as baixas nas dimensões relativamente fáceis.**

Arquitetura, qualidade React e UX desktop — as coisas que exigiriam reescrever o projeto — estão entre 6 e 8. Performance, acessibilidade e UX mobile — as notas mais baixas — resolvem-se com trabalho concentrado e delimitado: um pipeline de imagens, uma linha de `MotionConfig`, um segmented control em vez de `display: none`, uma barra de navegação persistente, e passar a usar um router que já está instalado.

Não há aqui dívida técnica estrutural. Há três problemas grandes num projeto saudável.

Estimativa realista, se a Fase 2 executar o plano na ordem recomendada: **8+ em todas as dimensões, com preparação global para produção acima de 8**. O Passo 1 do plano (Fase 2A + otimização de imagens + reduced-motion) resolve, isoladamente, a maior parte da distância entre 5,5 e 8.

---

# Notas metodológicas e limitações

## O que foi executado [OBS]

- Leitura integral dos 11 ficheiros `.jsx`, 2 ficheiros de dados, 7 ficheiros CSS, `index.html`, e todos os ficheiros de configuração.
- Busca exaustiva por 35 padrões de risco em `src/` e `index.html`.
- Verificação programática de integridade do modelo de dados (IDs, campos, referências, caminhos, coerência categoria↔produto, comportamento de `getProducts` com input inválido).
- Cruzamento completo das 45 referências de imagem contra os 47 ficheiros em disco, nos dois sentidos.
- Inspeção de formato real, modo de cor e dimensões de todas as 47 imagens.
- Cálculo do peso de download por subcategoria e por fluxo de navegação.
- `npm ci` + `vite build` + `eslint` + `npm audit` + `npm outdated` numa **cópia isolada em `/tmp`**, para não escrever nada no repositório.
- Inspeção do conteúdo real de cada chunk do bundle por assinaturas internas, para verificar o `manualChunks`.
- Verificação de tokens CSS definidos vs. usados, e de classes CSS definidas vs. referenciadas.
- Análise do estado de Git, histórico de commits, ficheiros versionados e diffs das modificações pré-existentes.
- Cálculo de contrastes e estimativa de largura de texto.

## O que não foi executado — e por isso não é afirmado

- **Nenhuma execução em browser real.** Não abri o site, não corri Lighthouse, não recolhi métricas de Core Web Vitals. Onde a conclusão dependia disso, está marcada **[VER]** e nenhuma pontuação numérica de Lighthouse é inventada.
- **Nenhum teste em dispositivo físico.** As conclusões sobre iOS Safari e Chrome Android derivam do comportamento documentado dessas plataformas aplicado ao código observado, não de observação direta.
- **Nenhuma medição de performance com profiler.** As afirmações sobre *layout thrashing* e custo de `backdrop-filter` identificam o mecanismo, não quantificam o impacto.
- **Nenhuma verificação com leitor de ecrã.** As conclusões de acessibilidade derivam da inspeção de semântica e atributos ARIA.
- **Nenhuma verificação em produção.** HSTS, TLS, redirecionamento de `www`, cabeçalhos reais servidos pela Vercel e comportamento efetivo do rewrite não foram inspecionados.
- **Nenhuma métrica de fonte real.** A estimativa de overflow do slogan usa avanço médio de glifos; a confirmação exige medição no browser.
- **A correção do conteúdo técnico dos produtos não foi verificada** contra a realidade da produção — apenas a coerência interna dos dados. As inconsistências em `ld1` requerem confirmação do proprietário.

## Sobre a integridade do repositório

Registei o estado de `git status` **antes** de qualquer operação. As 10 modificações não commitadas (diffs exclusivamente de fim de linha) eram **pré-existentes**.

Todas as operações de build correram numa cópia em `/tmp/audit_build` com `node_modules` próprio. Não foi executado `npm install` no repositório, não foi escrito em `client/dist`, não foi alterado `package-lock.json`, não foi feito commit, stash, checkout nem push.

---

```text
AUDIT COMPLETE

Files created:
- AUDIT_REPORT.md

Existing project files modified:
- NONE
```

**Fim da Fase 1. Aguardo instruções para prosseguir.**
