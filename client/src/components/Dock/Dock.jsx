import { memo } from 'react';
import { Link } from 'react-router-dom';

import ICONS from './icons';
import { categoryEntryPath, ALL_SLUG } from '../../data/navigation';

/**
 * Dock estilo macOS — apenas em ecrãs com hover (desktop).
 *
 * Em dispositivos de toque este componente não é montado: o <TabBar> ocupa o
 * seu lugar.
 *
 * "Outros" fica de fora da Dock de propósito — é a categoria residual, menos
 * relevante para acesso rápido — mas continua alcançável pela MenuBar e pela
 * sidebar da janela do Finder. "Todos os trabalhos" entra no lugar, separado
 * das restantes por um traço vertical.
 */
const Dock = memo(function Dock({ categories, activeCategorySlug }) {
    const pinned = categories.filter((c) => c.id !== 'outros');

    return (
        <nav className="dock" aria-label="Categorias de produtos">
            {pinned.map((category) => (
                <DockItem
                    key={category.id}
                    to={categoryEntryPath(category)}
                    name={category.name}
                    icon={ICONS[category.id]}
                    color={category.color}
                    isActive={category.slug === activeCategorySlug}
                />
            ))}

            <span className="dock-separator" aria-hidden="true" />

            <DockItem
                to={`/${ALL_SLUG}`}
                name="Ver todos os trabalhos"
                icon={ICONS.todos}
                color="#55595E"
                isActive={activeCategorySlug === ALL_SLUG}
            />
        </nav>
    );
});

const DockItem = memo(function DockItem({ to, name, icon, color, isActive }) {
    return (
        <Link
            to={to}
            className="dock-item"
            aria-current={isActive ? 'true' : undefined}
            style={{ '--cat-color': color }}
        >
            <span className="dock-label" aria-hidden="true">{name}</span>
            <span className="dock-icon">{icon}</span>
            <span className="dock-dot" aria-hidden="true" data-active={isActive} />
        </Link>
    );
});

export default Dock;
