import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div className="finder-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
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
                            <svg viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <button className="traffic-light minimize" disabled>
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <button className="traffic-light maximize" disabled>
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
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
                                    onClick={() => { setSelectedSubcategory(sub); setSelectedProduct(null); }}
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
                                    <ProductDetail key="detail" product={selectedProduct} onBack={() => setSelectedProduct(null)} />
                                ) : products.length > 0 ? (
                                    <ProductGrid key="grid" products={products} onProductClick={setSelectedProduct} />
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
            {products.map((product, index) => {
                // Support both single image and images array
                const thumbSrc = product.images ? product.images[0].src : product.image;
                return (
                    <motion.button
                        key={product.id} className="product-card"
                        onClick={() => onProductClick(product)}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.02 }}
                    >
                        <div className="product-card-image">
                            <img src={thumbSrc} alt={product.name} />
                        </div>
                        <span className="product-card-name">{product.name}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
});

const ProductDetail = memo(function ProductDetail({ product, onBack }) {
    // Build image list: support both `images` array and single `image`
    const imageList = product.images
        ? product.images
        : [{ src: product.image, label: null }];

    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <motion.div className="product-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button className="back-btn" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Voltar
            </button>

            {/* Main image */}
            <div className="product-image-container">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIdx}
                        src={imageList[activeIdx].src}
                        alt={imageList[activeIdx].label || product.name}
                        className="product-image"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    />
                </AnimatePresence>
            </div>

            {/* Thumbnails — só aparece se houver mais de 1 imagem */}
            {imageList.length > 1 && (
                <div className="product-thumbnails">
                    {imageList.map((img, idx) => (
                        <button
                            key={idx}
                            className={`product-thumb ${activeIdx === idx ? 'active' : ''}`}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={img.label || `Imagem ${idx + 1}`}
                        >
                            <img src={img.src} alt={img.label || `Imagem ${idx + 1}`} />
                            {img.label && <span className="product-thumb-label">{img.label}</span>}
                        </button>
                    ))}
                </div>
            )}

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

// ============================================================
// PRODUTOS
// Para adicionar: copia um bloco { id, name, description,
// image, characteristics } e cola na categoria correta.
// ============================================================
function getProducts(categoryId, subcategoryId) {
    const allProducts = {

        // ================================================================
        // CATÁLOGOS
        // ================================================================
        'catalogos': {
            'catalogos-todos': [
                {
                    id: 'cat1',
                    name: 'Catálogo Frato',
                    description: 'Catálogo profissional de alta qualidade.',
                    image: '/imagens/catalogo/Catalogo_Frato_1.jpg',
                    characteristics: []
                },
                {
                    id: 'cat2',
                    name: 'Catálogo Madalena',
                    description: 'Catálogo profissional de alta qualidade.',
                    image: '/imagens/catalogo/Catalogo_Madalena_2.jpg',
                    characteristics: []
                },
                {
                    id: 'cat3',
                    name: 'Catálogo Valadares',
                    description: 'Catálogo profissional de alta qualidade.',
                    image: '/imagens/catalogo/Catalogo_Valadares_3.jpg',
                    characteristics: []
                }
            ]
        },

        // ================================================================
        // LIVROS
        // ================================================================
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
                    description: 'Obra em dois volumes, impressa em papel ior 90gr. com plastificação mate.\n\nVolume 1: 404 páginas impressas a 1/1 cor (preto).\nVolume 2: 288 páginas impressas a 1/1 cor (preto).\n\nCapa impressa a 4/0 cores + plastificação mate em cartolina cromo v/ branco 270gr.\nAcabamento: Brochado.',
                    image: '/imagens/livros/AsCoresDeAbril_M.jpg',
                    characteristics: [
                        { label: 'Volumes', value: '2' },
                        { label: 'Páginas Vol. 1', value: '404' },
                        { label: 'Páginas Vol. 2', value: '288' },
                        { label: 'Impressão miolo', value: '1/1 cor (preto)' },
                        { label: 'Papel miolo', value: 'Ior 90gr' },
                        { label: 'Impressão capa', value: '4/0 cores' },
                        { label: 'Plastificação', value: 'Mate' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 270gr' },
                        { label: 'Acabamento', value: 'Brochado' }
                    ]
                },
                {
                    id: 'lm3',
                    name: 'Gramática da Língua Chinesa',
                    description: 'Formato 17x24cm. com 128 páginas impressas a 1/1 cor em papel ior 80gr.\n\nCapa impressa a 4/0 cores + plastificação em cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                    image: '/imagens/livros/GramaticaLinguaChinesa_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: '17 x 24 cm' },
                        { label: 'Páginas', value: '128' },
                        { label: 'Impressão miolo', value: '1/1 cor' },
                        { label: 'Papel miolo', value: 'Ior 80gr' },
                        { label: 'Impressão capa', value: '4/0 cores' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                        { label: 'Acabamento', value: 'Cosido e brochado' }
                    ]
                },
                {
                    id: 'lm4',
                    name: 'Manual Chinês 123 — Livro 1',
                    description: 'Formato A4, com 132 páginas impressas a 4/4 cores em papel ior 100gr.\n\nCapa com 2 badanas integrais, impressa a 4/4 cores + plastificação em cartolina cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                    image: '/imagens/livros/LivroChines1_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: 'A4' },
                        { label: 'Páginas', value: '132' },
                        { label: 'Impressão miolo', value: '4/4 cores' },
                        { label: 'Papel miolo', value: 'Ior 100gr' },
                        { label: 'Capa', value: '2 badanas integrais' },
                        { label: 'Impressão capa', value: '4/4 cores + plastificação' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                        { label: 'Acabamento', value: 'Cosido e brochado' }
                    ]
                },
                {
                    id: 'lm5',
                    name: 'Manual Chinês 123 — Livro 2',
                    description: 'Formato A4, com 160 páginas impressas a 4/4 cores em papel ior 100gr.\n\nCapa com 2 badanas integrais, impressa a 4/4 cores + plastificação em cartolina cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                    image: '/imagens/livros/LivroChines2_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: 'A4' },
                        { label: 'Páginas', value: '160' },
                        { label: 'Impressão miolo', value: '4/4 cores' },
                        { label: 'Papel miolo', value: 'Ior 100gr' },
                        { label: 'Capa', value: '2 badanas integrais' },
                        { label: 'Impressão capa', value: '4/4 cores + plastificação' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                        { label: 'Acabamento', value: 'Cosido e brochado' }
                    ]
                },
                {
                    id: 'lm6',
                    name: 'Diálogos Inter-Culturais Portugal — China',
                    description: 'Formato 17x24cm. com 440 páginas impressas a 1/1 cor em papel ior 80gr.\n\nCapa impressa a 4/0 cores + plastificação em cartolina cromo v/ branco 300gr.\nAcabamento: cosido e brochado.',
                    image: '/imagens/livros/LivroDialogos_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: '17 x 24 cm' },
                        { label: 'Páginas', value: '440' },
                        { label: 'Impressão miolo', value: '1/1 cor' },
                        { label: 'Papel miolo', value: 'Ior 80gr' },
                        { label: 'Impressão capa', value: '4/0 cores + plastificação' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                        { label: 'Acabamento', value: 'Cosido e brochado' }
                    ]
                },
                {
                    id: 'lm7',
                    name: 'Rotas a Oriente',
                    description: 'Revista no formato 17x24cm. com 256 páginas.\n\n240 páginas impressas a 2/2 cores + 16 páginas impressas a 4/4 cores, em papel ior 80gr.\n\nCapa impressa a 2/0 cores + plastificação mate em cartolina cromo v/ branco 300gr.\nAcabamento: cosidos e brochados.',
                    image: '/imagens/livros/RotasDoOriente_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: '17 x 24 cm' },
                        { label: 'Páginas totais', value: '256' },
                        { label: 'Impressão miolo', value: '240p a 2/2 + 16p a 4/4 cores' },
                        { label: 'Papel miolo', value: 'Ior 80gr' },
                        { label: 'Impressão capa', value: '2/0 cores' },
                        { label: 'Plastificação', value: 'Mate' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                        { label: 'Acabamento', value: 'Cosidos e brochados' }
                    ]
                },
                {
                    id: 'lm8',
                    name: 'Obras Portuguesas em Macau e Sentimentos Orientais',
                    description: 'Formato 17x24cm. com 128 páginas impressas a 4/4 cores em papel Ior 135gr.\n\nCapa impressa a 4/0 cores + plastificação em cartolina cromo v/ branco 300gr.\nAcabamento: cosidos e brochados.',
                    image: '/imagens/livros/ArteEPoesia_M.jpg',
                    characteristics: [
                        { label: 'Formato', value: '17 x 24 cm' },
                        { label: 'Páginas', value: '128' },
                        { label: 'Impressão miolo', value: '4/4 cores' },
                        { label: 'Papel miolo', value: 'Ior 135gr' },
                        { label: 'Impressão capa', value: '4/0 cores + plastificação' },
                        { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                        { label: 'Acabamento', value: 'Cosidos e brochados' }
                    ]
                },
                {
                    id: 'lm9',
                    name: 'Livro Agora',
                    description: 'Livro de capa mole com acabamento profissional.',
                    image: '/imagens/livros/Livro_Agora_M.jpg',
                    characteristics: [
                        { label: 'Encadernação', value: 'Capa Mole' },
                        { label: 'Acabamento', value: 'Brochura' }
                    ]
                },
                {
                    id: 'lm10',
                    name: 'Diálogos (Resumos)',
                    description: 'Livro de capa mole com acabamento profissional.',
                    image: '/imagens/livros/Livro_Dialogos(resumos)_M.jpg',
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
                },
                {
                    id: 'ld2',
                    name: 'GPS da Vida Cristã',
                    description: 'Formato 9x14cm. com 200 páginas impressas a 2/2 cores em papel Munken Pure 90gr.\n\nGuardas sem impressão em Munken Pure 150gr.\nCapa dura com gravação a seco.\nAcabamento: cosido e cartonado.',
                    image: '/imagens/livros/Livro_GPS_D.jpg',
                    characteristics: [
                        { label: 'Formato', value: '9 x 14 cm' },
                        { label: 'Páginas', value: '200' },
                        { label: 'Impressão miolo', value: '2/2 cores' },
                        { label: 'Papel miolo', value: 'Munken Pure 90gr' },
                        { label: 'Guardas', value: 'Munken Pure 150gr (sem impressão)' },
                        { label: 'Capa', value: 'Dura com gravação a seco' },
                        { label: 'Acabamento', value: 'Cosido e cartonado' }
                    ]
                },
                {
                    id: 'ld3',
                    name: 'O Arquivo da Venerável Ordem Terceira de São Francisco do Porto',
                    description: 'Formato 23x29cm. com 204 páginas impressas a 4/4 cores + verniz proteção em couché 135gr.\n\nGuardas impressas a 4/4 cores em couché 200gr.\nCapa dura cartão 2,5mm com plano impresso a 4/0 cores + plastificação.\nAcabamento: cosido e cartonado, lombo redondo, transfil e fitilho. Embalados individualmente em plástico.',
                    image: '/imagens/livros/Livro_Ordem_D.jpg',
                    characteristics: [
                        { label: 'Formato', value: '23 x 29 cm' },
                        { label: 'Páginas', value: '204' },
                        { label: 'Impressão miolo', value: '4/4 cores + verniz' },
                        { label: 'Papel miolo', value: 'Couché 135gr' },
                        { label: 'Guardas', value: 'Couché 200gr, 4/4 cores' },
                        { label: 'Capa', value: 'Dura cartão 2,5mm + plastificação' },
                        { label: 'Acabamento', value: 'Cosido e cartonado, lombo redondo' },
                        { label: 'Extras', value: 'Transfil, fitilho, embalagem individual' }
                    ]
                }
            ]
        },

        // ================================================================
        // CALENDÁRIOS DE PAREDE
        // ================================================================
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
                    id: 'cal4a',
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
                },
                {
                    id: 'cal4b',
                    name: 'Calendário Grupolis 4 Macetes',
                    description: 'Calendário de parede 4 macetes personalizado.',
                    image: '/imagens/calendarios/Calendario_Grupolis_2_4M.jpg',
                    characteristics: [
                        { label: 'Nº de Macetes', value: '4' }
                    ]
                }
            ]
        },

        // ================================================================
        // EMBALAGENS
        // ================================================================
        'embalagens': {
            'embalagens-micro-canelado': [
                {
                    id: 'mc1',
                    name: 'Embalagem Way Up',
                    description: 'Formato 130x220x185mm. Micro canelado, fundo automático.',
                    image: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_WAYUP_MC_1.jpg',
                    characteristics: [
                        { label: 'Formato', value: '130 x 220 x 185 mm' },
                        { label: 'Material', value: 'Micro canelado' },
                        { label: 'Fundo', value: 'Automático' }
                    ]
                },
                {
                    id: 'mc2',
                    name: 'Embalagem Sport',
                    description: 'Formato 148x193x100mm. Micro canelado.',
                    image: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_Sport_MC_2.jpg',
                    characteristics: [
                        { label: 'Formato', value: '148 x 193 x 100 mm' },
                        { label: 'Material', value: 'Micro canelado' }
                    ]
                },
                {
                    id: 'mc3',
                    name: 'Embalagem Kefood',
                    description: 'Formato 127x285x150mm. Micro canelado, fundo automático.',
                    image: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_Kefood_MC_3.jpg',
                    characteristics: [
                        { label: 'Formato', value: '127 x 285 x 150 mm' },
                        { label: 'Material', value: 'Micro canelado' },
                        { label: 'Fundo', value: 'Automático' }
                    ]
                },
                {
                    id: 'mc4',
                    name: 'Embalagem Redo',
                    description: 'Formato 160x137x60mm. Mini micro canelado.',
                    images: [
                        { src: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_REDO_MC_4_Aberta.jpg', label: 'Aberta' },
                        { src: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_REDO_MC_4_Fechada.jpg', label: 'Fechada' }
                    ],
                    characteristics: [
                        { label: 'Formato', value: '160 x 137 x 60 mm' },
                        { label: 'Material', value: 'Mini micro canelado' }
                    ]
                },
                {
                    id: 'mc5',
                    name: 'Embalagem Way Up Snack Proteico',
                    description: 'Formato 125x287x150mm. Micro canelado, fundo automático.',
                    image: '/imagens/embalagens/MicroCanelado(MC)/Embalagem_WAYUP(proteico)_MC_5.jpg',
                    characteristics: [
                        { label: 'Formato', value: '125 x 287 x 150 mm' },
                        { label: 'Material', value: 'Micro canelado' },
                        { label: 'Fundo', value: 'Automático' }
                    ]
                }
            ],
            'embalagens-cartolina': [
                {
                    id: 'ct1',
                    name: 'Caixa Celeiro',
                    description: 'Formato 80x55x145mm. Cartolina 380gr.',
                    images: [
                        { src: '/imagens/embalagens/Cartolina/Cartolina_Celeiro_1_Aberta.jpg', label: 'Aberta' },
                        { src: '/imagens/embalagens/Cartolina/Cartolina_Celeiro_1_Fechada.jpg', label: 'Fechada' }
                    ],
                    characteristics: [
                        { label: 'Formato', value: '80 x 55 x 145 mm' },
                        { label: 'Material', value: 'Cartolina 380gr' }
                    ]
                },
                {
                    id: 'ct2',
                    name: 'Caixa Sun Booster',
                    description: 'Formato 70x70x137mm. Cartolina 380gr., fundo automático.',
                    image: '/imagens/embalagens/Cartolina/Cartolina_SUNBOOSTER_2.jpg',
                    characteristics: [
                        { label: 'Formato', value: '70 x 70 x 137 mm' },
                        { label: 'Material', value: 'Cartolina 380gr' },
                        { label: 'Fundo', value: 'Automático' }
                    ]
                },
                {
                    id: 'ct3',
                    name: 'Caixa Ptit Truc',
                    description: 'Caixa impressa a 4/0 cores em cartolina com plastificação alimentar no interior.',
                    image: '/imagens/embalagens/Cartolina/Cartolina_PTITTRUC _3_Fechada.jpg',
                    characteristics: [
                        { label: 'Impressão', value: '4/0 cores' },
                        { label: 'Interior', value: 'Plastificação alimentar' }
                    ]
                }
            ]
        },

        // ================================================================
        // ROTULAGEM
        // ================================================================
        'rotulagem': {
            'rotulos': [
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
            ]
        },

        // ================================================================
        // OUTROS
        // ================================================================
        'outros': {
            'outros-brochuras': [
                {
                    id: 'bro1',
                    name: 'Brochura Nutribullet',
                    description: 'Formato 10x20cm. com 20 páginas.',
                    image: '/imagens/outros/Brochuras/Brochura_nutribullet_1.png',
                    characteristics: [
                        { label: 'Formato', value: '10 x 20 cm' },
                        { label: 'Páginas', value: '20' }
                    ]
                },
                {
                    id: 'bro2',
                    name: 'Brochura Kenwood',
                    description: 'Formato 10x20cm. com 12 páginas em couché 150gr. + capa.\n\nImpressas a 4/4 cores + verniz proteção.\nAcabamento: agrafadas a 2 pontos.',
                    image: '/imagens/outros/Brochuras/Brochura_Kenwood_1.png',
                    characteristics: [
                        { label: 'Formato', value: '10 x 20 cm' },
                        { label: 'Páginas', value: '12' },
                        { label: 'Papel', value: 'Couché 150gr' },
                        { label: 'Impressão', value: '4/4 cores + verniz' },
                        { label: 'Acabamento', value: 'Agrafadas a 2 pontos' }
                    ]
                }
            ],
            'outros-postais': [
                {
                    id: 'pos1',
                    name: 'Postal a Preto e Branco',
                    description: 'Postais a preto e branco, formato 105x150mm.\n\nPlano total 64,3x15cm., impressos a 2/1 cores + verniz UV geral frente, em cartolina cromo v/ branco 260gr.\nAplicação de vincos e dobra manual.',
                    images: [
                        { src: '/imagens/outros/Postais/Postal_Ordem_2_Aberto.jpg', label: 'Aberto' },
                        { src: '/imagens/outros/Postais/Postal_Ordem_2_Fechado.jpg', label: 'Fechado' }
                    ],
                    characteristics: [
                        { label: 'Formato', value: '105 x 150 mm' },
                        { label: 'Plano total', value: '64,3 x 15 cm' },
                        { label: 'Impressão', value: '2/1 cores + verniz UV frente' },
                        { label: 'Papel', value: 'Cromo v/ branco 260gr' },
                        { label: 'Acabamento', value: 'Vincos e dobra manual' }
                    ]
                },
                {
                    id: 'pos2',
                    name: 'Postal a Cores',
                    description: 'Postais a cores, formato 105x150mm.\n\nPlano total 129,6x15cm. (2 planos fto. 64,3x15cm colados com fita dupla face), impressos a 4/1 cor + verniz UV mate geral, em cartolina cromo v/ branco 260gr.\nAplicação de vincos, fita cola duas faces e dobra manual.',
                    image: '/imagens/outros/Postais/Postal_Ordem_1_Fechado.jpg',
                    characteristics: [
                        { label: 'Formato', value: '105 x 150 mm' },
                        { label: 'Plano total', value: '129,6 x 15 cm' },
                        { label: 'Impressão', value: '4/1 cor + verniz UV mate' },
                        { label: 'Papel', value: 'Cromo v/ branco 260gr' },
                        { label: 'Acabamento', value: 'Vincos, fita dupla face e dobra manual' }
                    ]
                }
            ],
            'outros-calendarios-secretaria': [
                {
                    id: 'csec1',
                    name: 'Calendário de Secretária JMV 2025',
                    description: 'Formato 12x16cm.\n\n12 folhas impressas a 4/4 cores + verniz proteção em couché mate 250gr.\n1 folha impressa a 4/4 cores + verniz proteção em couché mate 350gr.\nBase formato aberto 46x12cm., impressa a 1/0 cor em cartolina cromo v/ branco 400gr.\n\nAcabamento: espiral metálica.',
                    images: [
                        { src: '/imagens/outros/Calendarios_Secretária/Calendario_De_Secretária_JMV_1_Aberto.jpg', label: 'Aberto' },
                        { src: '/imagens/outros/Calendarios_Secretária/Calendario_De_Secretária_JMV_1_Fechado.jpg', label: 'Fechado' }
                    ],
                    characteristics: [
                        { label: 'Formato', value: '12 x 16 cm' },
                        { label: 'Folhas mensais', value: '12' },
                        { label: 'Papel folhas', value: 'Couché mate 250gr' },
                        { label: 'Folha separadora', value: 'Couché mate 350gr' },
                        { label: 'Base aberta', value: '46 x 12 cm, cromo 400gr' },
                        { label: 'Impressão', value: '4/4 cores + verniz' },
                        { label: 'Acabamento', value: 'Espiral metálica' }
                    ]
                }
            ],
            'outros-embalagens-redondas': [
                {
                    id: 'emr1',
                    name: 'Embalagem Redonda',
                    description: 'Embalagem redonda personalizada.',
                    image: '/imagens/outros/Embalagens_Redondas/Embalagem_Redonda_1.jpg',
                    characteristics: [
                        { label: 'Forma', value: 'Redonda' }
                    ]
                }
            ]
        }
    };

    const categoryData = allProducts[categoryId];
    if (!categoryData) return [];
    if (!Array.isArray(categoryData)) return categoryData[subcategoryId] || [];
    return categoryData;
}

export default FinderWindow;
