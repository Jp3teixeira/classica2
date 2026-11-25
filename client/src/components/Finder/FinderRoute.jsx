import { useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import FinderWindow from './FinderWindow';
import NotFound from '../NotFound/NotFound';
import { resolveRoute, buildPath, getAllProductsCategory, ALL_SLUG } from '../../data/navigation';
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

    // "/todos" é uma vista agregada, não uma categoria real de categories.js —
    // resolve-se à parte, e só no nível de categoria (sem subcategoria/produto
    // próprios: cada produto liga sempre ao seu URL canónico real).
    const isAllView = categorySlug === ALL_SLUG;
    const resolved = isAllView
        ? { ok: !subcategorySlug && !productSlug, category: getAllProductsCategory(), subcategory: null, product: null }
        : resolveRoute({ categorySlug, subcategorySlug, productSlug });
    const { ok, category, product } = resolved;
    const subcategory = isAllView ? resolved.category?.subcategories[0] : resolved.subcategory;

    // Título/descrição/canonical por rota. Chamado antes de qualquer return
    // condicional para respeitar a ordem dos hooks.
    //
    // Quando o URL não resolve, este componente devolve <NotFound/>: o meta tem
    // de dizer noindex aqui também, porque os efeitos dos filhos correm ANTES
    // dos do pai e o valor do pai seria o último a ser escrito.
    //
    // "/todos" também é noindex: é só um ponto de entrada sobre conteúdo que já
    // existe nas categorias reais — indexá-la seria conteúdo duplicado.
    useDocumentMeta(ok
        ? {
            title: isAllView ? category.name
                : product?.name
                || (category && subcategory ? `${subcategory.name} — ${category.name}` : category?.name),
            description: product?.description?.split('\n')[0] || category?.description,
            path: buildPath(category, subcategory, product),
            noindex: isAllView,
        }
        : { title: 'Página não encontrada', noindex: true });

    const closeFinder = useCallback(() => navigate('/'), [navigate]);

    if (!ok) return <NotFound />;

    // /categoria → normaliza para /categoria/primeira-subcategoria, para que o
    // URL descreva sempre exactamente o que está no ecrã. "/todos" fica como
    // está: é uma categoria "achatada", sem subcategoria própria no URL.
    if (!isAllView && !subcategorySlug && subcategory) {
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
