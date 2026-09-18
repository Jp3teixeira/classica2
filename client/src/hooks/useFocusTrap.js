import { useEffect, useRef } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableWithin(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => {
        if (el.hasAttribute('aria-hidden')) return false;
        // elementos escondidos não recebem foco
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });
}

/**
 * Gestão de foco para janelas e painéis sobrepostos.
 *
 * Em ambos os modos:
 *  1. move o foco para dentro ao abrir;
 *  2. devolve o foco ao elemento que abriu, ao fechar;
 *  3. fecha com Escape.
 *
 * `modal: true` (predefinição) acrescenta o isolamento de um diálogo modal:
 * prende o Tab lá dentro e marca o resto da página como `inert`. É o correto
 * para o lightbox e para o painel de contactos, que de facto bloqueiam tudo.
 *
 * `modal: false` para a janela do Finder. A janela é sobreposta mas **não**
 * bloqueia o site: a MenuBar e a barra de navegação continuam clicáveis, para
 * se poder saltar direto de uma categoria para outra sem fechar nada — tal
 * como uma janela do Finder no macOS, onde a barra de menus nunca fica presa.
 * Marcá-la como `aria-modal` e torná-la `inert` seria, além de inconveniente,
 * mentira para quem usa leitor de ecrã.
 *
 * @param {boolean} active      painel aberto
 * @param {() => void} onEscape chamado ao premir Escape
 * @param {{ modal?: boolean }} [options]
 */
export function useFocusTrap(active, onEscape, { modal = true } = {}) {
    const containerRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Guarda quem tinha o foco e devolve-o no fecho.
    useEffect(() => {
        if (!active) return;
        previousFocusRef.current = document.activeElement;

        return () => {
            const previous = previousFocusRef.current;
            if (previous && typeof previous.focus === 'function' && document.contains(previous)) {
                previous.focus({ preventScroll: true });
            }
        };
    }, [active]);

    // Foco inicial dentro do painel.
    useEffect(() => {
        if (!active) return;
        const container = containerRef.current;
        if (!container) return;

        const id = requestAnimationFrame(() => {
            const target =
                container.querySelector('[data-autofocus]') || focusableWithin(container)[0] || container;
            target.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(id);
    }, [active]);

    // Isola o resto da página — só em modo modal.
    //
    // Sobe do contentor até <body> e marca os IRMÃOS de cada nível como `inert`
    // — nunca os ancestrais, que têm de continuar ativos.
    useEffect(() => {
        if (!active || !modal) return;
        const container = containerRef.current;
        if (!container) return;

        const marked = [];
        let node = container;
        while (node && node.parentElement && node !== document.body) {
            for (const sibling of node.parentElement.children) {
                if (sibling !== node && !sibling.hasAttribute('inert')) {
                    sibling.setAttribute('inert', '');
                    marked.push(sibling);
                }
            }
            node = node.parentElement;
        }

        return () => marked.forEach((el) => el.removeAttribute('inert'));
    }, [active, modal]);

    // Escape sempre; Tab preso só em modo modal.
    useEffect(() => {
        if (!active) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onEscape?.();
                return;
            }
            if (!modal || event.key !== 'Tab') return;

            const container = containerRef.current;
            const items = focusableWithin(container);
            if (items.length === 0) {
                event.preventDefault();
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const activeEl = document.activeElement;

            if (!container.contains(activeEl)) {
                event.preventDefault();
                first.focus();
                return;
            }
            if (event.shiftKey && activeEl === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && activeEl === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [active, modal, onEscape]);

    return containerRef;
}
