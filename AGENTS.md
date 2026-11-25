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

## TAREFA EM ABERTO — animação de abertura da janela do Finder continua lenta/"clunky"

### O que o utilizador reportou

> "a navegação a abrir o Finder está mesmo má, está lenta e a animação está
> muito fraquinha mesmo parece de um site feito em 2000"

Depois de uma primeira ronda de correções (ver abaixo), o utilizador testou
no site live e reportou: **"continua super lento e super clunky"**. Pediu
expressamente para não se continuar a mexer no código numa sessão que já
tinha tentado isto duas vezes sem sucesso — e sim escrever este documento
para o próximo agente recomeçar com contexto, numa conversa nova.

### O que já foi tentado (e NÃO resolveu)

Uma sessão anterior assumiu que o problema era puramente de **timing/easing**
das animações do Framer Motion e fez duas rondas de ajustes:

1. Em `client/src/components/Finder/FinderWindow.jsx`: trocou a transição da
   janela de uma spring (`type: 'spring', stiffness: 300, damping: 30`) para
   uma easing fixa (`duration: 0.24, ease: [0.2, 0.8, 0.2, 1]`), a mesma curva
   `cubic-bezier` usada no protótipo original aprovado pelo Claude Design.
   Encurtou também o fade do overlay (`duration: 0.18`).
2. Em `client/src/components/Finder/ProductGrid.jsx`: reduziu o atraso em
   cascata por cartão de produto de `0.045s` para `0.02s` e encurtou a
   duração de entrada de cada cartão (`0.3s` → `0.2s`).
3. Em `client/src/components/Finder/ProductDetail.jsx`: encurtou a entrada da
   ficha técnica do produto (`duration: 0.3, delay: 0.1` → `duration: 0.18,
   delay: 0.04`).

Lint, suite de testes (34 testes) e build passaram todos. Verificação visual
com Playwright (screenshot + polling do estilo computado) mostrou a janela a
assentar visualmente em ~600ms incluindo overhead de medição. **Mesmo assim,
o utilizador continua a sentir a animação como lenta e "clunky" no site
live**, o que é um sinal forte de que **o problema não é a duração/easing em
si** — já foram encurtadas duas vezes e a perceção não mudou. Isto aponta
para **jank real (frames a serem saltados)** em vez de "a animação dura
demasiado tempo".

### Hipótese mais provável, ainda não investigada: `backdrop-filter` animado

Em `client/src/styles/finder.css`, `.finder-overlay` (o elemento que o
Framer Motion anima em opacidade de 0→1 ao abrir a janela) tem:

