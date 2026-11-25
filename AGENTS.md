# AGENTS.md — Clássica Artes Gráficas (classica2)

> Ler isto primeiro, antes de tocar em qualquer código. Para o contexto técnico
> completo do projeto (stack, estrutura de pastas, convenções, URLs, como
> adicionar produtos, etc.) ler **`client/CLAUDE.md`** — este ficheiro cobre só
> o que `CLAUDE.md` não cobre: o estado atual de uma tarefa em aberto.

## O que é este projeto (resumo rápido)

Site vitrina da **Clássica Artes Gráficas**, empresa portuguesa de artes
gráficas no Porto. React 19 + Vite 7, sem backend, deploy automático na
Vercel a cada push para `main`. Conceito visual: o utilizador "abre" janelas
estilo Finder do macOS para navegar por catálogos/categorias de produtos.
Framer Motion para toda a animação. CSP restrita — o site não carrega nada de
terceiros. Dono do projeto (quem pede o trabalho) não é programador; prefere
explicações simples e ciclos rápidos de "testa já no site live" (merge direto
para `main`, sem PRs à espera de review longo).

## Animação do Finder "lenta/clunky" — resolvido (nov. 2026)

A causa não era a duração/easing (já tinha sido encurtada duas vezes sem
efeito). Um trace de desempenho mostrou que o custo estava na composição:

- `backdrop-filter: blur(10px)` de ecrã inteiro em `.finder-overlay` era o
  maior custo por frame da abertura em desktop. Foi trocado por um véu de cor
  sólida (`finder.css`). **Não voltar a pôr blur num elemento de ecrã inteiro
  que anima.**
- `mix-blend-mode: multiply` nas fotos dos cartões e da galeria também pesava;
  foi removido e o poço da foto passou a ter fundo branco (`product.css`).
- Em mobile a lentidão sentida vinha das fotos a chegar depois de a janela
  abrir. `src/utils/prefetch.js` pré-carrega as fotos ao passar o rato/tocar
  num link e, em segundo plano, as primeiras 4 de cada categoria. O
  `SmartImage` ganhou a prop `fadeIn`.
- Em ecrã compacto a janela já não faz "zoom" (sobe e aparece) e só mostra o
  botão de fechar, sem os três semáforos.

Medição (Chromium headless, abertura de "Livros" em 1440x900): custo de
composição por frame de ~69 ms para ~28 ms. Em mobile com 4G simulado, as
fotos visíveis passam de ~730 ms para ~250 ms depois do toque (se o
visitante já esteve uns segundos na home).

Também nesta ronda: ficha de produto com anterior/seguinte e "Outros
trabalhos em <categoria>"; mobile com menos espaço antes dos produtos.

Pedidos pendentes do dono (ainda por fazer, ele excluiu-os desta ronda):
clicar numa categoria abre só a 1ª subcategoria (ex.: Embalagens mostra 5 de
8); a home não diz o que a empresa faz, tem ~2,4 s de animação e o HTML chega
vazio (sem pré-renderização).

## Outras tarefas em pausa (não urgentes, só para contexto)

- **Fotos de produtos (categoria Embalagens)**: o dono do site pediu para
  melhorar visualmente as fotos de embalagens, que "parecem tiradas à mão".
  Foi validado um pipeline (balanço de brancos + auto-levels + unsharp mask +
  recorte manual por imagem) numa foto de teste
  (`Cartolina_SUNBOOSTER_2.jpg`), com resultado aprovado informalmente, mas
  **ainda faltam as outras 9 fotos da pasta `Embalagens`** — ficou em pausa
  quando o utilizador mudou de assunto para a animação do Finder. Regra
  importante dada pelo utilizador: qualquer edição tem de **melhorar**
  visualmente sem perder qualidade — ser rigoroso.
- **Formulário de contacto direto**: o botão "Saber mais" na ficha do
  produto hoje só abre o painel de contacto com o email da empresa. O dono do
  site concordou, no futuro, em ter um formulário que envie email
  diretamente do site (em vez de `mailto:`), mas isso está bloqueado até ele
  criar uma conta num provedor de email transacional (recomendado: Resend) e
  fornecer a chave de API pelo fluxo de credenciais seguro — nunca colada no
  chat.
