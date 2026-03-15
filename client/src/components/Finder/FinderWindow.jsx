import { useState, useEffect, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { getProducts } from '../../data/products';

// Componentes extraídos (Single Responsibility Principle)
import ProductGrid from './ProductGrid';
import ProductDetail from './ProductDetail';
import { FolderIcon, LoadingState, EmptyState } from './FinderStates';

// ─── Janela principal Finder ──────────────────────────────────────────────────

const FinderWindow = memo(function FinderWindow({ category, onClose }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Reset ao mudar de categoria
    useEffect(() => {
        setSelectedSubcategory(null);
        setSelectedProduct(null);
    }, [category]);

    // Selecionar primeira subcategoria automaticamente
    useEffect(() => {
        if (category?.subcategories?.length > 0 && !selectedSubcategory) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    }, [category, selectedSubcategory]);

    // Carregar produtos quando muda subcategoria (sem setTimeout artificial)
    useEffect(() => {
        if (selectedSubcategory) {
            setProducts(getProducts(category.id, selectedSubcategory.id));
        }
    }, [selectedSubcategory, category]);

    return (
        <motion.div className="finder-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
                className="finder-window"
                onClick={(e) => e.stopPropagation()}
                style={{ transformOrigin: 'bottom center' }}
                initial={{ opacity: 0, scale: 0.1, y: 400, borderRadius: '50px' }}
                animate={{ opacity: 1, scale: 1, y: 0, borderRadius: '12px' }}
                exit={{ opacity: 0, scale: 0.1, y: 400, borderRadius: '50px' }}
                transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
            >
                <header className="finder-titlebar">
                    <div className="finder-traffic-lights">
                        <button className="traffic-light close" onClick={onClose} aria-label="Fechar janela">
                            <svg viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <button className="traffic-light minimize" disabled>
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <button className="traffic-light maximize" disabled>
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                    <h1 className="finder-title">{category.name}</h1>
                    <div className="finder-toolbar"></div>
                </header>

                <div className="finder-content">
                    <aside className="finder-sidebar">
                        <div className="finder-sidebar-section">
                            <h2 className="finder-sidebar-title">Tipos de {category.name}</h2>
                            {category.subcategories?.map((sub) => (
                                <button
                                    key={sub.id}
                                    className={`finder-sidebar-item ${selectedSubcategory?.id === sub.id ? 'active' : ''}`}
                                    onClick={() => { setSelectedSubcategory(sub); setSelectedProduct(null); }}
                                >
                                    <FolderIcon />
                                    <span>{sub.name}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="finder-main">
                        <div className="finder-main-content">
                            <AnimatePresence mode="wait">
                                {selectedProduct ? (
                                    <ProductDetail key="detail" product={selectedProduct} onBack={() => setSelectedProduct(null)} />
                                ) : products.length > 0 ? (
                                    <ProductGrid key="grid" products={products} onProductClick={setSelectedProduct} />
                                ) : (
                                    <EmptyState key="empty" subcategory={selectedSubcategory} />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

export default FinderWindow;
