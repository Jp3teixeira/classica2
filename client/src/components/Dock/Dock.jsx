import { useState, useCallback, useEffect, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import ICONS from './icons';
import { buildPath } from '../../data/navigation';

const REVEAL_AT = 2600;
const HIDE_AFTER = 7000;
const HIDE_DELAY = 350;

/**
 * Dock estilo macOS — apenas em ecrãs com hover (desktop).
 *
 * Em dispositivos de toque este componente não é montado: o <TabBar> ocupa o
 * seu lugar. Isso permite manter aqui a interação por hover na sua forma
 * original, sem os malabarismos de deteção de toque que existiam antes.
 *
 * A Dock continua a mostrar-se sozinha no arranque e a esconder-se depois, mas
 * agora a barra fina do fundo é um botão real: focável por teclado, com nome
 * acessível e área de toque utilizável.
 */
const Dock = memo(function Dock({ categories }) {
    const [isVisible, setIsVisible] = useState(false);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), REVEAL_AT);
        const hideTimer = setTimeout(() => setIsVisible(false), HIDE_AFTER);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, []);

    useEffect(() => () => clearTimeout(hideTimeoutRef.current), []);

    const show = useCallback(() => {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
        setIsVisible(true);
    }, []);

    const hide = useCallback(() => {
        hideTimeoutRef.current = setTimeout(() => setIsVisible(false), HIDE_DELAY);
    }, []);

    return (
        <div className="dock-container">
            {/* Alça de abertura: visível quando a Dock está recolhida. */}
            <motion.button
                type="button"
                className="dock-handle"
                onMouseEnter={show}
                onFocus={show}
                onClick={show}
                aria-label="Mostrar barra de categorias"
                aria-expanded={isVisible}
                animate={{ opacity: isVisible ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                style={{ pointerEvents: isVisible ? 'none' : 'auto' }}
            >
                <span className="dock-handle-bar" aria-hidden="true" />
            </motion.button>

            {/* Zona invisível de hover ao longo do fundo do ecrã. */}
            <div className="dock-trigger" onMouseEnter={show} aria-hidden="true" />

            <motion.nav
                className="dock"
                onMouseEnter={show}
                onMouseLeave={hide}
                aria-label="Categorias de produtos"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 100 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                // visibility (não só opacity) impede que o Tab alcance botões
                // invisíveis, que era possível anteriormente.
                style={{
                    pointerEvents: isVisible ? 'auto' : 'none',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            >
                {categories.map((category) => (
                    <DockItem key={category.id} category={category} icon={ICONS[category.id]} />
                ))}
            </motion.nav>
        </div>
    );
});

const DockItem = memo(function DockItem({ category, icon }) {
    return (
        <motion.div
            className="dock-item-wrap"
            whileHover={{ scale: 1.18, y: -14 }}
            whileTap={{ scale: 1.04, y: -6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <NavLink
                to={buildPath(category)}
                className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
                title={category.description}
            >
                <span className="dock-icon" aria-hidden="true">{icon}</span>
                <span className="dock-label">{category.name}</span>
            </NavLink>
        </motion.div>
    );
});

export default Dock;
