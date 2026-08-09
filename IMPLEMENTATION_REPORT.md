# RELATÓRIO DE IMPLEMENTAÇÃO — CLÁSSICA ARTES GRÁFICAS
### Fase 2 — correções sobre a auditoria da Fase 1

**Data:** 8 de agosto de 2026
**Base:** `AUDIT_REPORT.md` (commit `6bee56a`)
**Âmbito:** correção de problemas reais de segurança, navegação, mobile, acessibilidade, performance e manutenção — sem reescrever o projeto e sem alterar o conceito visual.

---

## 1. Resumo

O conceito macOS/Finder está intacto em desktop. O que mudou por baixo:

| | Antes | Depois |
|---|---|---|
| Produtos alcançáveis em telemóvel | **24 de 37** (65%) | **37 de 37** (100%) |
| URLs indexáveis | 1 | **56** |
| Peso da biblioteca de imagens | 60,2 MB | **10,1 MB** (−83%) |
| Maior ficheiro de imagem | 7 681 KB | **349 KB** (−95%) |
| Pior grelha (Postais) | 8,1 MB | **~120 KB** |
| Carregamento inicial | ~584 KB | **~155 KB** (−73%) |
| Cabeçalhos de segurança | 0 | 7 (incl. CSP restritiva) |
| Vulnerabilidades (`npm audit`) | 12 (10 alta) | **0** |
| Erros de `npm run lint` | 12 (8 falsos positivos) | **0** |
| Testes automatizados | 0 | **32** |
| Alvo de toque mínimo na navegação | 6 px | **54 px** |
| Contacto em telemóvel | inalcançável | 1 toque, `mailto:` + `tel:` |
| `prefers-reduced-motion` | ignorado | respeitado |
| Ampliação de imagens | impossível | lightbox com zoom até 350% |

Nada disto exigiu bibliotecas novas de estado, backend ou CMS. `products.js` e `categories.js` continuam a ser ficheiros simples de editar à mão — e agora com validação automática.

---

## 2. Problemas importantes encontrados

Além dos já documentados na auditoria, encontrei três problemas durante a implementação:

| # | Problema (novo) | Como apareceu |
|---|---|---|
| N1 | **`favicon.png` era um JPEG de 1024×1024** declarado como PNG de 48×48 — 55 KB descarregados em cada visita | Verificação de formato real dos ficheiros |
| N2 | **A MenuBar sobrepunha-se à janela do Finder em ecrã compacto** (z-index 300 > 200) e a margem inferior transbordava a área visível | Revisão do CSS mobile depois de tornar a janela full-screen |
| N3 | **Acesso a refs durante o render** na galeria (`direction.current` lido no JSX) — violação real das regras do React que o lint antigo nunca teria mostrado | `npm run lint` depois de corrigido |

Também confirmei que dois problemas do relatório **não** eram problemas:

- **`overflow: hidden` global** é correto para a metáfora de sistema operativo. Mantido; a landing passou a caber sempre em vez de precisar de scroll.
- **Dados dos produtos no bundle inicial** (21 KB) não justifica code-splitting. Não fiz.

---

## 3. Segurança

### 3.1 Cabeçalhos HTTP e CSP
**Problema:** `vercel.json` tinha apenas um rewrite. Nenhuma CSP, nenhuma proteção contra framing, nenhuma política de referrer.

**Solução:** sete cabeçalhos em `client/vercel.json`. A CSP é restritiva sem `unsafe-inline` em `script-src` — possível porque o site não carrega um único recurso de terceiros:

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none';
form-action 'none'; script-src 'self' 'sha256-…'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests
```

Mais `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy` e `Strict-Transport-Security`.

`style-src 'unsafe-inline'` é necessário porque o React e o Framer Motion escrevem atributos `style` — não permite execução de scripts.

**Ficheiros:** `client/vercel.json`

### 3.2 O hash da CSP não pode ficar dessincronizado
**Problema:** o único script inline é o bloco de dados estruturados schema.org. Usar um hash é a opção segura, mas se alguém editar esse bloco o Google perde os dados estruturados **em silêncio**.

**Solução:** `scripts/check-csp.mjs` corre no `postbuild`, extrai os scripts inline do HTML gerado, calcula os hashes e falha o build imprimindo o hash correto para colar. Uma falha silenciosa passou a ser uma falha explícita e auto-explicativa. Verificado: detetou corretamente o hash desatualizado durante a implementação.

**Ficheiros:** `client/scripts/check-csp.mjs`, `client/package.json`

### 3.3 Rewrite de SPA restrito
**Problema:** `/(.*) → /index.html` fazia com que uma imagem inexistente devolvesse HTML com **HTTP 200**, impossibilitando deteção de erros.

**Solução:** o rewrite exclui caminhos com extensão e as pastas de assets. Assets em falta devolvem 404 real; as rotas da aplicação continuam a funcionar.

**Ficheiros:** `client/vercel.json`

### 3.4 Dependências
**Problema:** 12 vulnerabilidades, incluindo 4 advisories em `react-router-dom` (runtime).

**Solução:** `react-router-dom` 7.13 → 7.18.2, `vite` → 7.3.6, `react`/`react-dom` → 19.2.8, `framer-motion` → 12.43. Sem upgrades major (evitei Vite 8, ESLint 10, Framer 13). Também corrigi as duas vulnerabilidades das ferramentas que eu próprio introduzi: `sharp` → 0.35.3 (CVEs do libvips) e `esbuild` → 0.28.1.

**Resultado:** `npm audit` = **0 vulnerabilidades**. Não usei `npm audit fix --force`.

O `@vercel/analytics` extraneous desaparece com um `npm ci` limpo.

**Ficheiros:** `client/package.json`, `client/package-lock.json`

### 3.5 Verificação de superfície de ataque
Reconfirmado após todas as alterações: zero `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `fetch`, `target="_blank"`, `iframe`, `localStorage`, segredos ou recursos externos. Os únicos links externos novos são `mailto:` e `tel:`.

