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
 * Torna um contentor um diálogo modal utilizável por teclado:
 *
 *  1. move o foco para dentro ao abrir;
 *  2. mantém o foco preso enquanto está aberto (Tab / Shift+Tab circulam);
 *  3. devolve o foco ao elemento que abriu o diálogo ao fechar;
 *  4. marca o conteúdo de fundo como `inert`, para que leitores de ecrã e
 *     o Tab não o alcancem.
 *
 * @param {boolean} active   diálogo aberto
 * @param {() => void} onEscape  chamado ao premir Escape
 */
export function useFocusTrap(active, onEscape) {
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

    // Foco inicial dentro do diálogo.
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

    // Isola tudo o que não é o diálogo.
    //
    // Sobe do contentor até <body> e marca os IRMÃOS de cada nível como `inert`
    // — nunca os ancestrais, que têm de continuar ativos. Assim o resto da
    // página fica fora do alcance do Tab, do rato e do cursor virtual de um
    // leitor de ecrã, independentemente da profundidade a que o diálogo esteja.
    useEffect(() => {
        if (!active) return;
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
    }, [active]);

    // Tab preso + Escape.
    useEffect(() => {
        if (!active) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onEscape?.();
                return;
            }
            if (event.key !== 'Tab') return;

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
    }, [active, onEscape]);

    return containerRef;
}
