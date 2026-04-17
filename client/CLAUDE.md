# Clássica Artes Gráficas — Contexto do Projeto

## O que é este projeto

Website vitrina profissional para a **Clássica Artes Gráficas**, uma pequena empresa portuguesa de artes gráficas localizada no Porto. A empresa trabalha por encomenda/projeto (sem e-commerce, sem stock) e produz: catálogos, livros, calendários, embalagens, rótulos e outros materiais impressos personalizados.

O site serve como:
- **Montra profissional** para mostrar trabalhos realizados (portfólio)
- **Apoio comercial** quando o proprietário apresenta a empresa a clientes
- Transmitir profissionalismo, bom gosto e confiança

## Stack técnico

- **Framework:** React (Vite)
- **Animações:** Framer Motion
- **Estilos:** CSS puro (sem Tailwind)
- **Backend:** Nenhum — site completamente estático
- **Deploy:** Render (via GitHub, branch `main`)
- **Repositório:** `https://github.com/Jp3teixeira/classica2`

## Estrutura do projeto

```
classica2/
└── client/                  ← Todo o código frontend
    ├── public/
    │   └── imagens/         ← Todas as imagens de produtos
    │       ├── Catalogos/
    │       ├── Livros/Capa_Mole/
    │       ├── Livros/Capa_Dura/
    │       ├── Calendarios/3M/
    │       ├── Calendarios/4M/
    │       ├── Embalagens/Micro_Canelado_MC/
    │       ├── Embalagens/Cartolina/
    │       ├── Rotulos/
    │       ├── Outros/Brochuras/
    │       ├── Outros/Postais/
    │       ├── Outros/Calendarios_Secretaria/
    │       ├── Outros/Embalagens_Redondas/
    │       └── Logos/
    └── src/
        ├── components/
        │   ├── Desktop/       ← Landing page (logo + tagline animada)
        │   ├── MenuBar/       ← Barra superior estilo macOS
        │   ├── Dock/          ← Barra inferior com ícones de categorias
        │   └── Finder/        ← Janela de exploração de produtos
        │       ├── FinderWindow.jsx   ← Container principal
        │       ├── ProductGrid.jsx    ← Grelha de cards com efeito 3D tilt
        │       ├── ProductDetail.jsx  ← Vista de detalhe do produto
        │       └── FinderStates.jsx   ← Estados: loading, empty, folder icon
        ├── data/
        │   ├── products.js    ← BASE DE DADOS de todos os produtos ⚠️ ficheiro principal
        │   └── categories.js  ← Definição das categorias e subcategorias
        └── styles/
            ├── desktop.css
            ├── menubar.css
            ├── dock.css
            └── finder.css
```

## Design — conceito

Inspirado no macOS (Finder, MenuBar, Dock). O utilizador "abre" categorias como se fossem janelas do sistema operativo. Minimalista, premium, fundo claro com glassmorphism subtil.

- **Landing:** Logo branco centrado + tagline "Fique com boa impressão nossa" (animada letra a letra)
- **MenuBar:** Fixa no topo — nome da empresa, navegação por categorias, contacto (hover dropdown), data/hora
- **Dock:** Barra inferior que aparece via hover/entrada — ícones para cada categoria de produto
- **Finder Window:** Janela com sidebar de subcategorias + grelha de produtos + detalhe do produto

## Como adicionar um produto (workflow)

1. Coloca a imagem em `client/public/imagens/PASTA-CORRETA/`
2. Abre `client/src/data/products.js`
3. Encontra a categoria certa e copia um bloco existente
4. Ajusta: `id`, `name`, `description`, `image` (ou `images` para múltiplas fotos), `characteristics`
5. `git add . && git commit -m "novo produto" && git push` → deploy automático no Render

### Estrutura de um produto simples
```js
{
    id: 'id-unico',
    name: 'Nome do Produto',
    description: 'Texto descritivo.',
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
        { src: '/imagens/Pasta/foto1.jpg' },
        { src: '/imagens/Pasta/foto2.jpg' }
    ],
    characteristics: [ ... ]
}
```

> ⚠️ Usar `image` (string) para 1 foto, `images` (array) para múltiplas. Nunca ambos no mesmo produto.

## Categorias existentes e seus IDs

| Categoria | ID no código | Subcategorias |
|---|---|---|
| Catálogos | `catalogos` | `catalogos-todos` |
| Livros | `livros` | `livros-capa-mole`, `livros-capa-dura` |
| Calendários | `calendarios` | `calendarios-3-macetes`, `calendarios-4-macetes` |
| Embalagens | `embalagens` | `embalagens-micro-canelado`, `embalagens-cartolina` |
| Rotulagem | `rotulagem` | `rotulos` |
| Outros | `outros` | `outros-brochuras`, `outros-postais`, `outros-calendarios-secretaria`, `outros-embalagens-redondas` |

## Contactos da empresa (no código)

```
Email: geral@classicaag.pt
```

## Comandos úteis

```bash
# Desenvolvimento local
cd client && npm run dev

# Build de produção (verificar antes de fazer push)
cd client && npm run build

# Deploy (automático via push)
git add -A
git commit -m "descrição da mudança"
git push
```

## Notas importantes

- **Não existe backend** — tudo é estático. Sem API, sem base de dados, sem autenticação.
- **Mobile não é prioritário** — 99% dos clientes usam Mac desktop.
- **Nomes de pastas sem acentos** no `public/imagens/` para evitar erros no servidor.
- O Render faz deploy automático a cada push para `main`.
- O ficheiro `products.js` é o único lugar onde se gerem os produtos — não há CMS.
