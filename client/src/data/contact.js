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
 */
export const CONTACT = {
    email: 'geral@classicaag.pt',
    phoneDisplay: '917 206 087',
    phoneHref: '+351917206087',
    locality: 'Porto, Portugal',
};

export default CONTACT;
