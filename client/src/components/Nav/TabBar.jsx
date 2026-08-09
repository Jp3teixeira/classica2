import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import ICONS from '../Dock/icons';
import { buildPath } from '../../data/navigation';

/**
 * Navegação para ecrãs compactos.
 *
 * Substitui a Dock em dispositivos de toque. É a tradução direta do conceito —
 * a Dock do macOS e a tab bar do iOS são a mesma ideia — e resolve os três
 * problemas que a Dock tinha em mobile:
 *
 *  1. estava escondida atrás de uma barra de 6px colada ao fundo do ecrã,
 *     exactamente onde o iOS Safari desenha a sua própria barra;
 *  2. desaparecia sozinha depois de alguns segundos;
 *  3. os nomes das categorias só apareciam em hover, pelo que num telefone
 *     a navegação eram seis ícones sem texto.
 *
 * Aqui está sempre visível, cada alvo tem ≥56px de altura, os nomes são
 * legíveis e respeita a área segura do iPhone.
 */
const TabBar = memo(function TabBar({ categories, onOpenContact }) {
    return (
        <nav className="tabbar" aria-label="Navegação principal">
            <ul className="tabbar-list">
                {categories.map((category) => (
                    <li key={category.id} className="tabbar-item">
                        <NavLink
                            to={buildPath(category)}
                            className={({ isActive }) => `tabbar-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="tabbar-icon" aria-hidden="true">{ICONS[category.id]}</span>
                            <span className="tabbar-label">{category.shortName || category.name}</span>
                        </NavLink>
                    </li>
                ))}
                <li className="tabbar-item">
                    <button type="button" className="tabbar-link" onClick={onOpenContact}>
                        <span className="tabbar-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </span>
                        <span className="tabbar-label">Contacto</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
});

export default TabBar;
