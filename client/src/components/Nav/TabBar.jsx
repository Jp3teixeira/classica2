import { memo } from 'react';
import { Link } from 'react-router-dom';

import ICONS from '../Dock/icons';
import { categoryEntryPath, ALL_SLUG } from '../../data/navigation';

/**
 * Navegação para ecrãs compactos — equivalente em toque da Dock.
 *
 * "Outros" fica de fora de propósito, tal como na Dock: é alcançável pela
 * sidebar/chips de categorias dentro da janela do Finder. "Ver todos" ocupa o
 * lugar. Os contactos deixaram de viver aqui — passam a um botão só com ícone
 * na MenuBar, junto do relógio, libertando os seis alvos da barra para
 * categorias.
 */
const TabBar = memo(function TabBar({ categories, activeCategorySlug }) {
    const pinned = categories.filter((c) => c.id !== 'outros');

    return (
        <nav className="tabbar" aria-label="Navegação principal">
            <ul className="tabbar-list">
                {pinned.map((category) => (
                    <TabBarItem
                        key={category.id}
                        to={categoryEntryPath(category)}
                        name={category.shortName || category.name}
                        icon={ICONS[category.id]}
                        color={category.color}
                        isActive={category.slug === activeCategorySlug}
                    />
                ))}
                <TabBarItem
                    to={`/${ALL_SLUG}`}
                    name="Tudo"
                    icon={ICONS.todos}
                    color="#55595E"
                    isActive={activeCategorySlug === ALL_SLUG}
                />
            </ul>
        </nav>
    );
});

const TabBarItem = memo(function TabBarItem({ to, name, icon, color, isActive }) {
    return (
        <li className="tabbar-item">
            <Link
                to={to}
                className={`tabbar-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                style={{ '--cat-color': color }}
            >
                <span className="tabbar-icon" aria-hidden="true">{icon}</span>
                <span className="tabbar-label">{name}</span>
            </Link>
        </li>
    );
});

export default TabBar;
