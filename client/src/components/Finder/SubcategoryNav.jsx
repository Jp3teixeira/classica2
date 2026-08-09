import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import { FolderIcon } from './FinderStates';
import { buildPath } from '../../data/navigation';

/**
 * Navegação de subcategorias.
 *
 * Desktop  → sidebar vertical, como no Finder do macOS.
 * Compacto → barra horizontal com scroll (padrão de segmented control), porque
 *            esconder a sidebar tornava 13 dos 37 produtos inalcançáveis num
 *            telefone. Só muda a apresentação: os destinos são os mesmos.
 *
 * São links reais (<NavLink>): permitem abrir em nova aba, são rastreáveis
 * pelo Google e ganham `aria-current` automaticamente.
 */
const SubcategoryNav = memo(function SubcategoryNav({ category, subcategory, isCompact }) {
    const subcategories = category.subcategories || [];

    // Uma única subcategoria não é uma escolha — não vale ocupar espaço.
    if (subcategories.length <= 1) return null;

    if (isCompact) {
        return (
            <nav className="subcat-strip" aria-label={`Tipos de ${category.name}`}>
                <ul className="subcat-strip-list">
                    {subcategories.map((sub) => (
                        <li key={sub.id}>
                            <NavLink
                                to={buildPath(category, sub)}
                                className={({ isActive }) => `subcat-chip ${isActive ? 'active' : ''}`}
                                aria-current={subcategory?.id === sub.id ? 'true' : undefined}
                            >
                                {sub.name}
                                <span className="subcat-chip-count">{sub.products.length}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }

    return (
        <aside className="finder-sidebar">
            <nav className="finder-sidebar-section" aria-label={`Tipos de ${category.name}`}>
                <h2 className="finder-sidebar-title">Tipos de {category.name}</h2>
                <ul className="finder-sidebar-list">
                    {subcategories.map((sub) => (
                        <li key={sub.id}>
                            <NavLink
                                to={buildPath(category, sub)}
                                className={({ isActive }) => `finder-sidebar-item ${isActive ? 'active' : ''}`}
                                aria-current={subcategory?.id === sub.id ? 'true' : undefined}
                            >
                                <FolderIcon />
                                <span className="finder-sidebar-item-name">{sub.name}</span>
                                <span className="finder-sidebar-item-count">{sub.products.length}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
});

export default SubcategoryNav;