---

## 4. Navegação e arquitetura

### 4.1 Navegação por URL (o React Router passou a ser usado)
**Problema:** o router estava instalado e pago em bytes para servir duas rotas. Toda a navegação real vivia em `useState`: sem deep linking, sem botão Voltar, refresh perdia o contexto, e 37 fichas técnicas ricas em terminologia do setor eram invisíveis para o Google.

**Solução:** rotas reais, com slugs derivados automaticamente dos dados:

```
/                                    landing
/livros                              → redireciona para a 1.ª subcategoria
/livros/capa-dura                    subcategoria
/livros/capa-dura/gps-peregrino      produto (slug do nome)
/livros/capa-dura/ld4                também resolve (id — links antigos não quebram)
```

Pontos de desenho:

- **`products.js` e `categories.js` não mudaram de forma.** Os slugs são calculados em `navigation.js`. Não há nada a escrever à mão.
- **Categorias, subcategorias e produtos são `<Link>`/`<NavLink>` reais** — abrem em nova aba, são rastreáveis pelo Google e ganham `aria-current` automaticamente.
- **`/categoria` normaliza para `/categoria/primeira-subcategoria`** com `replace`, para que o URL descreva sempre o que está no ecrã sem poluir o histórico.
- **O conceito visual não mudou:** o `<Shell>` (MenuBar + Desktop + navegação) nunca desmonta; as rotas só decidem se a janela está aberta e em quê. A janela continua a "abrir por cima" do desktop.

**Ficheiros:** `src/App.jsx`, `src/components/Shell.jsx`, `src/components/Finder/FinderRoute.jsx`, `src/data/navigation.js`, `src/hooks/useDocumentMeta.js`

### 4.2 A cascata de três efeitos desapareceu
**Problema:** `FinderWindow` tinha três `useEffect` encadeados a sincronizar estado com estado (4 erros de ESLint). Trocar de categoria com a janela aberta produzia um flash com o título novo e os produtos antigos.

**Solução:** o `FinderWindow` deixou de ter estado próprio — categoria, subcategoria e produto vêm do URL. Três efeitos e duas variáveis de estado passaram a zero. O `AnimatePresence` com chave no primeiro segmento do URL remonta a janela ao mudar de categoria, o que elimina o flash pela raiz.

**Ficheiros:** `src/components/Finder/FinderWindow.jsx`, `src/App.jsx`

### 4.3 Animações de saída passaram a funcionar
**Problema:** o `exit` do overlay e da janela nunca corria (faltava `AnimatePresence`), pelo que a janela abria com mola e fechava com corte seco. O `setTimeout(300ms)` existia para uma animação que não acontecia.

**Solução:** `AnimatePresence` em volta das rotas, com `location` passado explicitamente a `<Routes>` para que a rota anterior fique montada durante a saída. O `setTimeout` foi removido.

### 4.4 Tilt 3D sem conflito nem layout thrashing
**Problema:** o tilt escrevia `card.style.transform` diretamente num elemento que o Framer Motion também controlava, e chamava `getBoundingClientRect()` em cada evento de rato.

**Solução:** `useSpring`/`useTransform` com MotionValues. O Framer compõe a animação de entrada (`y`) e o tilt (`rotateX/rotateY/scale`) num único transform, e o retângulo é medido uma vez por entrada do ponteiro. **O efeito visual é o mesmo**, com mola em vez de transição CSS.

**Ficheiros:** `src/components/Finder/ProductGrid.jsx`

### 4.5 Uma única fonte de verdade para "é mobile"
**Problema:** o JavaScript decidia por capacidade de toque (`ontouchstart`), medida uma só vez; o CSS decidia por largura. Discordavam em portáteis com ecrã táctil e iPads, e rodar o dispositivo não reavaliava nada.

