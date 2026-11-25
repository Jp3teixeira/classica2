import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Gallery from './Gallery';
import Lightbox from './Lightbox';
import { getProductImages } from '../../data/navigation';
import { CONTACT } from '../../data/contact';

export default function ProductDetail({ product, onBack, category, subcategory }) {
    const images = getProductImages(product);
    const [activeIdx, setActiveIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    const openZoom = useCallback(() => setZoomed(true), []);
    const closeZoom = useCallback(() => setZoomed(false), []);

    const hasSpecs = Array.isArray(product.characteristics) && product.characteristics.length > 0;
    const eyebrow = subcategory && subcategory.name !== category?.name
        ? `${category?.name} · ${subcategory.name}`
        : category?.name;

    return (
        <motion.div
            className="product-detail"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.14 }}
        >
            <div className="detail-header">
                <button type="button" className="back-btn" onClick={onBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Voltar
                </button>
            </div>

            <div className="detail-layout">
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
                    {eyebrow && <p className="detail-eyebrow">{eyebrow}</p>}
                    <h2 className="product-title">{product.name}</h2>

                    <p className="product-description">{product.description}</p>

                    {hasSpecs && (
                        <>
                            <h3 className="detail-specs-title">Ficha técnica</h3>
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
                        </>
                    )}

                    <a
                        className="quote-cta"
                        href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Pedido de orçamento: ${product.name}`)}`}
                    >
                        Pedir orçamento semelhante
                    </a>
                </motion.div>
            </div>

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
