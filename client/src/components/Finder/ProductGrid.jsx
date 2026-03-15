import { memo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({ children, className, onClick, style, ...motionProps }) {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;  // tilt max 8°
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    }, []);

    return (
        <motion.button
            ref={cardRef}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ ...style, transition: 'transform 0.15s ease-out, box-shadow 0.2s ease' }}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

const ProductGrid = memo(function ProductGrid({ products, onProductClick }) {
    return (
        <motion.div className="product-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {products.map((product, index) => {
                const thumbSrc = product.images ? product.images[0].src : product.image;
                return (
                    <TiltCard
                        key={product.id}
                        className="product-card"
                        onClick={() => onProductClick(product)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="product-card-image">
                            <img src={thumbSrc} alt={product.name} loading="lazy" />
                        </div>
                        <span className="product-card-name">{product.name}</span>
                    </TiltCard>
                );
            })}
        </motion.div>
    );
});

export default ProductGrid;