**Solução:** `useMediaQuery` com `useSyncExternalStore` — faz a mesma pergunta que o CSS, com o valor correto já no primeiro render e reavaliação em resize e rotação.

**Ficheiros:** `src/hooks/useMediaQuery.js`

### 4.6 Outras correções de arquitetura
- **Relógio movido para a MenuBar** (era estado da raiz, re-renderizava tudo a cada minuto) e alinhado com a mudança de minuto — antes podia estar 59 s desalinhado.
- **`vite.config.js`**: `manualChunks` em forma de função. A forma de objeto não capturava `react-dom/client`, pelo que o react-dom ficava no chunk da aplicação junto com os dados dos produtos. Agora o `vendor-react` (192 KB) está separado do `index` (62 KB) — **adicionar um produto invalida 62 KB de cache em vez de 222 KB**.
- **`__dirname` → `fileURLToPath`** no `vite.config.js` (o pacote é ESM).
- **`getProductImages()`** centraliza a normalização `image`/`images`, que estava duplicada em dois componentes e rebentaria com `images: []`.
- **`ErrorBoundary`** ganhou `componentDidCatch` (registo em consola) e um botão que volta ao início.
- **Código morto removido:** `animations.css` (vazio, não importado), `LoadingState` + `.loading-spinner` + `@keyframes spin`, `public/vite.svg`, 8 tokens CSS não usados, `.menubar-item.active` (agora aplicado de facto), o campo `icon` (emoji) das categorias, o ramo defensivo de `getProducts` para um formato de dados que não existe, `Disallow: /admin/`, e 2 imagens órfãs.
- **CSS reorganizado** por responsabilidade: `finder.css` tinha 474 linhas com 6 responsabilidades → `finder.css` (janela, sidebar, estados) + `product.css` (grelha, card, detalhe, galeria, lightbox, contacto); a página 404 saiu de `responsive.css` para `notfound.css`; `responsive.css` só tem media queries.
- **`.gitattributes`** com `* text=auto eol=lf` — 10 ficheiros apareciam permanentemente como modificados por diferenças de CRLF, o que tornava `git diff` inútil.
- **`npm run lint` passou a ser utilizável:** faltava `eslint-plugin-react` para a regra `jsx-uses-vars`; 8 dos 12 erros eram falsos positivos (`motion` "não utilizado") que escondiam 4 avisos legítimos. Agora: 0 erros.

---

## 5. Mobile

O princípio foi **mesmo produto, modelo de interação diferente onde é necessário** — não CSS responsivo por cima de um desktop encolhido. O discriminador é `(hover: hover) and (pointer: fine)`, não a largura, para tratar corretamente portáteis com touchscreen e iPads com trackpad.

### 5.1 CRÍTICO — 35% do catálogo era inalcançável
**Problema:** `responsive.css` escondia a `.finder-sidebar` com `display: none` em ecrãs ≤480px. Como a sidebar era o único mecanismo de troca de subcategoria e o Finder autoselecionava a primeira, **13 dos 37 produtos não tinham qualquer caminho de navegação num telefone** — incluindo os 4 livros de capa dura, ambos os postais, as 3 caixas de cartolina e o calendário de secretária com impressão estocástica.

**Solução:** `SubcategoryNav` renderiza a sidebar vertical em desktop e uma **barra horizontal de chips com scroll** em ecrã compacto — mesmos destinos, apresentação diferente. Cada chip mostra também a contagem de trabalhos. Nada é escondido.

**Verificado por teste automatizado:** os 37 produtos são alcançáveis por link em desktop **e** em modo compacto.

**Ficheiros:** `src/components/Finder/SubcategoryNav.jsx`, `styles/finder.css`, `styles/responsive.css`

### 5.2 CRÍTICO — a navegação desaparecia após 6,5 s
**Problema:** a `menubar-nav` estava escondida a ≤768px e a Dock aparecia aos 2,8 s, desaparecia aos 6,5 s e só reabria ao tocar numa barra de **6 px** colada ao fundo do ecrã — exactamente onde o iOS Safari desenha a sua própria barra e o iPhone tem o home indicator. Quem perdesse a janela de 3,7 s ficava sem navegação. Pior: a barra era `aria-hidden` e não focável, logo por teclado/leitor de ecrã o mecanismo não existia.

**Solução:** em ecrãs compactos a Dock é substituída por uma **TabBar inferior permanente** (padrão iOS — a Dock do macOS e a tab bar do iOS são o mesmo conceito):
- sempre visível, sem temporizadores
- alvos de **54 px** de altura (mínimo WCAG: 24 px; recomendação Apple: 44 px)
- **rótulos de texto sempre visíveis** — antes os nomes só apareciam em hover, pelo que num telefone a navegação eram 6 ícones SVG monocromáticos sem texto
- `env(safe-area-inset-bottom)` para o home indicator
- 7.º item: Contacto

