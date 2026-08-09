# Clássica Artes Gráficas — Contexto do Projeto

## O que é este projeto

Website vitrina profissional para a **Clássica Artes Gráficas**, uma pequena empresa portuguesa de artes gráficas localizada no Porto. A empresa trabalha por encomenda/projeto (sem e-commerce, sem stock) e produz: catálogos, livros, calendários, embalagens, rótulos e outros materiais impressos personalizados.

O site serve como:
- **Montra profissional** para mostrar trabalhos realizados (portfólio)
- **Apoio comercial** quando o proprietário apresenta a empresa a clientes — **incluindo no telemóvel**
- Transmitir profissionalismo, bom gosto e confiança

## Stack técnico

- **Framework:** React 19 (Vite 7)
- **Router:** react-router-dom 7 — a navegação é por URL, não por estado local
- **Animações:** Framer Motion
- **Estilos:** CSS puro (sem Tailwind)
- **Imagens:** AVIF + WebP gerados por script a partir dos originais
- **Backend:** Nenhum — site completamente estático
- **Deploy:** **Vercel** (via GitHub, branch `main`) — ver `vercel.json`
- **Repositório:** `https://github.com/Jp3teixeira/classica2`

## Estrutura do projeto

```
classica2/
├── AUDIT_REPORT.md           ← auditoria técnica (Fase 1)
├── IMPLEMENTATION_REPORT.md  ← o que foi corrigido (Fase 2)
└── client/
    ├── assets-source/imagens/  ← FOTOGRAFIAS ORIGINAIS (não publicadas)
    ├── public/
    │   ├── imagens/            ← derivados AVIF/WebP gerados (NÃO editar à mão)
    │   ├── og-image.jpg, favicon-*.png, apple-touch-icon.png
    │   └── robots.txt, sitemap.xml (sitemap é gerado)
    ├── scripts/
    │   ├── optimize-images.mjs   ← gera os derivados + o manifesto
    │   ├── make-brand-assets.mjs ← favicons e imagem de partilha
    │   ├── validate-data.mjs     ← valida o catálogo (corre no prebuild)
    │   ├── generate-sitemap.mjs  ← gera o sitemap (corre no prebuild)
    │   ├── check-csp.mjs         ← valida a CSP (corre no postbuild)
    │   └── smoke-test.jsx        ← testes funcionais (npm test)
    ├── vercel.json             ← headers de segurança + rewrites
    └── src/
        ├── App.jsx             ← árvore de rotas
        ├── components/
        │   ├── Shell.jsx       ← layout persistente (MenuBar + Desktop + navegação)
        │   ├── SmartImage.jsx  ← imagem responsiva (usar SEMPRE esta)
        │   ├── Desktop/        ← landing (logo + tagline animada)
        │   ├── MenuBar/        ← barra superior estilo macOS
        │   ├── Dock/           ← barra inferior (apenas desktop, com hover)
        │   ├── Nav/TabBar.jsx  ← navegação em telemóvel/tablet
        │   ├── Contact/        ← painel de contactos
        │   ├── NotFound/       ← página 404
        │   └── Finder/
        │       ├── FinderRoute.jsx    ← traduz o URL em categoria/produto
        │       ├── FinderWindow.jsx   ← a janela (diálogo modal acessível)
        │       ├── SubcategoryNav.jsx ← sidebar (desktop) / chips (mobile)
        │       ├── ProductGrid.jsx    ← grelha de cards com tilt 3D
        │       ├── ProductDetail.jsx  ← ficha técnica
        │       ├── Gallery.jsx        ← galeria com swipe
        │       └── Lightbox.jsx       ← imagem ampliada com zoom
        ├── data/
        │   ├── products.js     ← BASE DE DADOS de todos os produtos ⚠️ ficheiro principal
        │   ├── categories.js   ← categorias e subcategorias
        │   ├── contact.js      ← email e telefone (fonte única)
        │   ├── navigation.js   ← URLs/slugs derivados dos dados acima
        │   └── imageManifest.js ← GERADO, não editar
        ├── hooks/              ← useMediaQuery, useFocusTrap, useDocumentMeta
        └── styles/             ← base, desktop, menubar, dock, finder, product,
                                  notfound, responsive
```

## Design — conceito

Inspirado no macOS (Finder, MenuBar, Dock). O utilizador "abre" categorias como se fossem janelas do sistema operativo. Minimalista, premium, fundo claro com glassmorphism subtil.

**Em desktop** o conceito é o original, intacto. **Em ecrãs ≤900px** a interação é traduzida para toque, mantendo a identidade visual: a Dock dá lugar a uma barra de navegação inferior permanente, a sidebar de subcategorias dá lugar a uma barra horizontal, e a janela passa a ecrã inteiro. O discriminador é `(hover: hover) and (pointer: fine)`, não a largura — para tratar corretamente portáteis com ecrã táctil e iPads com trackpad.

