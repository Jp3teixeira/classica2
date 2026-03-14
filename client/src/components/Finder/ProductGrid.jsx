import { memo } from 'react';
import { motion } from 'framer-motion';

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
                            <img src={thumbSrc} alt={product.name} loading="lazy" />
                        </div>
                        <span className="product-card-name">{product.name}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
});

export default ProductGrid;