Em desktop a Dock manteve-se como era, e ficou **melhor**: a alça de abertura passou a ser um `<button>` real (focável, com nome acessível, 16 px de área) em vez de uma `<div>` de 3 px `aria-hidden`.

**Ficheiros:** `src/components/Nav/TabBar.jsx`, `src/components/Dock/Dock.jsx`, `styles/responsive.css`, `styles/dock.css`

### 5.3 CRÍTICO — o contacto era inalcançável
**Problema:** o email só existia num dropdown accionado por `:hover` CSS. Em toque não há hover, o botão "Contactos" não tinha `onClick`, e o email era texto num `<span>` — não um `mailto:`. Num site cuja função declarada é apoio comercial.

**Solução:** `ContactPanel` — diálogo que abre por clique (rato, toque ou teclado), com email `mailto:` e telefone `tel:` como alvos de 60 px. Alcançável da MenuBar em desktop e da TabBar em mobile. O telefone (**917 206 087**) foi acrescentado ao painel, aos dados estruturados e ao `<noscript>`.

**Ficheiros:** `src/components/Contact/ContactPanel.jsx`, `src/data/contact.js`, `src/components/MenuBar/MenuBar.jsx`, `index.html`

### 5.4 Janela em ecrã inteiro, corretamente encaixada
**Problema:** `height: 92vh` — em iOS `vh` é o *large viewport*, pelo que com a barra do Safari visível a base da janela ficava por baixo dela. Com `align-items: flex-end` no overlay, era o conteúdo inferior que desaparecia. Encontrei ainda dois problemas próprios ao tornar a janela full-screen (**N2**): a MenuBar sobrepunha-se ao cabeçalho da janela, e a margem inferior transbordava.

**Solução:** o espaço é reservado com `padding` no overlay (MenuBar em cima, TabBar em baixo, mais as áreas seguras), e a janela ocupa exactamente o que resta. `dvh` com fallback `vh`. A MenuBar cresce para 52 px em compacto, com alvos de 44 px.

### 5.5 Botão de fechar utilizável
**Problema:** o semáforo de fechar tinha 12×12 px e o `×` só aparecia em hover — num telefone era um círculo vermelho vazio.

**Solução:** em compacto os semáforos dão lugar a um botão de fechar explícito de 44 px com ícone sempre visível. Em desktop os semáforos mantêm-se, mas com uma área de toque de 44 px em volta do círculo de 12 px (sem alterar o aspeto) e o símbolo passa a aparecer também no foco por teclado.

### 5.6 O slogan já não é cortado
**Problema:** `flex-wrap: nowrap` com `clamp(18px, …)` — abaixo de ~390 px de viewport o texto deixava de escalar e as primeiras e últimas letras eram cortadas sem scroll possível (estimativa: +66 px de overflow a 320 px).

**Solução:** quebra por palavra (nunca a meio de uma palavra), `clamp` a partir de 13 px, e `.desktop` com padding que reserva MenuBar, navegação e áreas seguras. A animação letra a letra manteve-se.

### 5.7 Galeria com swipe e lightbox com zoom
**Problema:** sem gestos, sem indicador de posição, e **era impossível ampliar uma imagem** — o detalhe estava limitado a 650 px apesar de existirem ficheiros de 3072×4096 px no servidor. A auditoria identificou isto como a falha comercial mais custosa: quando o cliente pergunta se a impressão fica assim tão nítida, a resposta era uma imagem de 650 px.

**Solução:**
- **Galeria:** arrastar para o lado muda de imagem (`drag="x"` com `touch-action: pan-y`, para não roubar o scroll vertical), indicador "Imagem 1 de 3", setas em desktop, `←`/`→` por teclado, e as miniaturas passaram a ser um `tablist` real.
- **Lightbox:** ecrã inteiro, toque/clique alterna entre ajustada e ampliada, arrastar move quando ampliada, roda do rato amplia, botões `+`/`−` com percentagem anunciada, `←`/`→` mudam de imagem, `Escape` fecha. Usa a variante de 1800 px.

**Ficheiros:** `src/components/Finder/Gallery.jsx`, `src/components/Finder/Lightbox.jsx`

