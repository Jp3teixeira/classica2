import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            padding: '32px',
            gap: '24px',
        }}>
            {/* Logo */}
            <motion.img
                src="/imagens/logo/classica2.png"
                alt="Clássica Artes Gráficas"
                style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* 404 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div style={{ fontSize: '96px', fontWeight: '700', letterSpacing: '-4px', lineHeight: 1, color: 'rgba(255,255,255,0.15)' }}>
                    404
                </div>
            </motion.div>

            {/* Mensagem */}
            <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                    Página não encontrada
                </h1>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: '360px', lineHeight: 1.6 }}>
                    O endereço que introduziste não existe. Verifica o URL ou regressa à página principal.
                </p>
            </motion.div>

            {/* Botão */}
            <motion.button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '8px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.98 }}
            >
                ← Voltar ao início
            </motion.button>
        </div>
    );
}
