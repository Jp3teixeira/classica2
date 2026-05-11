# 🔍 Porque é que o site não aparece no Google (e o que fazer)

## O problema em linguagem simples

O Grok explicou bem. As **meta tags que colocámos** (keywords, description, etc.) são como
pôr um cartaz na montra da loja — é necessário, mas NÃO é suficiente.

O Google funciona como um sistema de reputação. Imagina assim:
- Um restaurante novo pode ter a melhor comida do Porto
- Mas se ninguém fala dele, o Google não o recomenda
- Os restaurantes com anos, com reviews e com menções noutros sites aparecem primeiro

O site da Clássica é "novo" para o Google. Tem o texto certo, mas ZERO reputação online.

---

## O que as tags fazem vs. o que NÃO fazem

### ✅ O que as tags fazem:
- Dizem ao Google "este site é sobre impressão estocástica, gráfica, Porto"
- Quando o Google DECIDIR mostrar o site, mostra com o título e descrição bonitos
- Ajudam nas redes sociais (quando alguém partilha o link)

### ❌ O que as tags NÃO fazem:
- Não garantem que o site aparece nos resultados
- Não criam "autoridade" (reputação)
- Não substituem conteúdo real na página

---

## O grande problema técnico: SPA (Single Page Application)

O site é feito em React. Quando o Google visita classicaag.pt, recebe isto:

```html
<div id="root"></div>
<script src="main.jsx"></script>
```

Ou seja, o Google vê uma página VAZIA e tem de executar JavaScript para ver o conteúdo.
O Googlebot moderno consegue, mas é mais lento e menos fiável.

Os textos dos produtos (que estão em products.js) podem NÃO ser indexados.
As empresas que aparecem bem (SerSilito, Lidergraf) têm sites com HTML puro — o Google
lê tudo instantaneamente.

---

## Plano prático — 3 coisas por ordem de impacto

### 1. 🟢 Google Business Profile (FAZER JÁ — 30 minutos — GRATUITO)
Ir a: https://business.google.com/
- Registar "Clássica Artes Gráficas"
- Morada completa
- Telefone
- Website: classicaag.pt
- Categoria: "Gráfica" ou "Impressão"
- Fotos de trabalhos, máquinas, instalações

ISTO é o que faz a diferença REAL para pesquisas locais tipo "gráfica Porto".
Sem isto, é quase impossível aparecer no Google Maps e nos resultados locais.

### 2. 🟡 Google Search Console (FAZER JÁ — 10 minutos — GRATUITO)
Ir a: https://search.google.com/search-console/
- Adicionar o site classicaag.pt
- Submeter o sitemap (https://www.classicaag.pt/sitemap.xml)
- Isto diz ao Google "indexa este site por favor"
- Sem isto, o Google pode demorar SEMANAS a descobrir o site

### 3. 🔴 Backlinks (médio/longo prazo)
- Pedir a clientes que metam um link para classicaag.pt no site deles
- Registar em diretórios (Páginas Amarelas, rafreg.com, etc.)
- Perfil no LinkedIn com link para o site
- Quanto mais sites "apontam" para o teu, mais o Google confia

---

## Expectativas realistas

| Tempo | O que esperar |
|---|---|
| Agora | Site não aparece em pesquisas |
| 1-2 semanas | Google indexa o site (com Search Console) |
| 1-3 meses | Começa a aparecer para pesquisas exatas ("Clássica Artes Gráficas") |
| 3-6 meses | Pode aparecer na 2ª/3ª página para "gráfica porto" |
| 6-12 meses | Com trabalho consistente, pode chegar ao top 10 |

---

## Resumo honesto

As tags que metemos são a BASE — sem elas nem vale a pena pensar em SEO.
Mas para aparecer no Google de verdade, o teu pai precisa de:

1. **Google Business Profile** ← MAIOR impacto, faz HOJE
2. **Google Search Console** ← Diz ao Google para indexar o site
3. **Tempo + backlinks** ← Não há atalho, leva meses

O site em si está BEM feito para o propósito (montra para clientes).
O SEO orgânico é uma maratona, não um sprint.
