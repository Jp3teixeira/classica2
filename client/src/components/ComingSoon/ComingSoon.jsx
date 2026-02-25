import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ComingSoon.css';

function ComingSoon() {
    const [dots, setDots] = useState('');

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="cs-container">
            {/* Background blur circles */}
            <div className="cs-blob cs-blob-1" />
            <div className="cs-blob cs-blob-2" />
            <div className="cs-blob cs-blob-3" />

            <motion.div
                className="cs-card"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Logo */}
                <motion.div
                    className="cs-logo-wrap"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <img src="/imagens/logo/classica2.png" alt="Clássica Artes Gráficas" className="cs-logo" />
                </motion.div>

                {/* Text */}
                <motion.div
                    className="cs-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <h1 className="cs-title">Clássica Artes Gráficas</h1>
                    <p className="cs-subtitle">O nosso novo site está a ser preparado{dots}</p>
                    <p className="cs-description">
                        Estamos a trabalhar para lhe oferecer uma experiência melhor.<br />
                        Em breve estaremos de volta com novidades.
                    </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                    className="cs-divider"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                />

                {/* Contact */}
                <motion.div
                    className="cs-contact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <p className="cs-contact-label">Entretanto, contacte-nos:</p>
                    <div className="cs-contact-items">
                        <a href="mailto:classicaartesgraficas2@gmail.com" className="cs-contact-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            classicaartesgraficas2@gmail.com
                        </a>
                        <a href="tel:917206097" className="cs-contact-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            917 206 097
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.p
                className="cs-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                © {new Date().getFullYear()} Clássica Artes Gráficas. Todos os direitos reservados.
            </motion.p>
        </div>
    );
}

export default ComingSoon;
