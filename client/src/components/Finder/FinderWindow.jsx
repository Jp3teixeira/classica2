import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../data/products';

// ─── Ícone de pasta (sidebar) ─────────────────────────────────────────────────

const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

// ─── Janela principal Finder ──────────────────────────────────────────────────

const FinderWindow = memo(function FinderWindow({ category, onClose }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Reset ao mudar de categoria
    useEffect(() => {
        setSelectedSubcategory(null);
        setSelectedProduct(null);
    }, [category]);

    // Seleccionar primeira subcategoria automaticamente
    useEffect(() => {
        if (category?.subcategories?.length > 0 && !selectedSubcategory) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    }, [category, selectedSubcategory]);

    // Carregar produtos quando muda subcategoria
    useEffect(() => {
        if (selectedSubcategory) {
            setLoading(true);
            setTimeout(() => {
                setProducts(getProducts(category.id, selectedSubcategory.id));
                setLoading(false);
            }, 200);
        }
    }, [selectedSubcategory, category]);

    return (
        <motion.div className="finder-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
                className="finder-window"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                                {loading ? (
                                    <LoadingState key="loading" />
                                ) : selectedProduct ? (
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

// ─── Grelha de produtos ───────────────────────────────────────────────────────

const ProductGrid = memo(function ProductGrid({ products, onProductClick }) {
    return (
        <motion.div className="product-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {products.map((product, index) => {
                const thumbSrc = product.images ? product.images[0].src : product.image;
                return (
                    <motion.button
                        key={product.id} className="product-card"
                        onClick={() => onProductClick(product)}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.02 }}
                    >
                        <div className="product-card-image">
                            <img src={thumbSrc} alt={product.name} />
                        </div>
                        <span className="product-card-name">{product.name}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
});

// ─── Detalhe de produto (com galeria de imagens) ──────────────────────────────

const ProductDetail = memo(function ProductDetail({ product, onBack }) {
    const imageList = product.images
        ? product.images
        : [{ src: product.image, label: null }];

    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <motion.div className="product-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button className="back-btn" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Voltar
            </button>

            {/* Imagem principal */}
            <div className="product-image-container">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIdx}
                        src={imageList[activeIdx].src}
                        alt={imageList[activeIdx].label || product.name}
                        className="product-image"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    />
                </AnimatePresence>
            </div>

            {/* Miniaturas — só aparece se houver mais de 1 imagem */}
            {imageList.length > 1 && (
                <div className="product-thumbnails">
                    {imageList.map((img, idx) => (
                        <button
                            key={idx}
                            className={`product-thumb ${activeIdx === idx ? 'active' : ''}`}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={img.label || `Imagem ${idx + 1}`}
                        >
                            <img src={img.src} alt={img.label || `Imagem ${idx + 1}`} />
                            {img.label && <span className="product-thumb-label">{img.label}</span>}
                        </button>
                    ))}
                </div>
            )}

            <div className="product-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                {product.characteristics && (
                    <div className="product-characteristics">
                        {product.characteristics.map((char, index) => (
                            <div key={index} className="product-characteristic">
                                <span className="characteristic-label">{char.label}</span>
                                <span className="characteristic-value">{char.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
});

// ─── Estados auxiliares ───────────────────────────────────────────────────────

const LoadingState = memo(function LoadingState() {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="loading-spinner"></div>
            <p className="empty-state-text">A carregar...</p>
        </motion.div>
    );
});

const EmptyState = memo(function EmptyState({ subcategory }) {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p className="empty-state-text">
                {subcategory ? `Ainda não existem produtos em "${subcategory.name}".` : 'Selecione um tipo de produto.'}
            </p>
        </motion.div>
    );
});

export default FinderWindow;