### 5.8 Restante trabalho de toque
- **Especificações em duas linhas** (label acima, valor abaixo) em ≤900px — em ~340 px de largura o layout lado a lado comprimia as duas colunas a quebras feias.
- **Cards:** `whileTap` em toque (o hover e o tilt não existem lá), nome limitado a 2-3 linhas para não desalinhar a fila, texto "Ver ficha técnica" a explicar o que o clique faz, e um badge "+N" quando o produto tem mais fotografias.
- **Grelha:** 1 coluna ≤340px, 2 colunas ≤480px, `auto-fill` acima; cards com largura máxima para que um produto isolado não se estique pelo painel todo.
- **Paisagem em telefone** (`max-height: 500px`): logo e tagline menores, linha decorativa escondida, TabBar em linha com 44 px, galeria com mais altura.
- **`touch-action: manipulation`** em elementos de ação (remove o atraso de ~300 ms e o duplo-toque para zoom), `overscroll-behavior: contain` nas áreas roláveis (impede scroll chaining e rubber-band no iOS), `-webkit-text-size-adjust: 100%` (impede o reajuste do iOS ao rodar).
- **`viewport-fit=cover` + `env(safe-area-inset-*)`** introduzidos em conjunto — MenuBar, TabBar, Finder, lightbox, contacto e 404 respeitam todos as áreas seguras.

---

## 6. Performance

### 6.1 Imagens: 60,2 MB → 10,1 MB
**Problema:** 60,57 MB, cinco ficheiros entre 6,3 e 7,7 MB a 3072×4096 px, zero formatos modernos, zero `srcset`, zero dimensões intrínsecas. Abrir *Postais* → detalhe descarregava 21,2 MB.

**Solução — um pipeline, não uma conversão manual:**

`scripts/optimize-images.mjs` lê os originais de `client/assets-source/imagens/` (fora de `public/`, logo **não publicados**) e gera para `public/imagens/`:
- **AVIF + WebP** em 3 larguras (400 / 900 / 1800), nunca ampliando acima do original
- um **manifesto** (`src/data/imageManifest.js`) com as dimensões intrínsecas
- conversão **CMYK → sRGB** (os dois rótulos To Skin eram JPEG em CMYK, com risco real de cores erradas em Safari)
- normalização de nomes (removeu o acento de `Rotulo_Nutrimoa_Café.png` e os parênteses de `Embalagem_WAYUP(proteico)_MC_5.jpg`)
- execução **incremental** — só reprocessa o que falta, e valida cada ficheiro abrindo-o (uma execução interrompida não deixa ficheiros truncados)

`SmartImage` consome o manifesto e emite `<picture>` com AVIF → WebP, `srcset`/`sizes` por contexto, `width`/`height` intrínsecos (**elimina o layout shift**), `loading`/`fetchPriority` adequados e um placeholder visível se o ficheiro faltar (antes: ícone de imagem quebrada, sem qualquer `onError`).

**Resultados medidos:**

| | Antes | Depois |
|---|---|---|
| Biblioteca total | 60,20 MB | **10,14 MB** (−83,2%) |
| Maior ficheiro | 7 681 KB | **349 KB** |
| `Livro_GPS_Peregrino_D` | 7 681 KB | 231 KB (1800px) / 43 KB (900px) |
| `Calendario_..._Lado` | 6 749 KB | 33 KB (900px) |
| Grelha de Postais | 8 110 KB | ~120 KB |
| Deploy (`dist`) | ~62 MB | **12 MB** |

A qualidade não foi sacrificada: AVIF q56 com croma 4:4:4 (mantido de propósito porque as fotografias mostram texto impresso) e WebP q80. As fotografias originais ficam no repositório para regenerar a qualquer momento.

### 6.2 LCP, favicon e imagem de partilha
**Problema:** o logótipo (elemento LCP) era um **PNG de 407 KB** com extensão `.jpg`, e o `initial={{ opacity: 0 }}` mantinha-o invisível 1,2 s — um elemento com opacidade 0 não conta como LCP, pelo que a animação atrasava a métrica. O favicon eram 55 KB de JPEG a 1024×1024 (**N1**). A imagem Open Graph era o logótipo em proporção 4:1 declarado como `summary_large_image`.

**Solução:** logótipo em AVIF (**20 KB** na variante de 900 px, com preload apontado a essa variante exata), animação de entrada reduzida de 1,2 s para 0,8 s; `favicon-32.png` (0,5 KB), `favicon-192.png`, `apple-touch-icon.png` (180×180) e `og-image.jpg` dedicado 1200×630 com `og:image:width/height/alt` — gerados por `scripts/make-brand-assets.mjs`.

**Carregamento inicial: ~584 KB → ~155 KB** (135 KB de texto comprimido + 20 KB de imagem).

### 6.3 Outras
- **Cache-Control** no `vercel.json`: um ano imutável para os assets com hash, um dia com `stale-while-revalidate` para as imagens.
- **`manualChunks` corrigido** (secção 4.6) — o cache do React deixa de ser invalidado por cada produto novo.
- **`loading="eager"` + `fetchPriority="high"`** na imagem ativa da galeria (antes tinha `lazy`, apesar de ser o conteúdo em foco); os 4 primeiros cards da grelha carregam eager, o resto lazy.
- **Cascata de entrada** da grelha limitada a 8 itens (era proporcional ao índice, sem limite).

---

## 7. Acessibilidade

