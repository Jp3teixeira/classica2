import { memo } from 'react';
import { motion } from 'framer-motion';

const Desktop = memo(function Desktop() {
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

            {/* Hint sutil — convida a explorar */}
            <motion.p
                className="desktop-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.8 }}
            >
                Explore os nossos trabalhos ↓
            </motion.p>
        </main>
    );
});

export default Desktop;
