import { useState, useEffect, memo } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { buildPath } from '../../data/navigation';

/** Relógio local: só a MenuBar precisa da hora, logo só ela re-renderiza. */
function useClock(enabled) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (!enabled) return;
        // Alinha o primeiro tick com a mudança de minuto, em vez de contar 60s
        // a partir da montagem (a hora podia estar até 59s desalinhada).
        let interval;
        const align = setTimeout(() => {
            setNow(new Date());
            interval = setInterval(() => setNow(new Date()), 60000);
        }, (60 - new Date().getSeconds()) * 1000);

        return () => { clearTimeout(align); clearInterval(interval); };
    }, [enabled]);

    return now;
}

const MenuBar = memo(function MenuBar({ categories, isCompact, onOpenContact }) {
    const now = useClock(!isCompact);

    return (
        <header className="menubar">
            <Link to="/" className="menubar-logo" aria-label="Clássica Artes Gráficas — página inicial">
                <span className="menubar-logo-text">Clássica</span>
            </Link>

            {/* Em ecrãs compactos a navegação por categorias vive na TabBar
                inferior; repeti-la aqui só roubava espaço horizontal. */}
            {!isCompact && (
                <nav className="menubar-nav" aria-label="Categorias de produtos">
                    {categories.map((category) => (
                        <NavLink
                            key={category.id}
                            to={buildPath(category)}
                            className={({ isActive }) => `menubar-item ${isActive ? 'active' : ''}`}
                        >
                            {category.name}
                        </NavLink>
                    ))}
                </nav>
            )}

            <div className="menubar-right">
                <button type="button" className="menubar-item contacts-trigger" onClick={onOpenContact}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="menubar-icon" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Contactos
                </button>

                {!isCompact && (
                    <>
                        <span className="menubar-divider" aria-hidden="true" />
                        <div className="menubar-datetime">
                            <span className="menubar-date">
                                {now.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                            <span className="menubar-time">
                                {now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
});

export default MenuBar;
