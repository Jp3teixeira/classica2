import { memo } from 'react';

const CONTACT_EMAIL = 'geral@classicaag.pt';

const MenuBar = memo(function MenuBar({ categories, onCategoryClick, currentTime }) {
    const formatTime = (date) =>
        date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false });

    const formatDate = (date) =>
        date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <header className="menubar">
            {/* Logo */}
            <div className="menubar-logo">
                <span className="menubar-logo-text">Clássica</span>
            </div>

            {/* Navegação por categorias */}
            <nav className="menubar-nav" aria-label="Menu principal">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className="menubar-item"
                        onClick={() => onCategoryClick(category.id)}
                        aria-label={`Abrir ${category.name}`}
                    >
                        {category.name}
                    </button>
                ))}
            </nav>

            {/* Direita */}
            <div className="menubar-right">
                {/* Email estático */}
                <span className="menubar-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {CONTACT_EMAIL}
                </span>

                <div className="menubar-divider"></div>

                {/* Data e hora */}
                <div className="menubar-datetime">
                    <span className="menubar-date">{formatDate(currentTime)}</span>
                    <span className="menubar-time">{formatTime(currentTime)}</span>
                </div>
            </div>
        </header>
    );
});

export default MenuBar;
