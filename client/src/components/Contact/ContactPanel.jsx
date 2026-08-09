import { motion } from 'framer-motion';

import { CONTACT } from '../../data/contact';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Painel de contactos.
 *
 * Substitui o dropdown que só existia em `:hover` do CSS — num telefone o
 * contacto era inalcançável, e mesmo em desktop o email não era clicável.
 * Agora abre por clique (rato, toque ou teclado), o email e o telefone são
 * links `mailto:`/`tel:` reais e o painel é um diálogo acessível.
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

                <p className="contact-intro">
                    Fale connosco sobre o seu projeto — orçamentos sem compromisso.
                </p>

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
                    <li>
                        <a className="contact-action" href={`tel:${CONTACT.phoneHref}`}>
                            <span className="contact-action-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </span>
                            <span className="contact-action-body">
                                <span className="contact-action-label">Telefone</span>
                                <span className="contact-action-value">{CONTACT.phoneDisplay}</span>
                            </span>
                        </a>
                    </li>
                </ul>

                <p className="contact-note">{CONTACT.locality}</p>
            </motion.div>
        </motion.div>
    );
}
