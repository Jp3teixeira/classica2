import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
                        loading="lazy"
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
                            <img src={img.src} alt={img.label || `Imagem ${idx + 1}`} loading="lazy" />
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

export default ProductDetail;
