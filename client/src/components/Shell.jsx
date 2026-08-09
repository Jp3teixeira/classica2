import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import MenuBar from './MenuBar/MenuBar';
import Desktop from './Desktop/Desktop';
import Dock from './Dock/Dock';
import TabBar from './Nav/TabBar';
import ContactPanel from './Contact/ContactPanel';

import { getCategories } from '../data/navigation';
import { useIsCompact } from '../hooks/useMediaQuery';

const CATEGORIES = getCategories();

/**
 * Layout persistente do site.
 *
 * Desktop  → MenuBar com navegação + Desktop + Dock estilo macOS (hover)
 * Compacto → MenuBar com marca e contacto + Desktop + TabBar inferior fixa
 *
 * O painel de contacto vive aqui porque é alcançável dos dois modos de
 * navegação (MenuBar em desktop, TabBar em mobile).
 */
export default function Shell({ children }) {
    const isCompact = useIsCompact();
    const [contactOpen, setContactOpen] = useState(false);

    const openContact = useCallback(() => setContactOpen(true), []);
    const closeContact = useCallback(() => setContactOpen(false), []);

    return (
        <>
            <a className="skip-link" href="#finder-conteudo">Saltar para o conteúdo</a>

            <MenuBar
                categories={CATEGORIES}
                isCompact={isCompact}
                onOpenContact={openContact}
            />

            <Desktop />

            {children}

            {isCompact
                ? <TabBar categories={CATEGORIES} onOpenContact={openContact} />
                : <Dock categories={CATEGORIES} />
            }

            <AnimatePresence>
                {contactOpen && <ContactPanel onClose={closeContact} />}
            </AnimatePresence>
        </>
    );
}
