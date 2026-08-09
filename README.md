# Clássica Artes Gráficas — Site Oficial

Site institucional da Clássica Artes Gráficas, disponível em [www.classicaag.pt](https://www.classicaag.pt).

## Stack

- **Frontend:** React 19 + Vite 7 + React Router 7 + Framer Motion
- **Estilos:** CSS puro
- **Imagens:** AVIF + WebP responsivos, gerados por script
- **Backend:** nenhum — site estático
- **Deploy:** Vercel (automático a cada push para `main`)
- **Domínio:** amen.pt → Vercel

## Arrancar

```bash
cd client
npm install
npm run dev
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (valida o catálogo, gera o sitemap, verifica a CSP) |
| `npm run check` | Lint + validação do catálogo + testes funcionais |
| `npm test` | Testes funcionais (rotas, acessibilidade, mobile) |
| `npm run images` | Regenera as imagens a partir de `assets-source/imagens/` |
| `npm run brand-assets` | Regenera favicons e imagem de partilha |

## Adicionar um produto

Ver **`client/CLAUDE.md`** — tem o workflow completo, a lista de categorias e as
regras do modelo de dados.

Resumo: colocar a fotografia original em `client/assets-source/imagens/`, correr
`npm run images`, acrescentar o bloco em `client/src/data/products.js`, correr
`npm run check` e fazer push.

## Documentação

- **`AUDIT_REPORT.md`** — auditoria técnica completa do estado anterior
- **`IMPLEMENTATION_REPORT.md`** — o que foi corrigido e porquê
- **`client/CLAUDE.md`** — contexto do projeto e guia de manutenção
