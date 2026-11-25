import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import MenuBar from './MenuBar/MenuBar';
import Desktop from './Desktop/Desktop';
import Dock from './Dock/Dock';
import TabBar from './Nav/TabBar';
import ContactPanel from './Contact/ContactPanel';

import { getCategories } from '../data/navigation';
import { useIsCompact } from '../hooks/useMediaQuery';
import ContactContext from '../context/ContactContext';
import { installPrefetch } from '../utils/prefetch';

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
    const location = useLocation();
    const [contactOpen, setContactOpen] = useState(false);

    // Pré-carrega as fotos de uma categoria/produto quando o rato passa por
    // cima de um link ou o dedo lhe toca (ver utils/prefetch.js).
    useEffect(() => installPrefetch(), []);

    const toggleContact = useCallback(() => setContactOpen((open) => !open), []);
    const openContact = useCallback(() => setContactOpen(true), []);
    const closeContact = useCallback(() => setContactOpen(false), []);

    // Categoria em exibição, lida do URL. Os links de navegação apontam para o
    // caminho de entrada da categoria (já com a 1ª subcategoria), pelo que o
    // estado ativo não pode vir do `isActive` do NavLink — seria falso assim que
    // o utilizador mudasse de subcategoria.
    const activeCategorySlug = location.pathname.split('/')[1] || null;

    return (
        <ContactContext.Provider value={openContact}>
            <a className="skip-link" href="#finder-conteudo">Saltar para o conteúdo</a>

            <MenuBar
                categories={CATEGORIES}
                activeCategorySlug={activeCategorySlug}
                isCompact={isCompact}
                onOpenContact={toggleContact}
                contactOpen={contactOpen}
            />

            <Desktop />

            {children}

            {isCompact
                ? <TabBar categories={CATEGORIES} activeCategorySlug={activeCategorySlug} />
                : <Dock categories={CATEGORIES} activeCategorySlug={activeCategorySlug} />
            }

            <AnimatePresence>
                {contactOpen && <ContactPanel onClose={closeContact} isCompact={isCompact} />}
            </AnimatePresence>
        </ContactContext.Provider>
    );
}
