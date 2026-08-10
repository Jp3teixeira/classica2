import { motion } from 'framer-motion';

import { CONTACT } from '../../data/contact';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Painel de contactos.
 *
 * Substitui o dropdown que só existia em `:hover` do CSS — num telefone o
 * contacto era inalcançável, e mesmo em desktop o email não era clicável.
 * Agora abre por clique (rato, toque ou teclado), o email é um `mailto:` real
 * e o painel é um diálogo acessível.
 */
export default function ContactPanel({ onClose }) {
    const panelRef = useFocusTrap(true, onClose);

    return (
        <motion.div
            className="contact-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            <motion.div
                className="contact-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-title"
                onClick={(event) => event.stopPropagation()}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
                <div className="contact-header">
                    <h2 className="contact-title" id="contact-title">Contactos</h2>
                    <button type="button" className="contact-close" onClick={onClose} aria-label="Fechar contactos" data-autofocus>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <ul className="contact-list">
                    <li>
                        <a className="contact-action" href={`mailto:${CONTACT.email}`}>
                            <span className="contact-action-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <span className="contact-action-body">
                                <span className="contact-action-label">Email</span>
                                <span className="contact-action-value">{CONTACT.email}</span>
                            </span>
                        </a>
                    </li>
                </ul>
            </motion.div>
        </motion.div>
    );
}
