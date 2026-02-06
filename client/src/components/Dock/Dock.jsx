import { useState, useCallback, memo, useRef } from 'react';
import { motion } from 'framer-motion';

// Professional SVG Icons for each category
const ICONS = {
    catalogos: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
    ),
    livros: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    ),
    embalagens: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    ),
    rotulagem: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    ),
    'impressao-digital': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
        </svg>
    )
};

const Dock = memo(function Dock({ categories, onCategoryClick }) {
    const [isVisible, setIsVisible] = useState(false);
    const hideTimeoutRef = useRef(null);

    // Handle mouse entering the trigger zone
    const handleTriggerEnter = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setIsVisible(true);
    }, []);

    // Handle mouse entering the dock
    const handleDockEnter = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setIsVisible(true);
    }, []);

    // Handle mouse leaving the dock
    const handleDockLeave = useCallback(() => {
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 300);
    }, []);

    return (
        <div className="dock-container">
            {/* Invisible trigger zone at the bottom of the screen */}
            <div
                className="dock-trigger"
                onMouseEnter={handleTriggerEnter}
                aria-hidden="true"
            />

            {/* Dock */}
            <motion.div
                className="dock"
                onMouseEnter={handleDockEnter}
                onMouseLeave={handleDockLeave}
                role="toolbar"
                aria-label="Barra de aplicações"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 100
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35
                }}
            >
                {categories.map((category) => (
                    <DockItem
                        key={category.id}
                        category={category}
                        icon={ICONS[category.id]}
                        onClick={() => onCategoryClick(category.id)}
                    />
                ))}
            </motion.div>
        </div>
    );
});

// Individual Dock Item
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
            whileTap={{ scale: 1.1 }}
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