## URLs

```
/                                       landing
/livros                                 → redireciona para a 1ª subcategoria
/livros/capa-dura                       subcategoria
/livros/capa-dura/gps-peregrino         produto (slug do nome)
/livros/capa-dura/ld4                   também funciona (id, para links antigos)
```

Os slugs são derivados automaticamente em `navigation.js` — não há nada a escrever à mão em `products.js`.

## Como adicionar um produto (workflow)

1. Coloca a **fotografia original** (pode ser grande, direto da câmara) em
   `client/assets-source/imagens/PASTA-CORRETA/`
2. `cd client && npm run images`
   → gera AVIF/WebP em 3 tamanhos e atualiza `src/data/imageManifest.js`
3. Abre `client/src/data/products.js`, encontra a categoria e copia um bloco existente
4. Ajusta `id`, `name`, `description`, `image` (ou `images`) e `characteristics`
5. `npm run check` (lint + validação do catálogo + testes)
6. `git add -A && git commit -m "novo produto" && git push` → deploy automático

### Estrutura de um produto simples
```js
{
    id: 'id-unico',
    name: 'Nome do Produto',        // define o URL
    description: 'Texto descritivo.\n\nOs \\n são preservados no site.',
    image: '/imagens/Pasta/nome-ficheiro.jpg',
    characteristics: [
        { label: 'Formato', value: '21 x 29,7 cm' },
        { label: 'Acabamento', value: 'Cosido e brochado' }
    ]
}
```

### Produto com múltiplas imagens (galeria)
```js
{
    id: 'id-unico',
    name: 'Nome do Produto',
    description: 'Texto descritivo.',
    images: [
        { src: '/imagens/Pasta/foto1.jpg', label: 'Aberto' },   // label é opcional
        { src: '/imagens/Pasta/foto2.jpg', label: 'Fechado' }
    ],
    characteristics: [ ... ]
}
```

> ⚠️ Usar `image` (string) para 1 foto, `images` (array) para várias. Nunca ambos —
> `npm run validate` falha o build se isso acontecer.

## Categorias existentes e seus IDs

| Categoria | ID (= URL) | Subcategorias (URL) |
|---|---|---|
| Catálogos | `catalogos` | `catalogos-todos` (`todos`) |
| Livros | `livros` | `livros-capa-mole` (`capa-mole`), `livros-capa-dura` (`capa-dura`) |
| Calendários de Parede | `calendarios` | `calendarios-3-macetes` (`3-macetes`), `calendarios-4-macetes` (`4-macetes`) |
| Embalagens | `embalagens` | `embalagens-micro-canelado` (`micro-canelado`), `embalagens-cartolina` (`cartolina`) |
| Rotulagem | `rotulagem` | `rotulos` (`rotulos`) |
| Outros | `outros` | `outros-brochuras`, `outros-postais`, `outros-calendarios-secretaria`, `outros-embalagens-redondas` |

## Contactos da empresa (no código)

Definidos em `client/src/data/contact.js`:

```
Email:    geral@classicaag.pt
Telefone: 917 206 087
```

> Os mesmos valores estão repetidos nos dados estruturados e no `<noscript>` do
> `client/index.html`, porque são lidos por motores de busca antes de o
> JavaScript correr. **Se alterar num sítio, altere no outro.**

## Comandos úteis

```bash
cd client

npm run dev            # desenvolvimento local
npm run images         # regenerar imagens (só quando adiciona/troca fotografias)
npm run brand-assets   # regenerar favicons e imagem de partilha
npm run validate       # validar o catálogo
npm test               # testes funcionais
npm test -- rotas,a11y # só algumas secções (útil se a memória for curta)
npm run check          # lint + validate + test
npm run build          # build de produção (inclui validate, sitemap e check-csp)
```

## Notas importantes

- **Não existe backend** — tudo é estático. Sem API, sem base de dados, sem autenticação.
- **Mobile é prioritário.** O proprietário mostra o site a clientes no telemóvel;
  todo o catálogo tem de estar alcançável e legível num ecrã pequeno.
- **Nunca editar `public/imagens/` à mão** — é output gerado. Editar os originais
  em `assets-source/imagens/` e correr `npm run images`.
- **Usar sempre `<SmartImage>`** em vez de `<img>`: garante AVIF/WebP, `srcset`,
  dimensões intrínsecas (evita layout shift) e fallback se o ficheiro faltar.
- **Nomes de ficheiro sem acentos nem parênteses** em `assets-source/imagens/`.
- **Se editar os dados estruturados do `index.html`**, o build vai falhar com o
  hash correto da CSP para colar em `vercel.json`. É intencional — impede que a
  política de segurança fique dessincronizada em silêncio.
- O Vercel faz deploy automático a cada push para `main`.
