import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Shell from './components/Shell';
import FinderRoute from './components/Finder/FinderRoute';
import NotFound from './components/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Árvore de rotas.
 *
 * O <Shell> é o layout persistente (MenuBar + Desktop + navegação) e nunca
 * desmonta. As rotas só decidem se a janela do Finder está aberta e em que
 * produto — é isto que dá URLs reais sem mudar nada no conceito visual: a
 * janela continua a "abrir por cima" do desktop, como no macOS.
 *
 *   /                                    landing
 *   /:categoria                          abre a 1ª subcategoria
 *   /:categoria/:subcategoria            subcategoria
 *   /:categoria/:subcategoria/:produto   detalhe do produto
 *
 * `location` é passado explicitamente a <Routes> para que o AnimatePresence
 * possa manter a rota anterior montada durante a animação de saída.
 * A chave é o primeiro segmento do URL: muda de categoria → remonta (evita
 * mostrar produtos da categoria anterior); muda de subcategoria ou de produto
 * → não remonta (a janela mantém-se aberta e só o conteúdo transita).
 */
export default function App() {
    const location = useLocation();
    const finderKey = location.pathname.split('/')[1] || 'home';

    return (
        <ErrorBoundary>
            <Shell>
                <AnimatePresence mode="wait" initial={false}>
                    <Routes location={location} key={finderKey}>
                        <Route path="/" element={null} />
                        <Route path=":categorySlug" element={<FinderRoute />} />
                        <Route path=":categorySlug/:subcategorySlug" element={<FinderRoute />} />
                        <Route path=":categorySlug/:subcategorySlug/:productSlug" element={<FinderRoute />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AnimatePresence>
            </Shell>
        </ErrorBoundary>
    );
}
