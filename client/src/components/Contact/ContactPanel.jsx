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
 *
 * Desktop  → flyout ancorado perto do botão "Contactos" da MenuBar.
 * Compacto → folha que desliza a partir do fundo do ecrã, como um sheet nativo.
 */
export default function ContactPanel({ onClose, isCompact }) {
    const panelRef = useFocusTrap(true, onClose);

    // A folha mobile anima sempre em percentagem (nunca mistura '100%' com um
    // 0 sem unidade): misturar tipos de valor no y fazia o Framer Motion ficar
    // a tentar resolver o tipo a cada frame, sem nunca assentar.
    const sheetMotion = isCompact
        ? { initial: { y: '100%' }, animate: { y: '0%' }, exit: { y: '100%' }, transition: { type: 'spring', stiffness: 340, damping: 34 } }
        : { initial: { opacity: 0, y: -8, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.98 }, transition: { duration: 0.16 } };

    return (
        <motion.div
            className={`contact-overlay ${isCompact ? 'is-sheet' : 'is-flyout'}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            <motion.div
                className={`contact-panel ${isCompact ? 'is-sheet' : 'is-flyout'}`}
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-title"
                onClick={(event) => event.stopPropagation()}
                {...sheetMotion}
            >
                {isCompact && <span className="contact-sheet-handle" aria-hidden="true" />}

                <div className="contact-header">
                    <h2 className="contact-title" id="contact-title">Fale connosco</h2>
                    <button type="button" className="contact-close" onClick={onClose} aria-label="Fechar contactos" data-autofocus>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <p className="contact-subtitle">Trabalhamos por encomenda. Conte-nos o que tem em mente.</p>

                <ul className="contact-list">
                    <li>
                        <a className="contact-action" href={`mailto:${CONTACT.email}`}>
                            <span className="contact-action-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                                    <path d="m4 7.5 8 5.5 8-5.5" />
                                </svg>
                            </span>
                            <span className="contact-action-body">
                                <span className="contact-action-label">Email</span>
                                <span className="contact-action-value">{CONTACT.email}</span>
                            </span>
                        </a>
                    </li>
                </ul>

                <a className="contact-cta" href={`mailto:${CONTACT.email}`}>Escrever email</a>
            </motion.div>
        </motion.div>
    );
}
