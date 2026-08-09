import { useCallback, useSyncExternalStore } from 'react';

const supported = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Subscreve uma media query.
 *
 * Usa `useSyncExternalStore` — a API do React para ler de uma fonte externa —
 * em vez de `useState` + `useEffect`. Assim o valor está correto já no primeiro
 * render (sem um frame com o valor errado) e reavalia em resize e em mudança de
 * orientação, ao contrário da deteção única de `ontouchstart` que existia antes.
 *
 * Faz a MESMA pergunta que o CSS, para que JavaScript e CSS nunca discordem
 * sobre o que é "mobile".
 */
export function useMediaQuery(query) {
    const subscribe = useCallback(
        (onChange) => {
            if (!supported) return () => {};
            const mql = window.matchMedia(query);
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        },
        [query]
    );

    const getSnapshot = useCallback(
        () => (supported ? window.matchMedia(query).matches : false),
        [query]
    );

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Breakpoints — têm de coincidir com os de styles/responsive.css. */
export const MQ = {
    /** Telefone e tablet pequeno: navegação e Finder em modo touch. */
    compact: '(max-width: 900px)',
    /** Telefone pequeno. */
    phone: '(max-width: 480px)',
    /** Telefone em paisagem: pouca altura disponível. */
    shortLandscape: '(max-height: 500px) and (orientation: landscape)',
    /** Existe um ponteiro preciso (rato/trackpad) → hover é fiável. */
    hover: '(hover: hover) and (pointer: fine)',
    /** O utilizador pediu menos movimento ao sistema operativo. */
    reducedMotion: '(prefers-reduced-motion: reduce)',
};

/** Atalho: true quando o dispositivo tem hover fiável (desktop). */
export function useHasHover() {
    return useMediaQuery(MQ.hover);
}

/** Atalho: true em ecrãs compactos (≤900px), onde a interação é por toque. */
export function useIsCompact() {
    return useMediaQuery(MQ.compact);
}
