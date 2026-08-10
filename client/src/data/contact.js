/**
 * Contactos da empresa — fonte única de verdade.
 *
 * Antes o email estava escrito em três sítios diferentes (MenuBar.jsx,
 * dados estruturados do index.html e o fallback <noscript>), o que garantia
 * que uma alteração ficaria dessincronizada.
 *
 * Nota: o index.html tem de repetir estes valores nos dados estruturados e no
 * <noscript>, porque são lidos por motores de busca antes de o JavaScript
 * correr. Se alterar aqui, altere também em client/index.html.
 *
 * Se algum dia quiser publicar telefone ou morada, acrescente aqui e:
 *   1. adicione o card em components/Contact/ContactPanel.jsx
 *   2. adicione "telephone" / "streetAddress" aos dados estruturados do index.html
 *   3. o build vai falhar a indicar o novo hash da CSP para colar em vercel.json
 */
export const CONTACT = {
    email: 'geral@classicaag.pt',
};

export default CONTACT;
