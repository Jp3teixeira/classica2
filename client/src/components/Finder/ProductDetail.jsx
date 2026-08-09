import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Gallery from './Gallery';
import Lightbox from './Lightbox';
import { getProductImages } from '../../data/navigation';

export default function ProductDetail({ product, onBack }) {
    const images = getProductImages(product);
    const [activeIdx, setActiveIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    const openZoom = useCallback(() => setZoomed(true), []);
    const closeZoom = useCallback(() => setZoomed(false), []);

    const hasSpecs = Array.isArray(product.characteristics) && product.characteristics.length > 0;

    return (
        <motion.div
            className="product-detail"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
        >
            <div className="detail-header">
                <button type="button" className="back-btn" onClick={onBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Voltar
                </button>
            </div>

            {images.length > 0 && (
                <Gallery
                    images={images}
                    productName={product.name}
                    activeIndex={activeIdx}
                    onChange={setActiveIdx}
                    onZoom={openZoom}
                />
            )}

            <motion.div
                className="detail-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <h2 className="product-title">{product.name}</h2>

                <section className="detail-section">
                    <div className="detail-section-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="detail-section-icon" aria-hidden="true">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <h3 className="detail-section-title">Descrição</h3>
                    </div>
                    <p className="product-description">{product.description}</p>
                </section>

                {hasSpecs && (
                    <section className="detail-section">
                        <div className="detail-section-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="detail-section-icon" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            <h3 className="detail-section-title">Especificações</h3>
                        </div>
                        {/* <dl> em vez de divs: é uma lista de pares nome/valor,
                            e assim um leitor de ecrã anuncia a relação. */}
                        <dl className="detail-specs">
                            {product.characteristics.map((char) => (
                                <div key={`${char.label}-${char.value}`} className="detail-spec">
                                    <dt className="spec-label">{char.label}</dt>
                                    <dd className="spec-value">{char.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </motion.div>

            <AnimatePresence>
                {zoomed && (
                    <Lightbox
                        images={images}
                        index={activeIdx}
                        productName={product.name}
                        onChange={setActiveIdx}
                        onClose={closeZoom}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
