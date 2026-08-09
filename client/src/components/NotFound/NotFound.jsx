import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SmartImage from '../SmartImage';
import { getCategories, buildPath } from '../../data/navigation';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

const CATEGORIES = getCategories();

/**
 * Página 404.
 *
 * Em vez de um beco sem saída, oferece as categorias — se alguém chegou aqui
 * por um link partilhado com erro, a intenção era ver trabalhos.
 *
 * `noindex` é definido em runtime para que o Google não indexe URLs inválidos
 * (com o rewrite de SPA, a resposta HTTP é sempre 200).
 */
export default function NotFound() {
    useDocumentMeta({ title: 'Página não encontrada', noindex: true });

    return (
        <div className="not-found">
            <motion.div
                className="not-found-inner"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SmartImage
                    src="/imagens/Logos/logo_white.jpg"
                    alt="Clássica Artes Gráficas"
                    className="not-found-logo"
                    sizes="200px"
                    loading="eager"
                />

                <p className="not-found-code">404</p>
                <h1 className="not-found-title">Página não encontrada</h1>
                <p className="not-found-text">
                    O endereço que introduziu não existe ou foi alterado.
                    Pode ver os nossos trabalhos a partir daqui.
                </p>

                <nav className="not-found-links" aria-label="Categorias de produtos">
                    {CATEGORIES.map((category) => (
                        <Link key={category.id} to={buildPath(category)} className="not-found-chip">
                            {category.name}
                        </Link>
                    ))}
                </nav>

                <Link to="/" className="not-found-btn">Voltar ao início</Link>
            </motion.div>
        </div>
    );
}
