import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';

import { categoryEntryPath } from '../../data/navigation';

/** Relógio local: só a MenuBar precisa da hora, logo só ela re-renderiza. */
function useClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        // Alinha o primeiro tick com a mudança de minuto, em vez de contar 60s
        // a partir da montagem (a hora podia estar até 59s desalinhada).
        let interval;
        const align = setTimeout(() => {
            setNow(new Date());
            interval = setInterval(() => setNow(new Date()), 60000);
        }, (60 - new Date().getSeconds()) * 1000);

        return () => { clearTimeout(align); clearInterval(interval); };
    }, []);

    return now;
}

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const DIAS_CURTO = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const z = (n) => String(n).padStart(2, '0');

function formatClock(now, isCompact) {
    const dia = (isCompact ? DIAS_CURTO : DIAS)[now.getDay()];
    const data = `${z(now.getDate())}/${z(now.getMonth() + 1)}`;
    const hora = `${z(now.getHours())}:${z(now.getMinutes())}`;
    return isCompact ? `${dia} ${data} · ${hora}` : `${dia}, ${data} · ${hora}`;
}

const MenuBar = memo(function MenuBar({ categories, activeCategorySlug, isCompact, onOpenContact, contactOpen }) {
    const now = useClock();

    return (
        <header className="menubar">
            <Link to="/" className="menubar-logo" aria-label="Clássica Artes Gráficas — página inicial">
                <span className="menubar-logo-text">clássica</span>
            </Link>

            {/* Em ecrãs compactos a navegação por categorias vive na TabBar
                inferior; repeti-la aqui só roubava espaço horizontal. */}
            {!isCompact && (
                <nav className="menubar-nav" aria-label="Categorias de produtos">
                    {categories.map((category) => {
                        const isActive = category.slug === activeCategorySlug;
                        return (
                            <Link
                                key={category.id}
                                to={categoryEntryPath(category)}
                                className={`menubar-item ${isActive ? 'active' : ''}`}
                                aria-current={isActive ? 'true' : undefined}
                            >
                                {category.name}
                            </Link>
                        );
                    })}
                </nav>
            )}

            <div className="menubar-right">
                <span className="menubar-clock">{formatClock(now, isCompact)}</span>

                {isCompact ? (
                    <button
                        type="button"
                        className="menubar-contact-icon"
                        onClick={onOpenContact}
                        aria-label="Contactos"
                        aria-expanded={contactOpen}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="2.5" />
                            <path d="m4 7.5 8 5.5 8-5.5" />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        className={`menubar-item contacts-trigger ${contactOpen ? 'active' : ''}`}
                        onClick={onOpenContact}
                        aria-expanded={contactOpen}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="menubar-icon" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="2.5" />
                            <path d="m4 7.5 8 5.5 8-5.5" />
                        </svg>
                        Contactos
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menubar-chevron" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
});

export default MenuBar;
