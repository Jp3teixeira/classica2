import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import ICONS from '../Dock/icons';
import { getCategories, categoryEntryPath, ALL_SLUG } from '../../data/navigation';

function countOf(category) {
    return category.subcategories.reduce((total, sub) => total + sub.products.length, 0);
}

/**
 * Navegação de categorias dentro da janela do Finder.
 *
 * Substitui a antiga sidebar de subcategorias: agora lista as categorias
 * principais (+ "Todos os trabalhos"), para que se possa saltar de categoria
 * sem fechar a janela — tal como a sidebar de locais do Finder do macOS.
 * A troca de subcategoria passa a viver em <SubcategoryTabs>, dentro do
 * conteúdo.
 *
 * Desktop  → sidebar vertical, com ícone colorido por categoria.
 * Compacto → fila horizontal de chips no topo da janela (sem ícone — o espaço
 *            é escasso e o nome já identifica a categoria).
 */
const CategoryNav = memo(function CategoryNav({ activeCategorySlug, isCompact }) {
    const categories = getCategories();
    const allCount = categories.reduce((total, c) => total + countOf(c), 0);

    const items = [
        { id: ALL_SLUG, slug: ALL_SLUG, name: 'Todos os trabalhos', color: '#55595E', count: allCount, to: `/${ALL_SLUG}` },
        ...categories.map((c) => ({ ...c, count: countOf(c), to: categoryEntryPath(c) })),
    ];

    if (isCompact) {
        return (
            <nav className="catnav-strip" aria-label="Categorias">
                <ul className="catnav-strip-list">
                    {items.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => `catnav-chip ${isActive || item.slug === activeCategorySlug ? 'active' : ''}`}
                            >
                                {item.name}
                                <span className="catnav-chip-count">{item.count}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }

    return (
        <aside className="finder-sidebar">
            <nav className="finder-sidebar-section" aria-label="Categorias">
                <h2 className="finder-sidebar-title">Trabalhos</h2>
                <ul className="finder-sidebar-list">
                    {items.map((item) => {
                        const isActive = item.slug === activeCategorySlug;
                        return (
                            <li key={item.id}>
                                <NavLink
                                    to={item.to}
                                    className={`finder-sidebar-item ${isActive ? 'active' : ''}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    style={{ '--cat-color': item.color }}
                                >
                                    <span className="finder-sidebar-item-icon" aria-hidden="true">{ICONS[item.id]}</span>
                                    <span className="finder-sidebar-item-name">{item.name}</span>
                                    <span className="finder-sidebar-item-count">{item.count}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
                <div className="finder-sidebar-footer">Clássica Artes Gráficas<br />Porto, Portugal</div>
            </nav>
        </aside>
    );
});

export default CategoryNav;
