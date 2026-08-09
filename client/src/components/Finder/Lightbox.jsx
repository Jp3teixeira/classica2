import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

import { largestSrc, aspectOf } from '../../utils/images';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const ZOOM_STEP = 1.8;
const MAX_ZOOM = 3.5;

/**
 * Visualizador de imagem em ecrã inteiro com ampliação.
 *
 * Responde à necessidade comercial mais concreta do site: numa reunião, quando
 * o cliente pergunta se a impressão fica assim tão nítida, era impossível
 * mostrar a fotografia acima de 650 px — apesar de existirem ficheiros de vários
 * milhares de píxeis no servidor.
 *
 * Interação:
 *  - clique/toque na imagem alterna entre ajustada e ampliada
 *  - arrastar move a imagem quando ampliada (rato e dedo)
 *  - roda do rato amplia/reduz
 *  - botões +/− e Escape para teclado; ← → mudam de imagem
 */
export default function Lightbox({ images, index, productName, onClose, onChange }) {
    const [zoom, setZoom] = useState(1);
    const total = images.length;
    const image = images[index];

    const containerRef = useFocusTrap(true, onClose);

    const clamp = (value) => Math.min(MAX_ZOOM, Math.max(1, value));
    const toggleZoom = useCallback(() => setZoom((z) => (z > 1 ? 1 : ZOOM_STEP)), []);
    const zoomIn = useCallback(() => setZoom((z) => clamp(z * 1.5)), []);
    const zoomOut = useCallback(() => setZoom((z) => clamp(z / 1.5)), []);

    // Trocar de imagem reinicia a ampliação. Feito no handler (e não num efeito)
    // porque o índice só muda por ação do utilizador — não há estado a sincronizar.
    const goTo = useCallback((next) => {
        setZoom(1);
        onChange(next);
    }, [onChange]);

    const onKeyDown = useCallback((event) => {
        if (event.key === 'ArrowRight' && total > 1) { event.preventDefault(); goTo((index + 1) % total); }
        else if (event.key === 'ArrowLeft' && total > 1) { event.preventDefault(); goTo((index - 1 + total) % total); }
        else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomIn(); }
        else if (event.key === '-') { event.preventDefault(); zoomOut(); }
    }, [index, total, goTo, zoomIn, zoomOut]);

    const onWheel = useCallback((event) => {
        event.preventDefault();
        setZoom((z) => clamp(z * (event.deltaY < 0 ? 1.12 : 0.89)));
    }, []);

    if (!image) return null;

    const label = image.label ? `${productName} — ${image.label}` : productName;
    const ratio = aspectOf(image.src);

    return (
        <motion.div
            className="lightbox"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ampliada: ${label}`}
            onKeyDown={onKeyDown}
            onWheel={onWheel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            <div className="lightbox-bar">
                <p className="lightbox-title">
                    {label}
                    {total > 1 && <span className="lightbox-count"> · {index + 1}/{total}</span>}
                </p>
                <div className="lightbox-actions">
                    <button type="button" onClick={zoomOut} aria-label="Reduzir" disabled={zoom <= 1}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="lightbox-zoom-value" aria-live="polite">{Math.round(zoom * 100)}%</span>
                    <button type="button" onClick={zoomIn} aria-label="Ampliar" disabled={zoom >= MAX_ZOOM}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                    <button type="button" onClick={onClose} aria-label="Fechar imagem ampliada" data-autofocus className="lightbox-close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                </div>
            </div>

            <div className="lightbox-stage" onClick={onClose}>
                <motion.img
                    key={image.src}
                    src={largestSrc(image.src)}
                    alt={label}
                    className="lightbox-image"
                    style={{ aspectRatio: ratio ? String(ratio) : undefined }}
                    drag={zoom > 1}
                    dragElastic={0.05}
                    dragMomentum={false}
                    animate={{ scale: zoom }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    onClick={(event) => { event.stopPropagation(); toggleZoom(); }}
                    draggable={false}
                />
            </div>

            {total > 1 && (
                <div className="lightbox-nav">
                    <button type="button" onClick={() => goTo((index - 1 + total) % total)} aria-label="Imagem anterior">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button type="button" onClick={() => goTo((index + 1) % total)} aria-label="Imagem seguinte">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                    </button>
                </div>
            )}
        </motion.div>
    );
}
