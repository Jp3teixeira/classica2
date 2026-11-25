import { useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import CategoryNav from './CategoryNav';
import FinderBrowser from './FinderBrowser';
import ProductDetail from './ProductDetail';

import { buildPath } from '../../data/navigation';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useIsCompact } from '../../hooks/useMediaQuery';

/**
 * Janela do Finder — diálogo modal com sidebar de subcategorias, grelha de
 * produtos e vista de detalhe.
 *
 * Sem estado próprio: categoria, subcategoria e produto vêm do URL. Isto
 * elimina a cascata de três efeitos encadeados que existia antes (e o flash de
 * produtos da categoria anterior ao trocar de categoria).
 *
 * Acessibilidade: é um `role="dialog"` **não modal** — o foco entra na janela
 * ao abrir e é devolvido ao fechar, e o Escape é hierárquico (do detalhe volta
 * à grelha; da grelha fecha a janela), mas a MenuBar e a barra de navegação
 * continuam utilizáveis, para se trocar de categoria sem fechar a janela.
 */
export default function FinderWindow({ category, subcategory, product, onClose }) {
    const navigate = useNavigate();
    const isCompact = useIsCompact();
    const titleId = useId();

    const allProducts = subcategory?.products ?? [];

    // Escape sai um nível de cada vez, como qualquer navegação hierárquica.
    const handleEscape = useCallback(() => {
        if (product) navigate(buildPath(category, subcategory));
        else onClose();
    }, [product, category, subcategory, navigate, onClose]);

    const dialogRef = useFocusTrap(true, handleEscape, { modal: false });

    const backToGrid = useCallback(
        () => navigate(buildPath(category, subcategory)),
        [navigate, category, subcategory]
    );

    return (
        <motion.div
            className="finder-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={onClose}
        >
            <motion.div
                className="finder-window"
                ref={dialogRef}
                role="dialog"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                // Em ecrã compacto a janela ocupa o ecrã inteiro: um "zoom" de
                // 96,5% para 100% lia-se como um salto, não como uma janela a
                // abrir. Aí sobe um pouco e aparece, como uma folha no telemóvel.
                initial={isCompact ? { opacity: 0, y: 18 } : { opacity: 0, scale: 0.965, y: 10 }}
                animate={isCompact ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isCompact ? { opacity: 0, y: 12 } : { opacity: 0, scale: 0.98, y: 6 }}
                // Easing fixo em vez de spring: uma janela do macOS abre com um
                // movimento rápido e decidido, sem oscilar — uma spring com
                // stiffness/damping moderados dá sempre um bocadinho de
                // "balanço" que, por cima do resto do conteúdo a entrar, lia-se
                // como lentidão.
                transition={{ duration: isCompact ? 0.2 : 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <header className="finder-titlebar">
                    <div className="finder-traffic-lights">
                        <button
                            type="button"
                            className="traffic-light close"
                            onClick={onClose}
                            aria-label="Fechar janela"
                            data-autofocus
                        >
                            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                        <span className="traffic-light minimize" aria-hidden="true" />
                        <span className="traffic-light maximize" aria-hidden="true" />
                    </div>

                    <div className="finder-title" id={titleId}>
                        {category.name}
                        {allProducts.length > 0 && (
                            <span className="finder-title-count"> · {allProducts.length} {allProducts.length === 1 ? 'trabalho' : 'trabalhos'}</span>
                        )}
                    </div>
                </header>

                <div className="finder-content">
                    <CategoryNav activeCategorySlug={category.slug} isCompact={isCompact} />

                    <div className="finder-main">
                        <div className="finder-main-content" id="finder-conteudo" tabIndex={-1}>
                            {/* Sem AnimatePresence aqui de propósito: a navegação de
                                categoria/subcategoria (na sidebar/chips e nos
                                separadores) tem de refletir a nova rota de imediato,
                                nunca à espera de uma animação de saída terminar. Cada
                                vista anima a sua PRÓPRIA entrada (ver ProductDetail e
                                ProductGrid), o que já dá a sensação de transição suave
                                sem atrasar o resto da interface. */}
                            {product ? (
                                <ProductDetail
                                    key={`detail-${product.id}`}
                                    product={product}
                                    category={category}
                                    subcategory={subcategory}
                                    onBack={backToGrid}
                                />
                            ) : (
                                <FinderBrowser
                                    key={`browse-${category.id}-${subcategory?.id}`}
                                    allProducts={allProducts}
                                    category={category}
                                    subcategory={subcategory}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