### 7.1 O Finder é um diálogo a sério
**Problema:** modal sem `role="dialog"`, sem `aria-modal`, sem gestão de foco, sem *focus trap*, sem devolução de foco. O foco ficava no botão que abriu a janela e Tab percorria a MenuBar e a Dock por trás do overlay.

**Solução:** `useFocusTrap` — move o foco para dentro ao abrir, prende `Tab`/`Shift+Tab`, devolve o foco ao elemento de origem ao fechar, e marca como `inert` os irmãos de cada nível até `<body>` (nunca os ancestrais), isolando o diálogo de teclado, rato e cursor virtual de leitor de ecrã. Aplicado ao Finder, ao lightbox e ao painel de contacto.

**Verificado por teste:** o foco entra no diálogo, a MenuBar fica `inert`, e o diálogo e os seus ancestrais nunca ficam `inert`.

### 7.2 Movimento reduzido
**Problema:** 14 animações ignoravam a preferência do sistema, incluindo ~3 s de movimento na landing com 29 caracteres animados individualmente e o tilt 3D com perspetiva — um gatilho conhecido de desconforto vestibular.

**Solução:** `<MotionConfig reducedMotion="user">` em `main.jsx` (desativa animações de transformação em toda a árvore, preservando as de opacidade) mais um bloco `@media (prefers-reduced-motion: reduce)` para o que é CSS puro.

### 7.3 Restante
- **`<h1>` na página principal:** não existia nenhum. Agora há um `<h1>` visualmente oculto (não `display:none`, que o removeria da árvore de acessibilidade) com o posicionamento da empresa; o título da janela passou a `<h2>`, referenciado por `aria-labelledby`.
- **Escape hierárquico:** do detalhe volta à grelha, da grelha fecha a janela. Antes fechava tudo de uma vez.
- **Botões invisíveis já não são focáveis:** a Dock escondida usava só `opacity: 0`, que não remove da ordem de tabulação — era possível focar e ativar um botão invisível. Agora usa `visibility: hidden`.
- **Estado comunicado, não só colorido:** `aria-current` na categoria e subcategoria ativas, `role="tablist"`/`aria-selected` na galeria, ponto indicador na Dock.
- **Contrastes corrigidos** (todos ≥4,5:1): tagline 0,35→0,55 de opacidade (≈2,6:1 → ≈4,9:1), estados vazios, títulos da sidebar e das secções, rótulos de especificação. A cor de acento passou de `#007aff` (3,9:1) para `#0064d2` (4,6:1).
- **`alt` corrigido:** descritivo nas imagens de conteúdo, `alt=""` nas miniaturas (que estão dentro de botões já rotulados — antes o leitor anunciava o mesmo texto duas vezes).
- **Semântica:** grelha em `<ul>`/`<li>`, especificações em `<dl>`/`<dt>`/`<dd>`, `<nav>` com `aria-label` em cada bloco de navegação, semáforos decorativos passaram de `<button disabled>` sem nome para `<span aria-hidden>`.
- **Link "saltar para o conteúdo"** que aparece ao receber foco.
- **Zoom do browser** continua permitido (sem `maximum-scale`).
- **404 útil:** em vez de um beco sem saída, lista as categorias — quem chegou lá por um link com erro queria ver trabalhos.

---

## 8. SEO

- **1 → 56 URLs indexáveis**, cada um com título, descrição e canonical próprios (`useDocumentMeta`).
- **Sitemap gerado no build** a partir dos dados (`scripts/generate-sitemap.mjs`), com prioridade por profundidade — deixa de poder ficar desatualizado.
- **Produtos são links reais**, logo rastreáveis: o Googlebot renderiza JavaScript mas não clica em botões.
- **404 marca `noindex`** em runtime (com o rewrite de SPA a resposta é sempre 200, o que o Google trataria como *soft 404*).
- **Dados estruturados** com `telephone` e `areaServed`; `og:image` dedicado com dimensões e `alt`.
- **`<meta keywords>` removido** — ignorado pelo Google desde 2009, e os 60+ termos que tentava representar são agora conteúdo real indexável.
- **`Disallow: /admin/`** removido do robots.txt (não existe painel de admin).

---

## 9. Testes executados e resultados

### 9.1 Suite funcional criada
`scripts/smoke-test.jsx` — monta a aplicação real num DOM (jsdom), navega e verifica comportamento. **32 testes, todos a passar.**

