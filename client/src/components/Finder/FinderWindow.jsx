import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Folder Icon for sidebar
const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const FinderWindow = memo(function FinderWindow({ category, onClose }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        setSelectedSubcategory(null);
        setSelectedProduct(null);
    }, [category]);

    useEffect(() => {
        if (category?.subcategories?.length > 0 && !selectedSubcategory) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    }, [category, selectedSubcategory]);

    useEffect(() => {
        if (selectedSubcategory) {
            setLoading(true);
            setTimeout(() => {
                setProducts(getProducts(category.id, selectedSubcategory.id));
                setLoading(false);
            }, 200);
        }
    }, [selectedSubcategory, category]);

    return (
        <motion.div
            className="finder-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="finder-window"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <header className="finder-titlebar">
                    <div className="finder-traffic-lights">
                        <button className="traffic-light close" onClick={onClose} aria-label="Fechar janela">
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M3 3l6 6M9 3l-6 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button className="traffic-light minimize" aria-label="Minimizar janela" disabled>
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M2 6h8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button className="traffic-light maximize" aria-label="Maximizar janela" disabled>
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M2 2l8 8M10 2l-8 8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="finder-title">{category.name}</h1>
                    <div className="finder-toolbar"></div>
                </header>

                <div className="finder-content">
                    <aside className="finder-sidebar">
                        <div className="finder-sidebar-section">
                            <h2 className="finder-sidebar-title">Tipos de {category.name}</h2>
                            {category.subcategories?.map((sub) => (
                                <button
                                    key={sub.id}
                                    className={`finder-sidebar-item ${selectedSubcategory?.id === sub.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedSubcategory(sub);
                                        setSelectedProduct(null);
                                    }}
                                >
                                    <FolderIcon />
                                    <span>{sub.name}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="finder-main">
                        <div className="finder-main-content">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <LoadingState key="loading" />
                                ) : selectedProduct ? (
                                    <ProductDetail
                                        key="detail"
                                        product={selectedProduct}
                                        onBack={() => setSelectedProduct(null)}
                                    />
                                ) : products.length > 0 ? (
                                    <ProductGrid
                                        key="grid"
                                        products={products}
                                        onProductClick={setSelectedProduct}
                                    />
                                ) : (
                                    <EmptyState key="empty" subcategory={selectedSubcategory} />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

const ProductGrid = memo(function ProductGrid({ products, onProductClick }) {
    return (
        <motion.div className="product-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {products.map((product, index) => (
                <motion.button
                    key={product.id}
                    className="product-card"
                    onClick={() => onProductClick(product)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="product-card-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <span className="product-card-name">{product.name}</span>
                </motion.button>
            ))}
        </motion.div>
    );
});

const ProductDetail = memo(function ProductDetail({ product, onBack }) {
    return (
        <motion.div className="product-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button className="back-btn" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Voltar
            </button>

            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>

            <div className="product-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>

                {product.characteristics && (
                    <div className="product-characteristics">
                        {product.characteristics.map((char, index) => (
                            <div key={index} className="product-characteristic">
                                <span className="characteristic-label">{char.label}</span>
                                <span className="characteristic-value">{char.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
});

const LoadingState = memo(function LoadingState() {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="loading-spinner"></div>
            <p className="empty-state-text">A carregar...</p>
        </motion.div>
    );
});

const EmptyState = memo(function EmptyState({ subcategory }) {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p className="empty-state-text">
                {subcategory ? `Ainda não existem produtos em "${subcategory.name}".` : 'Selecione um tipo de produto.'}
            </p>
        </motion.div>
    );
});

// ============================================
// PRODUTOS
// Para adicionar um produto novo: copia um bloco
// { id, name, description, image, characteristics }
// e adiciona na categoria/subcategoria correta
// ============================================
function getProducts(categoryId, subcategoryId) {
    const allProducts = {

        // ---- CATÁLOGOS ----
        'catalogos': [
            {
                id: 'cat1',
                name: 'Catálogo Premium A4',
                description: 'Catálogo de alta qualidade em papel couché 250g, com acabamento brilhante.',
                image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Papel', value: 'Couché 250g' },
                    { label: 'Acabamento', value: 'Brilhante' }
                ]
            },
            {
                id: 'cat2',
                name: 'Catálogo Económico A5',
                description: 'Solução económica para catálogos de grande tiragem.',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Formato', value: 'A5' },
                    { label: 'Papel', value: 'Offset 120g' },
                    { label: 'Acabamento', value: 'Mate' }
                ]
            }
        ],

        // ---- LIVROS ----
        'livros': {
            'livros-capa-mole': [
                {
                    id: 'lm1',
                    name: 'Arte e Poesia',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações literárias e de arte.',
                    image: '/imagens/livros/ArteEPoesia_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm2',
                    name: 'As Cores de Abril',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações literárias.',
                    image: '/imagens/livros/AsCoresDeAbril_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm3',
                    name: 'Gramática da Língua Chinesa',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações académicas.',
                    image: '/imagens/livros/GramaticaLinguaChinesa_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm4',
                    name: 'Livro Chinês 1',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações académicas.',
                    image: '/imagens/livros/LivroChines1_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm5',
                    name: 'Livro Chinês 2',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações académicas.',
                    image: '/imagens/livros/LivroChines2_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm6',
                    name: 'Livro de Diálogos',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações académicas.',
                    image: '/imagens/livros/LivroDialogos_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm7',
                    name: 'Rotas do Oriente',
                    description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura.',
                    image: '/imagens/livros/RotasDoOriente_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                }
            ],
            'livros-capa-dura': [
                {
                    id: 'ld1',
                    name: 'Gramática da Língua Chinesa',
                    description: 'Livro de capa dura com encadernação premium. Qualidade superior para obras de referência e publicações de prestígio.',
                    image: '/imagens/livros/GramaticaLinguaChinesa_D.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Dura' },
                        { label: 'Acabamento', value: 'Premium' }
                    ]
                }
            ]
        },

        // ---- CALENDÁRIOS DE PAREDE ----
        'calendarios': {
            'calendarios-3-macetes': [
                {
                    id: 'cal3',
                    name: 'Calendário de Parede 3 Macetes',
                    description: 'Base no formato 34,5x79,5cm., impressa a 4/0 cores + verniz proteção + cortante especial + ilhó em cartolina v/ branco 350gr.\n\n3 macetes de calendário mensal formato 32,5x15,5cm, com 12 folhas impressas a 2/0 cores em papel ior 90gr., colados no topo.\n\nAcabamento final: colagem dos 3 macetes na base, colocação de ilhó, colocação de marcador e dobra.',
                    image: '/imagens/calendarios/MockUpCalendario3M.jpg',
                    characteristics: [
                        { label: 'Base', value: '34,5 x 79,5 cm' },
                        { label: 'Nº de Macetes', value: '3' },
                        { label: 'Formato macete', value: '32,5 x 15,5 cm' },
                        { label: 'Folhas por macete', value: '12' },
                        { label: 'Papel base', value: 'Cartolina branco 350gr' },
                        { label: 'Papel macetes', value: 'Ior 90gr' },
                        { label: 'Impressão base', value: '4/0 cores + verniz' },
                        { label: 'Impressão macetes', value: '2/0 cores' }
                    ]
                }
            ],
            'calendarios-4-macetes': [
                {
                    id: 'cal4',
                    name: 'Calendário de Parede 4 Macetes',
                    description: 'Base no formato 34,5x99,5cm., impressa a 4/0 cores + verniz proteção + cortante especial + ilhó em cartolina v/ branco 350gr.\n\n4 macetes de calendário mensal formato 32,5x15,5cm, com 12 folhas impressas a 2/0 cores em papel ior 90gr., colados no topo.\n\nAcabamento final: colagem dos 4 macetes na base, colocação de ilhó, colocação de marcador e dobra.',
                    image: '/imagens/calendarios/MockUpCalendario4M.jpg',
                    characteristics: [
                        { label: 'Base', value: '34,5 x 99,5 cm' },
                        { label: 'Nº de Macetes', value: '4' },
                        { label: 'Formato macete', value: '32,5 x 15,5 cm' },
                        { label: 'Folhas por macete', value: '12' },
                        { label: 'Papel base', value: 'Cartolina branco 350gr' },
                        { label: 'Papel macetes', value: 'Ior 90gr' },
                        { label: 'Impressão base', value: '4/0 cores + verniz' },
                        { label: 'Impressão macetes', value: '2/0 cores' }
                    ]
                }
            ]
        },

        // ---- EMBALAGENS ----
        'embalagens': [
            {
                id: 'emb1',
                name: 'Caixa Premium',
                description: 'Caixa rígida com acabamento premium, perfeita para produtos de luxo e presentes corporativos.',
                image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Material', value: 'Cartão Rígido' },
                    { label: 'Acabamento', value: 'Soft Touch' }
                ]
            }
        ],

        // ---- ROTULAGEM ----
        'rotulagem': [
            {
                id: 'rot1',
                name: 'Rótulo Vinho Premium',
                description: 'Rótulos de vinho com acabamentos especiais: relevos, hot stamping e papéis texturados.',
                image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Acabamento', value: 'Hot Stamping' },
                    { label: 'Papel', value: 'Texturado' }
                ]
            }
        ],

        // ---- IMPRESSÃO DIGITAL ----
        'impressao-digital': [
            {
                id: 'imp1',
                name: 'Grande Formato',
                description: 'Impressão digital de grande formato para outdoors, lonas e sinalética.',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Largura', value: 'Até 5m' },
                    { label: 'Resolução', value: '1440 dpi' }
                ]
            }
        ]
    };

    const categoryData = allProducts[categoryId];
    if (!categoryData) return [];

    if (!Array.isArray(categoryData)) {
        return categoryData[subcategoryId] || [];
    }

    return categoryData;
}

export default FinderWindow;
