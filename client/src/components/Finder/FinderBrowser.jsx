import { useState } from 'react';
import { motion } from 'framer-motion';

import SubcategoryTabs from './SubcategoryTabs';
import ProductGrid from './ProductGrid';
import { EmptyState } from './FinderStates';

/**
 * Cabeçalho (nome + contagem + pesquisa), separadores de subcategoria e
 * grelha de produtos — tudo o que depende de um termo de pesquisa local.
 *
 * Isolado num componente à parte, montado com uma `key` que muda a cada
 * categoria/subcategoria (ver FinderWindow): assim o estado da pesquisa
 * reinicia-se sozinho ao trocar de subcategoria, por ser montagem nova, em
 * vez de precisar de um efeito a repor `query` sempre que os props mudam.
 */
export default function FinderBrowser({ allProducts, category, subcategory }) {
    const [query, setQuery] = useState('');

    const products = query
        ? allProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        : allProducts;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.14 }}
        >
            <div className="finder-main-header">
                <div>
                    <h1 className="finder-cat-title">{category.name}</h1>
                    <p className="finder-cat-count">
                        {products.length} {products.length === 1 ? 'trabalho' : 'trabalhos'}
                    </p>
                </div>
                <label className="finder-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="m20 20-4.2-4.2" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Pesquisar trabalhos"
                        aria-label="Pesquisar trabalhos"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
            </div>

            <SubcategoryTabs category={category} subcategory={subcategory} />

            {products.length > 0 ? (
                <ProductGrid products={products} category={category} subcategory={subcategory} />
            ) : (
                <EmptyState subcategory={subcategory} isSearch={Boolean(query)} />
            )}
        </motion.div>
    );
}
