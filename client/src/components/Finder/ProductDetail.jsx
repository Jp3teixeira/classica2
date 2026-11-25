import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import Gallery from './Gallery';
import Lightbox from './Lightbox';
import ProductGrid from './ProductGrid';
import { getProductImages, buildPath } from '../../data/navigation';
import { useContact } from '../../context/ContactContext';

const RELATED_COUNT = 4;

/**
 * Até 4 outros trabalhos da mesma categoria: primeiro os da mesma
 * subcategoria, depois os das restantes. Cada um leva a sua subcategoria real,
 * para que o cartão ligue ao URL canónico.
 */
function relatedProducts(product, category, subcategory) {
    const subs = category?.subcategories || [];
    const ordered = [
        ...subs.filter((sub) => sub.id === subcategory?.id),
        ...subs.filter((sub) => sub.id !== subcategory?.id),
    ];
    return ordered
        .flatMap((sub) => sub.products.map((p) => ({ ...p, realCategory: category, realSubcategory: sub })))
        .filter((p) => p.id !== product.id)
        .slice(0, RELATED_COUNT);
}

export default function ProductDetail({ product, onBack, category, subcategory }) {
    const images = getProductImages(product);
    const [activeIdx, setActiveIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const openContact = useContact();

    const openZoom = useCallback(() => setZoomed(true), []);
    const closeZoom = useCallback(() => setZoomed(false), []);

    // Anterior / seguinte dentro da mesma subcategoria (a ordem da grelha).
    const siblings = subcategory?.products || [];
    const position = siblings.findIndex((p) => p.id === product.id);
    const prev = position > 0 ? siblings[position - 1] : null;
    const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;
    const related = relatedProducts(product, category, subcategory);

    // Ao abrir outro produto (pelas setas ou pelos relacionados) a ficha nova
    // começa no topo, e não a meio da página onde estava o clique.
    useEffect(() => {
        const scroller = document.getElementById('finder-conteudo');
        if (scroller) scroller.scrollTop = 0;
    }, [product.id]);

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

                {(prev || next) && (
                    <nav className="detail-pager" aria-label="Outros trabalhos desta secção">
                        {prev ? (
                            <Link to={buildPath(category, subcategory, prev)} className="detail-pager-link" aria-label={`Anterior: ${prev.name}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                <span>Anterior</span>
                            </Link>
                        ) : <span className="detail-pager-link is-disabled" aria-hidden="true" />}
                        <span className="detail-pager-count">{position + 1} / {siblings.length}</span>
                        {next ? (
                            <Link to={buildPath(category, subcategory, next)} className="detail-pager-link" aria-label={`Seguinte: ${next.name}`}>
                                <span>Seguinte</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        ) : <span className="detail-pager-link is-disabled" aria-hidden="true" />}
                    </nav>
                )}
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: 0.04 }}
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

                    <button type="button" className="detail-cta" onClick={openContact}>
                        Saber mais
                    </button>
                </motion.div>
            </div>

            {related.length > 0 && (
                <section className="detail-related" aria-labelledby={`related-${product.id}`}>
                    <h3 className="detail-related-title" id={`related-${product.id}`}>
                        Outros trabalhos em {category?.name}
                    </h3>
                    <ProductGrid products={related} category={category} subcategory={subcategory} />
                </section>
            )}

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
