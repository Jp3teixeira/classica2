import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import { buildPath } from '../../data/navigation';

/**
 * Separadores de subcategoria — segmented control inline, dentro do conteúdo
 * da janela, igual em desktop e em telemóvel.
 *
 * São links reais (<NavLink>): abrem em nova aba, são rastreáveis pelo Google
 * e ganham `aria-current` automaticamente. Uma única subcategoria não é uma
 * escolha, por isso não desenha nada.
 */
const SubcategoryTabs = memo(function SubcategoryTabs({ category, subcategory }) {
    const subcategories = category.subcategories || [];
    if (subcategories.length <= 1) return null;

    return (
        <div className="subcat-tabs" role="tablist" aria-label={`Tipos de ${category.name}`}>
            {subcategories.map((sub) => (
                <NavLink
                    key={sub.id}
                    to={buildPath(category, sub)}
                    role="tab"
                    className={({ isActive }) => `subcat-tab ${isActive ? 'active' : ''}`}
                    aria-selected={subcategory?.id === sub.id}
                >
                    {sub.name}
                </NavLink>
            ))}
        </div>
    );
});

export default SubcategoryTabs;
