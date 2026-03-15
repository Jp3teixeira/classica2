import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Desktop = memo(function Desktop() {
    const [showHint, setShowHint] = useState(false);

    // Mostrar hint depois da tagline animar, depois esconder passado uns segundos
    useEffect(() => {
        const showTimer = setTimeout(() => setShowHint(true), 2600);
        const hideTimer = setTimeout(() => setShowHint(false), 8000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <main className="desktop">
            {/* Logo */}
            <motion.img
                src="/imagens/Logos/logo_white.jpg"
                alt="Clássica Artes Gráficas"
                className="desktop-logo"
                draggable={false}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.85, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            {/* Tagline — "Fique com boa impressão nossa" */}
            <motion.div
                className="desktop-tagline"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
            >
                <span className="tagline-text">
                    {'Fique com boa impressão nossa'.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            className="tagline-char"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 1.0 + i * 0.035,
                                ease: 'easeOut'
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </span>
                <motion.div
                    className="tagline-line"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 2.2, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Hint — aparece e desaparece suavemente */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        className="desktop-hint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hint-arrow">↓</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
});

export default Desktop;