| Secção | Testes | O que garante |
|---|---|---|
| `rotas` | 6 ✓ | rotas resolvem, `/categoria` normaliza, produto por slug **e** por id antigo, ficha técnica completa |
| `404` | 4 ✓ | categoria/subcategoria/produto inválidos e profundidade excessiva dão 404 com `noindex` |
| `alcance` | 3 ✓ | **os 37 produtos alcançáveis por link em desktop E em compacto**; todas as subcategorias alcançáveis |
| `a11y` | 9 ✓ | `role="dialog"`+`aria-modal`+`aria-labelledby` válido, foco entra na janela, fundo `inert` sem afetar o diálogo, Escape hierárquico, `aria-current`, `tablist`, nenhum botão sem nome, skip link com destino real |
| `imagens` | 3 ✓ | `width`/`height` e `srcset` AVIF+WebP em todas as vistas, `alt` descritivo, miniaturas com `alt=""` |
| `mobile` | 4 ✓ | TabBar substitui a Dock com rótulos visíveis, chips em vez de sidebar, botão de fechar explícito, contacto abre por clique com `mailto:`+`tel:` |
| `seo` | 2 ✓ | título e canonical mudam por rota, produtos são `<a href>` |

A suite falha também se o React emitir qualquer erro ou aviso na consola.

### 9.2 Comandos
| Comando | Resultado |
|---|---|
| `npm run lint` | **0 erros** (antes: 12) |
| `npm run validate` | ✓ 6 categorias, 12 subcategorias, 37 produtos, 0 erros, 0 avisos |
| `npm run build` | ✓ em 1,09 s, 0 warnings (inclui validate + sitemap + check-csp) |
| `npm test` | ✓ 32/32 |
| `npm audit` | **0 vulnerabilidades** |
| `npm audit --omit=dev` | 0 vulnerabilidades |
| `npm run images` | ✓ 60,20 MB → 10,14 MB, 258 ficheiros, integridade verificada |

### 9.3 Verificações manuais
- **Integridade das 258 imagens geradas:** todas abertas e validadas com sharp — 0 inválidas.
- **Cruzamento de referências:** 0 imagens referenciadas inexistentes, 0 órfãs.
- **Composição dos chunks:** inspecionada por assinaturas internas — o react-dom está agora no `vendor-react`, separado dos dados dos produtos.
- **`check-csp.mjs` testado a falhar:** detetou corretamente um hash desatualizado e imprimiu o correto.
- **Classes CSS ↔ JSX** cruzadas nos dois sentidos.

### 9.4 O que NÃO foi possível testar
**Não existe browser gráfico neste ambiente** (a instalação do Chromium foi bloqueada). Por isso:

- ❌ **Verificação visual em iPhone/Android reais.** jsdom não tem motor de layout, pelo que **overflow, alturas com `dvh`, áreas seguras, `backdrop-filter` e o comportamento de swipe não foram observados** — foram desenhados a partir do comportamento documentado dessas plataformas.
- ❌ Lighthouse e Core Web Vitals de campo. Os números de peso são medidos; LCP/CLS/INP são esperados, não medidos.
- ❌ Leitor de ecrã real (VoiceOver/NVDA). A semântica está verificada; a experiência auditiva não.
- ❌ Renderização dos dois rótulos convertidos de CMYK em Safari.

**Recomendo, antes de considerar fechado:** abrir o site num iPhone e num Android, em retrato e paisagem, percorrer as 12 subcategorias, ampliar uma imagem, e correr o Lighthouse mobile em produção.

---

## 10. Problemas que decidi NÃO alterar

| # | Item | Porquê |
|---|---|---|
| 1 | **Ficha do produto `ld1`** ("Cosido e brochado" num livro de capa dura) | Instruiu-me a não mexer. **Continua pendente** — ver secção 11. |
| 2 | **`overflow: hidden` global** | É correto para a metáfora de sistema operativo, e a auditoria classificou-o como decisão deliberada. Em vez de o remover, garanti que o conteúdo nunca excede o viewport. |
| 3 | **Code-splitting dos dados dos produtos** | 21 KB brutos (~6 KB gzip) para 37 produtos não justifica a complexidade e a latência extra. Reavaliar se o catálogo crescer para centenas de produtos. |
| 4 | **Biblioteca de estado (Redux/Zustand)** | Com a navegação no URL, o estado local restante são três variáveis de UI. Não há necessidade arquitetural. |
| 5 | **TypeScript** | Migração desproporcionada. O `npm run validate` cobre a classe de erro que interessa (dados). Se quiser tipos no editor sem migrar, um `jsconfig.json` com `checkJs` é suficiente. |
| 6 | **Upgrades major** (Vite 8, ESLint 10, Framer 13, `@vitejs/plugin-react` 6) | Risco de regressão sem benefício para os objetivos. Fiquei nos patches e minors dentro da mesma major. |
| 7 | **`mix-blend-mode` e `backdrop-filter`** | São a identidade glassmorphism. A auditoria recomendava medir antes de reduzir, e não consigo medir sem browser. Mantidos. |
| 8 | **Subcategorias com um único produto** (3 casos) e **`Catálogos › Catálogos`** | É decisão editorial, não técnica. Mitiguei o efeito visual (cards com largura máxima, para um produto isolado não se esticar) e a navegação de subcategorias esconde-se quando só existe uma. |
| 9 | **`@types/react` / `@types/react-dom`** | Não há TypeScript, mas ajudam a inferência no editor. Inofensivos. |
| 10 | **`.idea/` versionado** | Não removi do índice do Git para não misturar uma alteração de histórico com esta entrega. Fica como sugestão: `git rm --cached -r .idea`. |
| 11 | **Nome duplicado** ("Gramática da Língua Chinesa" em capa mole e capa dura) | É legítimo — duas edições reais. Os URLs são distintos porque estão em subcategorias diferentes, e o `npm run validate` avisaria se colidissem. |

