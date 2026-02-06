import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from './ProductForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Categories for the dropdown
const CATEGORIES = [
    { id: 'catalogos', name: 'Catálogos', subcategories: ['Comerciais', 'Industriais', 'Moda', 'Gastronómicos'] },
    { id: 'livros', name: 'Livros', subcategories: ['Capa Dura', 'Brochura', 'Encadernação Especial', 'Edições Limitadas'] },
    { id: 'embalagens', name: 'Embalagens', subcategories: ['Cartão Canelado', 'Caixas Rígidas', 'Alimentar', 'Cosméticos', 'Luxo'] },
    { id: 'rotulagem', name: 'Rotulagem', subcategories: ['Vinhos', 'Alimentar', 'Industriais', 'Adesivas'] },
    { id: 'impressao-digital', name: 'Impressão Digital', subcategories: ['Grande Formato', 'Pequeno Formato', 'Personalização', 'Prototipagem'] }
];

export default function AdminDashboard() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [notification, setNotification] = useState(null);

    // Verify token on mount
    useEffect(() => {
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/verify?token=${token}`);
            const data = await response.json();

            if (data.success) {
                setIsValid(true);
                fetchProducts();
            } else {
                setIsValid(false);
            }
        } catch (error) {
            console.error('Token verification error:', error);
            setIsValid(false);
        }
        setLoading(false);
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/products?token=${token}`);
            const data = await response.json();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Fetch products error:', error);
            showNotification('Erro ao carregar produtos', 'error');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Tem certeza que deseja eliminar este produto?')) return;

        try {
            const response = await fetch(`${API_URL}/admin/products/${productId}?token=${token}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                showNotification('Produto eliminado com sucesso!');
                fetchProducts();
            } else {
                showNotification(data.message || 'Erro ao eliminar produto', 'error');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            showNotification('Erro ao eliminar produto', 'error');
        }
    };

    const handleSaveProduct = async (productData) => {
        try {
            const url = editingProduct
                ? `${API_URL}/admin/products/${editingProduct._id}?token=${token}`
                : `${API_URL}/admin/products?token=${token}`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (data.success) {
                showNotification(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
                setShowForm(false);
                setEditingProduct(null);
                fetchProducts();
            } else {
                showNotification(data.message || 'Erro ao guardar produto', 'error');
            }
        } catch (error) {
            console.error('Save product error:', error);
            showNotification('Erro ao guardar produto', 'error');
        }
    };

    const handleToggleActive = async (product) => {
        try {
            const response = await fetch(`${API_URL}/admin/products/${product._id}?token=${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, active: !product.active })
            });

            const data = await response.json();

            if (data.success) {
                showNotification(product.active ? 'Produto desativado' : 'Produto ativado');
                fetchProducts();
            }
        } catch (error) {
            console.error('Toggle active error:', error);
        }
    };

    // Filter products
    const filteredProducts = filterCategory === 'all'
        ? products
        : products.filter(p => p.category === filterCategory);

    // Loading state
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>A verificar acesso...</p>
            </div>
        );
    }

    // Invalid token
    if (!isValid) {
        return (
            <div className="admin-error">
                <div className="admin-error-content">
                    <h1>🔒 Acesso Negado</h1>
                    <p>O link de acesso não é válido ou expirou.</p>
                    <button onClick={() => navigate('/')}>Voltar ao Site</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        className={`admin-notification ${notification.type}`}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <h1>📦 Gestão de Produtos</h1>
                    <span className="admin-subtitle">Clássica Artes Gráficas</span>
                </div>
                <div className="admin-header-right">
                    <button className="admin-btn-secondary" onClick={() => navigate('/')}>
                        ← Voltar ao Site
                    </button>
                    <button className="admin-btn-primary" onClick={handleCreateProduct}>
                        + Novo Produto
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-filter">
                    <label>Filtrar por categoria:</label>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="all">Todas ({products.length})</option>
                        {CATEGORIES.map(cat => {
                            const count = products.filter(p => p.category === cat.id).length;
                            return (
                                <option key={cat.id} value={cat.id}>{cat.name} ({count})</option>
                            );
                        })}
                    </select>
                </div>
                <div className="admin-stats">
                    <span className="stat">
                        <strong>{products.filter(p => p.active).length}</strong> ativos
                    </span>
                    <span className="stat">
                        <strong>{products.filter(p => !p.active).length}</strong> inativos
                    </span>
                </div>
            </div>

            {/* Products Grid */}
            <div className="admin-products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="admin-empty">
                        <p>Nenhum produto encontrado.</p>
                        <button onClick={handleCreateProduct}>Criar primeiro produto</button>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <motion.div
                            key={product._id}
                            className={`admin-product-card ${!product.active ? 'inactive' : ''}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="admin-product-image">
                                <img src={product.image} alt={product.name} />
                                {!product.active && <span className="inactive-badge">Inativo</span>}
                            </div>
                            <div className="admin-product-info">
                                <h3>{product.name}</h3>
                                <span className="admin-product-category">
                                    {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                                </span>
                            </div>
                            <div className="admin-product-actions">
                                <button
                                    className="action-btn edit"
                                    onClick={() => handleEditProduct(product)}
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn toggle"
                                    onClick={() => handleToggleActive(product)}
                                    title={product.active ? 'Desativar' : 'Ativar'}
                                >
                                    {product.active ? '👁️' : '👁️‍🗨️'}
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDeleteProduct(product._id)}
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Product Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ProductForm
                        product={editingProduct}
                        categories={CATEGORIES}
                        token={token}
                        onSave={handleSaveProduct}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
