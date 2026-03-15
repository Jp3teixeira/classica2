import { useState, useCallback, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ICONS from './icons';

// ─── Dock ─────────────────────────────────────────────────────────────────────

const Dock = memo(function Dock({ categories, onCategoryClick }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const hideTimeoutRef = useRef(null);

    // Detectar se é dispositivo touch
    useEffect(() => {
        const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsMobile(touch);

        // Mostrar brevemente no load para todos os utilizadores descobrirem o dock
        const showTimer = setTimeout(() => setIsVisible(true), 2800);
        const hideTimer = setTimeout(() => setIsVisible(false), 6500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const show = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setIsVisible(true);
    }, []);

    // Desktop: esconde com delay. Mobile: esconde imediatamente ao tocar fora
    const hide = useCallback((immediate = false) => {
        if (immediate) {
            setIsVisible(false);
        } else {
            hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 300);
        }
    }, []);

    const handleItemClick = useCallback((categoryId) => {
        onCategoryClick(categoryId);
        // Em mobile, fecha o dock após abrir uma categoria
        if (isMobile) hide(true);
    }, [onCategoryClick, isMobile, hide]);

    return (
        <div className="dock-container">

            {/* Barra fina azul — visível quando o dock está escondido */}
            <motion.div
                className="dock-thin-bar"
                onMouseEnter={show}
                onTouchStart={show}
                aria-hidden="true"
                animate={{ opacity: isVisible ? 0 : 1 }}
                transition={{ duration: 0.25 }}
            />

            {/* Backdrop invisível — fecha o dock ao tocar fora (mobile) */}
            <AnimatePresence>
                {isMobile && isVisible && (
                    <motion.div
                        className="dock-backdrop"
                        onTouchStart={() => hide(true)}
                        onClick={() => hide(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    />
                )}
            </AnimatePresence>

            {/* Zona de trigger invisível no fundo (desktop) */}
            <div
                className="dock-trigger"
                onMouseEnter={show}
                aria-hidden="true"
            />

            {/* Dock */}
            <motion.div
                className="dock"
                onMouseEnter={show}
                onMouseLeave={() => hide(false)}
                role="toolbar"
                aria-label="Barra de aplicações"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 100,
                    pointerEvents: isVisible ? 'auto' : 'none'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
                {categories.map((category) => (
                    <DockItem
                        key={category.id}
                        category={category}
                        icon={ICONS[category.id]}
                        onClick={() => handleItemClick(category.id)}
                    />
                ))}
            </motion.div>
        </div>
    );
});

// ─── Item individual da Dock ──────────────────────────────────────────────────

const DockItem = memo(function DockItem({ category, icon, onClick }) {
    return (
        <motion.button
            className="dock-item"
            onClick={onClick}
            aria-label={`Abrir ${category.name}`}
            whileHover={{
                scale: 1.2,
                y: -14,
                transition: { type: 'spring', stiffness: 400, damping: 17 }
            }}
            whileTap={{ scale: 1.05, y: -6 }}
        >
            <div className="dock-icon">
                {icon}
            </div>
            <span className="dock-label">
                {category.name}
            </span>
        </motion.button>
    );
});

export default Dock;