---

## 11. Pontos que precisam da sua decisão

1. **Ficha técnica do `ld1`** — *Gramática da Língua Chinesa* (Livros de Capa Dura) diz `Acabamento capa: Cosido e brochado`. "Brochado" é acabamento de capa mole; os outros 3 livros de capa dura dizem "Cosido e cartonado". Tem também dois rótulos a começar por "Acabamento" e uma descrição genérica, ao contrário de todos os outros produtos. **Não toquei, como pediu** — quando confirmar o valor correto, é uma linha em `products.js` (linha ~226).

2. **Morada da empresa** — optou por publicar só o telefone. Se mais tarde quiser aparecer nos resultados de mapa do Google, faltam `streetAddress` e `postalCode` nos dados estruturados do `index.html` (há um comentário no ficheiro a indicar onde).

3. **Verificação em dispositivo real** — ver 9.4. É o único bloco de validação que não consegui cobrir.

4. **`npm install` local** — atualizei o `package.json` e o `package-lock.json` mas **não** corri `npm install` na sua pasta (instalaria binários de Linux e quebraria o ambiente Windows). Antes de arrancar o `npm run dev`, corra:
   ```bash
   cd client
   npm install
   ```

5. **As fotografias originais mudaram de sítio** — de `client/public/imagens/` para `client/assets-source/imagens/`. Continuam no repositório (mesmo peso, caminho diferente) e são a fonte para regenerar. **`client/public/imagens/` é agora output gerado — não editar à mão.** O workflow atualizado está no `client/CLAUDE.md`.

6. **Apaguei `client/dist/`** — eram 62 MB de build antigo, com caminhos de imagem que já não existem. É gerado por `npm run build` e está no `.gitignore`.

---

## 12. Ficheiros

**Novos (21):** `Shell.jsx`, `SmartImage.jsx`, `Nav/TabBar.jsx`, `Contact/ContactPanel.jsx`, `Finder/FinderRoute.jsx`, `Finder/SubcategoryNav.jsx`, `Finder/Gallery.jsx`, `Finder/Lightbox.jsx`, `hooks/useMediaQuery.js`, `hooks/useFocusTrap.js`, `hooks/useDocumentMeta.js`, `data/navigation.js`, `data/contact.js`, `data/imageManifest.js` (gerado), `utils/images.js`, `styles/product.css`, `styles/notfound.css`, `scripts/` (7 ficheiros), `.gitattributes`, `IMPLEMENTATION_REPORT.md`

**Alterados (18):** `main.jsx`, `App.jsx`, `index.html`, `vercel.json`, `vite.config.js`, `eslint.config.js`, `package.json`, `package-lock.json`, `Desktop.jsx`, `MenuBar.jsx`, `Dock.jsx`, `ErrorBoundary.jsx`, `NotFound.jsx`, `FinderWindow.jsx`, `ProductGrid.jsx`, `ProductDetail.jsx`, `FinderStates.jsx`, `categories.js`, `products.js` (2 caminhos de imagem + comentário de workflow), `styles/base.css`, `styles/desktop.css`, `styles/menubar.css`, `styles/dock.css`, `styles/finder.css`, `styles/responsive.css`, `robots.txt`, `CLAUDE.md`, `README.md`

**Removidos:** `styles/animations.css`, `public/vite.svg`, `public/favicon.png` (movido para `assets-source/favicon-original.png`), `client/dist/`, 47 originais movidos de `public/imagens/` para `assets-source/imagens/`

---

## 13. Conclusão

O site foi analisado novamente após as alterações — com lint, validação de dados, build de produção, 32 testes funcionais sobre a aplicação real e verificação de integridade de todos os assets. Dentro do âmbito desta aplicação, e com a exceção explícita da verificação visual em dispositivo físico (secção 9.4) e do ponto de conteúdo em aberto (secção 11.1), **os problemas relevantes identificados na auditoria foram corrigidos.**

O que o proprietário ganha, em concreto: pode abrir o site no telemóvel numa reunião, chegar a qualquer um dos 37 trabalhos em dois toques, ampliar uma fotografia para mostrar a qualidade de impressão, enviar ao cliente o link direto desse trabalho, e ser contactado com um toque — com o site a carregar 155 KB em vez de 584 KB e cada categoria a pesar kilobytes em vez de megabytes.

Em desktop, tudo aquilo que já funcionava bem continua igual.
