import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = memo(function ProductDetail({ product, onBack }) {
    const imageList = product.images
        ? product.images
        : [{ src: product.image, label: null }];

    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <motion.div
            className="product-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Header — botão voltar + título */}
            <div className="detail-header">
                <button className="back-btn" onClick={onBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Voltar
                </button>
            </div>

            {/* Layout split — imagem + informação */}
            <div className="detail-layout">

                {/* Coluna esquerda: Imagem + Thumbnails */}
                <div className="detail-media">
                    <div className="product-image-container">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIdx}
                                src={imageList[activeIdx].src}
                                alt={imageList[activeIdx].label || product.name}
                                className="product-image"
                                loading="lazy"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.25 }}
                            />
                        </AnimatePresence>
                    </div>

                    {imageList.length > 1 && (
                        <div className="product-thumbnails">
                            {imageList.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`product-thumb ${activeIdx === idx ? 'active' : ''}`}
                                    onClick={() => setActiveIdx(idx)}
                                    aria-label={img.label || `Imagem ${idx + 1}`}
                                >
                                    <img src={img.src} alt={img.label || `Imagem ${idx + 1}`} loading="lazy" />
                                    {img.label && <span className="product-thumb-label">{img.label}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Coluna direita: Info */}
                <motion.div
                    className="detail-info"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                >
                    <h2 className="product-title">{product.name}</h2>

                    {/* Descrição — secção com ícone de documento */}
                    <div className="detail-section">
                        <div className="detail-section-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="detail-section-icon">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            <span className="detail-section-title">Descrição</span>
                        </div>
                        <p className="product-description">{product.description}</p>
                    </div>

                    {/* Características — secção com ícone de specs */}
                    {product.characteristics && product.characteristics.length > 0 && (
                        <div className="detail-section">
                            <div className="detail-section-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="detail-section-icon">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="9" y1="21" x2="9" y2="9" />
                                </svg>
                                <span className="detail-section-title">Especificações</span>
                            </div>
                            <div className="detail-specs">
                                {product.characteristics.map((char, i) => (
                                    <motion.div
                                        key={i}
                                        className="detail-spec"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.05 }}
                                    >
                                        <span className="spec-label">{char.label}</span>
                                        <span className="spec-value">{char.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
});

export default ProductDetail;
