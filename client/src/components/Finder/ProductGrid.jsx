import { memo, useRef, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

import SmartImage from '../SmartImage';
import { buildPath, getProductImages } from '../../data/navigation';
import { useHasHover } from '../../hooks/useMediaQuery';

const MAX_TILT = 8; // graus

/**
 * Card com tilt 3D.
 *
 * O tilt é feito com MotionValues em vez de escrever `element.style.transform`
 * diretamente: deixa de competir com o Framer Motion pela mesma propriedade
 * (a animação de entrada anima `y`, o tilt anima `rotateX/rotateY/scale` — o
 * Framer compõe as duas num único transform) e o retângulo do card é medido
 * uma vez por entrada do ponteiro, em vez de a cada evento de movimento.
 *
 * Só é ativado em dispositivos com ponteiro preciso. Em toque usa-se `whileTap`,
 * que dá feedback imediato ao dedo.
 */
function TiltCard({ children, to, index, ariaLabel }) {
    const hasHover = useHasHover();
    const rectRef = useRef(null);
    const nodeRef = useRef(null);

    const rotateX = useSpring(0, { stiffness: 320, damping: 26 });
    const rotateY = useSpring(0, { stiffness: 320, damping: 26 });
    const lift = useSpring(0, { stiffness: 320, damping: 26 });
    const scale = useTransform(lift, [0, 1], [1, 1.03]);

    const handleEnter = useCallback(() => {
        if (!hasHover || !nodeRef.current) return;
        rectRef.current = nodeRef.current.getBoundingClientRect();
        lift.set(1);
    }, [hasHover, lift]);

    const handleMove = useCallback((event) => {
        if (!hasHover) return;
        const rect = rectRef.current;
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * MAX_TILT * 2);
        rotateX.set(py * -MAX_TILT * 2);
    }, [hasHover, rotateX, rotateY]);

    const handleLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
        lift.set(0);
    }, [rotateX, rotateY, lift]);

    return (
        <motion.li
            ref={nodeRef}
            className="product-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index, 8) * 0.045, duration: 0.3 }}
            style={{ rotateX, rotateY, scale, transformPerspective: 700 }}
            onPointerEnter={handleEnter}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            whileTap={hasHover ? undefined : { scale: 0.97 }}
        >
            <Link to={to} className="product-card-link" aria-label={ariaLabel}>
                {children}
            </Link>
        </motion.li>
    );
}

const ProductGrid = memo(function ProductGrid({ products, category, subcategory }) {
    return (
        <motion.ul
            className="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            {products.map((product, index) => {
                const [first] = getProductImages(product);
                const extra = getProductImages(product).length - 1;
                return (
                    <TiltCard
                        key={product.id}
                        index={index}
                        to={buildPath(category, subcategory, product)}
                        ariaLabel={`Ver ${product.name}`}
                    >
                        <div className="product-card-image">
                            {first && (
                                <SmartImage
                                    src={first.src}
                                    alt={product.name}
                                    sizes="(max-width: 480px) 46vw, (max-width: 900px) 30vw, 240px"
                                    loading={index < 4 ? 'eager' : 'lazy'}
                                    draggable={false}
                                />
                            )}
                            {extra > 0 && (
                                <span className="product-card-badge" aria-hidden="true">
                                    +{extra}
                                </span>
                            )}
                        </div>
                        <span className="product-card-name">{product.name}</span>
                        <span className="product-card-cta" aria-hidden="true">Ver ficha técnica</span>
                    </TiltCard>
                );
            })}
        </motion.ul>
    );
});

export default ProductGrid;
