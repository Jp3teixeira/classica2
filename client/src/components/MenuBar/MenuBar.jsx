import { memo } from 'react';

const CONTACT_EMAIL = 'classicaartesgraficas2@gmail.com';
const CONTACT_PHONE = '+351917206097';
const CONTACT_PHONE_DISPLAY = '917 206 097';

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
                {/* Contactos — informação estática */}
                <div className="menubar-contacts-static">
                    <span className="menubar-contact-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {CONTACT_EMAIL}
                    </span>
                    <span className="menubar-divider-dot">·</span>
                    <span className="menubar-contact-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {CONTACT_PHONE_DISPLAY}
                    </span>
                </div>

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
