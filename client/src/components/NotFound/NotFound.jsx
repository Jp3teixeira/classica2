import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            {/* Logo */}
            <motion.img
                src="/imagens/Logos/logo_white.jpg"
                alt="Clássica Artes Gráficas"
                className="not-found-logo"
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
                <div className="not-found-code">404</div>
            </motion.div>

            {/* Mensagem */}
            <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h1 className="not-found-title">Página não encontrada</h1>
                <p className="not-found-text">
                    O endereço que introduziste não existe. Verifica o URL ou regressa à página principal.
                </p>
            </motion.div>

            {/* Botão */}
            <motion.button
                className="not-found-btn"
                onClick={() => navigate('/')}
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