```css
.finder-overlay {
  position: fixed;
  inset: 0;
  background: rgba(232, 232, 229, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

Ou seja: **todo o ecrã** tem um `backdrop-filter: blur(10px)` ativo durante a
animação de entrada do overlay, e é a opacidade DESSE elemento (que já tem o
blur aplicado, não um blur que vai de 0 a 10px) que está a ser animada. Isto é
uma receita clássica para jank:

- `backdrop-filter` obriga o browser a reamostrar tudo o que está por trás do
  elemento, em cada frame, enquanto a camada é recomposta — é uma das
  propriedades CSS mais caras de animar/compositar que existe.
- Animar a opacidade de uma camada com `backdrop-filter` (em vez de, por
  exemplo, um `background-color` sólido) impede frequentemente a otimização
  habitual de "opacidade é barata porque só muda o compositor" — o browser
  pode ter de repintar o blur em cada frame em vez de só re-compor uma
  textura já pronta.
- O elemento cobre o ecrã inteiro (`inset: 0`), por isso o custo por frame é
  proporcional à área do ecrã do utilizador — pode ser impercetível num
  portátil potente a testar localmente e claramente "clunky" no telemóvel ou
  computador real do dono do site (ele testa muito no telemóvel — ver
  `client/CLAUDE.md`, secção "Notas importantes": **mobile é prioritário**).

Isto explicaria perfeitamente porque é que mexer só em `duration`/`ease` não
mudou nada: se os frames estão a ser saltados (jank), a perceção de
lentidão não depende de quão longa é a transição declarada, depende de
quantos frames reais o browser consegue desenhar durante esse intervalo.

Em `client/src/styles/responsive.css` (linha ~122, dentro do breakpoint
`≤900px`) o overlay em modo compacto já desativa o `backdrop-filter`
(`backdrop-filter: none`) — o que sugere que alguém já suspeitou do mesmo
problema em mobile, mas a versão desktop continua a animá-lo.

### O que o próximo agente deve fazer

1. **Não voltar a mexer só em números de duração/delay/easing** — já foi
   tentado duas vezes sem efeito percebido.
2. **Perfilar antes de alterar**: gravar a animação de abertura com o
   DevTools Performance do Chrome (ou Playwright com tracing/CDP) e confirmar
   se há quebra de frames (FPS real abaixo de ~50-60) durante a abertura,
   idealmente num dispositivo/perfil mais fraco (Chrome DevTools tem
   "CPU throttling"). Isto confirma ou descarta a hipótese do
   `backdrop-filter` antes de tocar em código.
3. Se confirmado, experimentar isoladamente (uma alteração de cada vez, a
   medir o efeito):
   - Remover temporariamente o `backdrop-filter` do `.finder-overlay` e
     verificar se a abertura fica visivelmente mais fluida — isto
     confirma/nega a hipótese sem ainda decidir a solução final.
   - Se confirmado: considerar não animar a opacidade do próprio elemento com
     blur (por exemplo, aplicar o `backdrop-filter` só depois da transição de
     entrada terminar, ou separar o "véu" semitransparente do `backdrop-filter`
     em duas camadas, animando só a cor sólida e deixando o blur
     permanentemente ativo e não animado), reduzir o raio do blur, ou
     promover o elemento a uma layer composta própria (`will-change: opacity`,
     `transform: translateZ(0)`, etc.) para ver se ajuda.
   - Verificar também se `.finder-window` (que anima `scale`+`y` em conjunto
     com `box-shadow`, `border-radius` e `overflow: hidden`) está a forçar
     repaints por sobrepor um elemento com sombra grande a um fundo
     desfocado — pode valer a pena testar com `box-shadow` fixo (sem variar)
     durante a transição.
4. Só depois de resolver o jank real é que faz sentido voltar a afinar
   duração/easing para o "acabamento" — mas a causa provável do "lento e
   clunky" é esta, não a escolha de easing.
5. Seguir o fluxo de trabalho habitual deste projeto: branch
   `claude/amazing-albattani-s3g26q` (ou recomeçá-la a partir de `origin/main`
   se já tiver sido merged entretanto), `npm run lint && npm test && npm run
   build` antes de qualquer push, e merge direto para `main` assim que
   validado — o dono do site prefere testar mudanças ao vivo rapidamente em
   vez de esperar por reviews longas.
6. Depois de resolver, pedir ao utilizador para testar no telemóvel dele
   também, não só em desktop — é onde ele mais usa o site com clientes.

### Ficheiros relevantes para esta tarefa

- `client/src/styles/finder.css` — `.finder-overlay` (linha ~5, tem o
  `backdrop-filter: blur(10px)` suspeito) e `.finder-window` (linha ~22)
- `client/src/styles/responsive.css` — `.finder-overlay` em modo compacto
  (linha ~122), já desativa o `backdrop-filter`
- `client/src/components/Finder/FinderWindow.jsx` — as duas `motion.div`
  (overlay + janela) com as transições já ajustadas duas vezes
- `client/src/components/Finder/ProductGrid.jsx` — `TiltCard`, entrada em
  cascata dos cartões
- `client/src/components/Finder/ProductDetail.jsx` — entrada da ficha
  técnica do produto

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
