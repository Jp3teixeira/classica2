import { useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import FinderWindow from './FinderWindow';
import NotFound from '../NotFound/NotFound';
import { resolveRoute, buildPath } from '../../data/navigation';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

/**
 * Traduz os parâmetros do URL em categoria / subcategoria / produto e entrega-os
 * à janela do Finder. Toda a navegação do Finder passa por aqui, pelo que:
 *
 *  - refrescar a página mantém o contexto;
 *  - Back/Forward do browser funcionam nível a nível;
 *  - qualquer produto tem um link partilhável;
 *  - um segmento inválido dá 404 real em vez de um ecrã vazio.
 */
export default function FinderRoute() {
    const { categorySlug, subcategorySlug, productSlug } = useParams();
    const navigate = useNavigate();

    const { ok, category, subcategory, product } = resolveRoute({
        categorySlug,
        subcategorySlug,
        productSlug,
    });

    // Título/descrição/canonical por rota. Chamado antes de qualquer return
    // condicional para respeitar a ordem dos hooks.
    //
    // Quando o URL não resolve, este componente devolve <NotFound/>: o meta tem
    // de dizer noindex aqui também, porque os efeitos dos filhos correm ANTES
    // dos do pai e o valor do pai seria o último a ser escrito.
    useDocumentMeta(ok
        ? {
            title: product?.name
                || (category && subcategory ? `${subcategory.name} — ${category.name}` : category?.name),
            description: product?.description?.split('\n')[0] || category?.description,
            path: buildPath(category, subcategory, product),
        }
        : { title: 'Página não encontrada', noindex: true });

    const closeFinder = useCallback(() => navigate('/'), [navigate]);

    if (!ok) return <NotFound />;

    // /categoria → normaliza para /categoria/primeira-subcategoria, para que o
    // URL descreva sempre exactamente o que está no ecrã.
    if (!subcategorySlug && subcategory) {
        return <Navigate to={buildPath(category, subcategory)} replace />;
    }

    return (
        <FinderWindow
            category={category}
            subcategory={subcategory}
            product={product}
            onClose={closeFinder}
        />
    );
}
