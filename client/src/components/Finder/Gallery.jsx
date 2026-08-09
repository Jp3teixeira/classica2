import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SmartImage from '../SmartImage';

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 350;

/**
 * Galeria de imagens de um produto.
 *
 * Interação:
 *  - toque:   arrastar para o lado muda de imagem; toque na imagem amplia
 *  - rato:    setas laterais + miniaturas; clique amplia
 *  - teclado: ← → mudam de imagem, Enter/Espaço ampliam (é um botão)
 *
 * As miniaturas são um `tablist` real, para que a imagem selecionada seja
 * comunicada e não apenas sugerida por uma borda mais escura.
 */
export default function Gallery({ images, productName, activeIndex, onChange, onZoom }) {
    const total = images.length;
    const active = images[activeIndex] || images[0];

    // Direção da transição: estado (não ref) porque é lida durante o render.
    const [direction, setDirection] = useState(0);

    const go = useCallback((next) => {
        if (total < 2) return;
        const target = (next + total) % total;
        setDirection(target > activeIndex || (activeIndex === total - 1 && target === 0) ? 1 : -1);
        onChange(target);
    }, [total, activeIndex, onChange]);

    const onKeyDown = useCallback((event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); go(activeIndex + 1); }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); go(activeIndex - 1); }
    }, [go, activeIndex]);

    const handleDragEnd = useCallback((_event, info) => {
        const { offset, velocity } = info;
        if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(activeIndex + 1);
        else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(activeIndex - 1);
    }, [go, activeIndex]);

    if (!active) return null;

    const label = active.label ? `${productName} — ${active.label}` : productName;

    return (
        <div className="gallery" onKeyDown={onKeyDown}>
            <div className="gallery-stage">
                {total > 1 && (
                    <button
                        type="button"
                        className="gallery-arrow prev"
                        onClick={() => go(activeIndex - 1)}
                        aria-label="Imagem anterior"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                )}

                <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                        type="button"
                        key={activeIndex}
                        className="gallery-image-btn"
                        onClick={onZoom}
                        aria-label={`Ampliar imagem: ${label}`}
                        drag={total > 1 ? 'x' : false}
                        dragElastic={0.12}
                        dragMomentum={false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        initial={{ opacity: 0, x: direction * 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -24 }}
                        transition={{ duration: 0.22 }}
                    >
                        <SmartImage
                            src={active.src}
                            alt={label}
                            className="gallery-image"
                            sizes="(max-width: 900px) 92vw, 640px"
                            loading="eager"
                            fetchPriority="high"
                            draggable={false}
                        />
                        <span className="gallery-zoom-hint" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <circle cx="11" cy="11" r="7" />
                                <path d="M11 8v6M8 11h6M20 20l-4.5-4.5" />
                            </svg>
                            Ampliar
                        </span>
                    </motion.button>
                </AnimatePresence>

                {total > 1 && (
                    <button
                        type="button"
                        className="gallery-arrow next"
                        onClick={() => go(activeIndex + 1)}
                        aria-label="Imagem seguinte"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>
                )}
            </div>

            {total > 1 && (
                <>
                    <p className="gallery-counter" aria-live="polite">
                        Imagem {activeIndex + 1} de {total}
                        {active.label ? ` — ${active.label}` : ''}
                    </p>

                    <div className="gallery-thumbs" role="tablist" aria-label={`Imagens de ${productName}`}>
                        {images.map((img, index) => (
                            <button
                                type="button"
                                key={img.src}
                                role="tab"
                                aria-selected={index === activeIndex}
                                aria-label={img.label || `Imagem ${index + 1}`}
                                className={`gallery-thumb ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => onChange(index)}
                                tabIndex={index === activeIndex ? 0 : -1}
                            >
                                <SmartImage
                                    src={img.src}
                                    alt=""
                                    sizes="80px"
                                    draggable={false}
                                />
                                {img.label && <span className="gallery-thumb-label">{img.label}</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
