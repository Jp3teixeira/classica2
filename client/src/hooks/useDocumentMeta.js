import { useEffect } from 'react';

const SITE = 'https://www.classicaag.pt';
const SITE_NAME = 'Clássica Artes Gráficas';

function setMeta(selector, attr, value) {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
}

/**
 * Atualiza título, descrição, canonical e Open Graph conforme a rota.
 *
 * Não usa biblioteca: o site tem uma árvore de rotas pequena e previsível, e
 * manipular quatro tags no <head> é mais simples de ler do que introduzir
 * react-helmet só para isto.
 *
 * @param {{title?: string, description?: string, path?: string, image?: string}} meta
 */
export function useDocumentMeta({ title, description, path, image, noindex = false } = {}) {
    useEffect(() => {
        // URLs inválidos respondem 200 por causa do rewrite de SPA; o noindex
        // evita que o Google os trate como páginas legítimas (soft 404).
        setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow');
        return () => setMeta('meta[name="robots"]', 'content', 'index, follow');
    }, [noindex]);

    useEffect(() => {
        const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Impressão de Qualidade no Porto`;
        const url = `${SITE}${path || '/'}`;
        const img = image ? `${SITE}${image}` : `${SITE}/og-image.jpg`;

        document.title = fullTitle;
        setMeta('link[rel="canonical"]', 'href', url);
        setMeta('meta[property="og:url"]', 'content', url);
        setMeta('meta[property="og:title"]', 'content', fullTitle);
        setMeta('meta[name="twitter:title"]', 'content', fullTitle);
        setMeta('meta[property="og:image"]', 'content', img);
        setMeta('meta[name="twitter:image"]', 'content', img);

        if (description) {
            setMeta('meta[name="description"]', 'content', description);
            setMeta('meta[property="og:description"]', 'content', description);
            setMeta('meta[name="twitter:description"]', 'content', description);
        }
    }, [title, description, path, image]);
}
