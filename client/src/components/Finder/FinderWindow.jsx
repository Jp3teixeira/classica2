import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Folder Icon for sidebar
const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const FinderWindow = memo(function FinderWindow({
    category,
    onClose
}) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Reset subcategory when category changes
    useEffect(() => {
        setSelectedSubcategory(null);
        setSelectedProduct(null);
    }, [category]);

    // Select first subcategory by default
    useEffect(() => {
        if (category?.subcategories?.length > 0 && !selectedSubcategory) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    }, [category, selectedSubcategory]);

    // Fetch products when subcategory changes (mock for now)
    useEffect(() => {
        if (selectedSubcategory) {
            setLoading(true);
            // Mock products - will be replaced with API call
            setTimeout(() => {
                setProducts(getMockProducts(category.id, selectedSubcategory.id));
                setLoading(false);
            }, 300);
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
                {/* Title Bar */}
                <header className="finder-titlebar">
                    <div className="finder-traffic-lights">
                        <button
                            className="traffic-light close"
                            onClick={onClose}
                            aria-label="Fechar janela"
                        >
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M3 3l6 6M9 3l-6 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button
                            className="traffic-light minimize"
                            aria-label="Minimizar janela"
                            disabled
                        >
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M2 6h8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button
                            className="traffic-light maximize"
                            aria-label="Maximizar janela"
                            disabled
                        >
                            <svg viewBox="0 0 12 12" fill="none">
                                <path d="M2 2l8 8M10 2l-8 8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="finder-title">{category.name}</h1>
                    <div className="finder-toolbar">
                        {/* Spacer for symmetry */}
                    </div>
                </header>

                {/* Content Area */}
                <div className="finder-content">
                    {/* Sidebar - Only showing current category subcategories */}
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

                    {/* Main Content */}
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

// Product Grid View
const ProductGrid = memo(function ProductGrid({ products, onProductClick }) {
    return (
        <motion.div
            className="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
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
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    </div>
                    <span className="product-card-name">
                        {product.name}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
});

// Product Detail View
const ProductDetail = memo(function ProductDetail({ product, onBack }) {
    return (
        <motion.div
            className="product-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <button className="back-btn" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Voltar
            </button>

            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            </div>

            <div className="product-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">{product.description}</p>

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

// Loading State
const LoadingState = memo(function LoadingState() {
    return (
        <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loading-spinner"></div>
            <p className="empty-state-text">A carregar...</p>
        </motion.div>
    );
});

// Empty State
const EmptyState = memo(function EmptyState({ subcategory }) {
    return (
        <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p className="empty-state-text">
                {subcategory
                    ? `Ainda não existem produtos em "${subcategory.name}".`
                    : 'Selecione um tipo de produto.'}
            </p>
        </motion.div>
    );
});

// Mock products generator (will be replaced with API)
function getMockProducts(categoryId, subcategoryId) {
    const mockProducts = {
        'catalogos': [
            {
                id: '1',
                name: 'Catálogo Premium A4',
                description: 'Catálogo de alta qualidade em papel couché 250g, com acabamento brilhante. Ideal para apresentação de produtos de luxo e portfolios corporativos. Impressão offset com cores vivas e definição superior.',
                image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Papel', value: 'Couché 250g' },
                    { label: 'Acabamento', value: 'Brilhante' },
                    { label: 'Páginas', value: '24-200' }
                ]
            },
            {
                id: '2',
                name: 'Catálogo Económico',
                description: 'Solução económica para catálogos de grande tiragem, com papel offset e acabamento mate. Perfeito para distribuição em massa mantendo qualidade profissional.',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Formato', value: 'A5' },
                    { label: 'Papel', value: 'Offset 120g' },
                    { label: 'Acabamento', value: 'Mate' }
                ]
            },
            {
                id: '3',
                name: 'Catálogo de Luxo',
                description: 'Edição premium com acabamentos especiais: verniz UV localizado, hot stamping dourado e papel texturado. Para marcas que exigem o melhor.',
                image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Formato', value: 'A4 Quadrado' },
                    { label: 'Papel', value: 'Texturado 300g' },
                    { label: 'Acabamento', value: 'Hot Stamping + UV' }
                ]
            }
        ],
        'livros': [
            {
                id: '4',
                name: 'Livro Capa Dura',
                description: 'Encadernação premium com capa dura e costura, ideal para edições especiais e livros de arte. Qualidade que perdura gerações.',
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Encadernação', value: 'Capa Dura' },
                    { label: 'Costura', value: 'Linha' },
                    { label: 'Formato', value: 'Variável' }
                ]
            },
            {
                id: '5',
                name: 'Brochura Premium',
                description: 'Encadernação brochura com cola PUR de alta resistência. Acabamento profissional para tiragens médias e grandes.',
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Encadernação', value: 'Brochura PUR' },
                    { label: 'Lombada', value: 'Quadrada' },
                    { label: 'Páginas', value: '50-500' }
                ]
            }
        ],
        'embalagens': [
            {
                id: '6',
                name: 'Caixa Premium',
                description: 'Caixa rígida com acabamento premium, perfeita para produtos de luxo e presentes corporativos. Personalização total com a sua marca.',
                image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Material', value: 'Cartão Rígido' },
                    { label: 'Acabamento', value: 'Soft Touch' },
                    { label: 'Personalização', value: 'Total' }
                ]
            },
            {
                id: '7',
                name: 'Embalagem Alimentar',
                description: 'Embalagens certificadas para produtos alimentares, com materiais seguros e sustentáveis. Conformidade total com normas europeias.',
                image: 'https://images.unsplash.com/photo-1610141991936-a9a8f3af0c55?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Certificação', value: 'Food Grade' },
                    { label: 'Material', value: 'Cartão FSC' }
                ]
            },
            {
                id: '8',
                name: 'Caixa E-commerce',
                description: 'Embalagem otimizada para envios, com proteção reforçada e design que impressiona na entrega.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Tipo', value: 'Auto-montável' },
                    { label: 'Proteção', value: 'Reforçada' }
                ]
            }
        ],
        'rotulagem': [
            {
                id: '9',
                name: 'Rótulo Vinho Premium',
                description: 'Rótulos de vinho com acabamentos especiais: relevos, hot stamping e papéis texturados. Elevamos a sua marca ao próximo nível.',
                image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Acabamento', value: 'Hot Stamping' },
                    { label: 'Papel', value: 'Texturado' },
                    { label: 'Relevo', value: 'Disponível' }
                ]
            },
            {
                id: '10',
                name: 'Etiquetas Adesivas',
                description: 'Etiquetas em vinil, papel ou materiais especiais. Resistentes à água, sol e abrasão. Ideais para qualquer aplicação.',
                image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Material', value: 'Vinil / Papel' },
                    { label: 'Resistência', value: 'Água e UV' }
                ]
            }
        ],
        'impressao-digital': [
            {
                id: '11',
                name: 'Grande Formato',
                description: 'Impressão digital de grande formato para outdoors, lonas e sinalética. Cores vibrantes e alta durabilidade.',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Largura', value: 'Até 5m' },
                    { label: 'Resolução', value: '1440 dpi' },
                    { label: 'Materiais', value: 'Vinil, Lona, Papel' }
                ]
            },
            {
                id: '12',
                name: 'Impressão em Acrílico',
                description: 'Impressão direta em acrílico para sinalética interior premium. Acabamento elegante e profissional.',
                image: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e?w=600&h=400&fit=crop',
                characteristics: [
                    { label: 'Material', value: 'Acrílico 3-10mm' },
                    { label: 'Acabamento', value: 'Polido' }
                ]
            }
        ]
    };

    return mockProducts[categoryId] || [];
}

export default FinderWindow;
