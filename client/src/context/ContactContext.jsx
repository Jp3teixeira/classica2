import { createContext, useContext } from 'react';

/**
 * Abre o painel de contactos a partir de qualquer ponto da árvore — hoje só a
 * MenuBar/TabBar, mas também o botão "Saber mais" da ficha técnica do
 * produto, que vive várias camadas abaixo do <Shell> (atrás das rotas).
 *
 * Só expõe `open`: quem consome isto nunca precisa de saber se o painel já
 * está aberto, só de o conseguir abrir.
 */
const ContactContext = createContext(() => {});

export function useContact() {
    return useContext(ContactContext);
}

export default ContactContext;
