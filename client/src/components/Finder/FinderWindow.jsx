import { useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import SubcategoryNav from './SubcategoryNav';
import ProductGrid from './ProductGrid';
import ProductDetail from './ProductDetail';
import { EmptyState } from './FinderStates';

import { buildPath } from '../../data/navigation';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useIsCompact } from '../../hooks/useMediaQuery';

/**
 * Janela do Finder — diálogo modal com sidebar de subcategorias, grelha de
 * produtos e vista de detalhe.
 *
 * Sem estado próprio: categoria, subcategoria e produto vêm do URL. Isto
 * elimina a cascata de três efeitos encadeados que existia antes (e o flash de
 * produtos da categoria anterior ao trocar de categoria).
 *
 * Acessibilidade: é um `role="dialog"` `aria-modal` com foco preso, foco
 * inicial dentro da janela, devolução de foco ao fechar e Escape hierárquico
 * (do detalhe volta à grelha; da grelha fecha a janela).
 */
export default function FinderWindow({ category, subcategory, product, onClose }) {
    const navigate = useNavigate();
    const isCompact = useIsCompact();
    const titleId = useId();

    const products = subcategory?.products ?? [];

    // Escape sai um nível de cada vez, como qualquer navegação hierárquica.
    const handleEscape = useCallback(() => {
        if (product) navigate(buildPath(category, subcategory));
        else onClose();
    }, [product, category, subcategory, navigate, onClose]);

    const dialogRef = useFocusTrap(true, handleEscape);

    const backToGrid = useCallback(
        () => navigate(buildPath(category, subcategory)),
        [navigate, category, subcategory]
    );

    return (
        <motion.div
            className="finder-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="finder-window"
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <header className="finder-titlebar">
                    <div className="finder-traffic-lights">
                        <button
                            type="button"
                            className="traffic-light close"
                            onClick={onClose}
                            aria-label="Fechar janela"
                            data-autofocus
                        >
                            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                        <span className="traffic-light minimize" aria-hidden="true" />
                        <span className="traffic-light maximize" aria-hidden="true" />
                    </div>

                    <h1 className="finder-title" id={titleId}>
                        {category.name}
                        {subcategory && products.length > 0 && (
                            <span className="finder-title-count"> · {products.length} {products.length === 1 ? 'trabalho' : 'trabalhos'}</span>
                        )}
                    </h1>

                    <button
                        type="button"
                        className="finder-close-text"
                        onClick={onClose}
                        aria-label="Fechar janela"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </header>

                <div className="finder-content">
                    <SubcategoryNav
                        category={category}
                        subcategory={subcategory}
                        isCompact={isCompact}
                    />

                    <div className="finder-main">
                        <div className="finder-main-content" id="finder-conteudo" tabIndex={-1}>
                            <AnimatePresence mode="wait" initial={false}>
                                {product ? (
                                    <ProductDetail key={`detail-${product.id}`} product={product} onBack={backToGrid} />
                                ) : products.length > 0 ? (
                                    <ProductGrid
                                        key={`grid-${subcategory?.id}`}
                                        products={products}
                                        category={category}
                                        subcategory={subcategory}
                                    />
                                ) : (
                                    <EmptyState key="empty" subcategory={subcategory} />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
