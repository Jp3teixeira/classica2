# Como adicionar o registo TXT no amen.pt (Google Search Console)

## Passo a passo:

### 1. No painel da amen.pt onde estás agora
- No lado direito, onde diz "DOMÍNIOS E PRODUTOS", clica em **classicaag.pt**

### 2. Procura a secção de DNS
- Depois de clicar no domínio, procura algo como:
  - "Gestão DNS" ou "Zona DNS" ou "DNS Zone"
  - Pode estar num menu lateral ou numa tab

### 3. Adicionar um registo TXT
- Clica em "Adicionar registo" ou "Add record"
- Preenche assim:
  - **Tipo:** TXT
  - **Nome / Host:** @ (ou deixa vazio, depende da interface)
  - **Valor / Value:** google-site-verification=i8RRcC2J7qk5jwHBhe4gpmnSoXiH0KpaZg3NKXpr8Cw
  - **TTL:** 3600 (ou o valor padrão)
- Clica em "Guardar" ou "Save"

### 4. Voltar ao Google Search Console
- Clica em "Validar"
- Se disser erro, espera 5-10 minutos e tenta de novo
- Pode demorar até 24h (mas normalmente 5-30 min)

## ⚠️ Alternativa mais fácil (se não encontrares a zona DNS)
No Google Search Console, em vez de "Domínio", escolhe **"Prefixo do URL"**
e mete: https://www.classicaag.pt/

Nesse método, ele dá-te um ficheiro HTML para pôr no site em vez de mexer no DNS.
Isso é muito mais simples — basta pôr o ficheiro na pasta public/ do projeto.
