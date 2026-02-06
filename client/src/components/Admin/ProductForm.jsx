import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductForm({ product, categories, token, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        image: '',
        characteristics: [],
        featured: false,
        order: 0
    });
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [newCharLabel, setNewCharLabel] = useState('');
    const [newCharValue, setNewCharValue] = useState('');

    // Load product data if editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                subcategory: product.subcategory || '',
                image: product.image || '',
                characteristics: product.characteristics || [],
                featured: product.featured || false,
                order: product.order || 0
            });
            setImagePreview(product.image || '');
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Reset subcategory when category changes
        if (name === 'category') {
            setFormData(prev => ({ ...prev, subcategory: '' }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecione uma imagem válida.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter menos de 5MB.');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_URL}/upload?token=${token}`, {
                method: 'POST',
                headers: {
                    'x-admin-token': token
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const imageUrl = `${API_URL.replace('/api', '')}${data.image.url}`;
                setFormData(prev => ({ ...prev, image: imageUrl }));
                setImagePreview(imageUrl);
            } else {
                alert(data.message || 'Erro ao carregar imagem');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao carregar imagem');
        }

        setUploading(false);
    };

    const handleImageUrl = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const addCharacteristic = () => {
        if (!newCharLabel.trim() || !newCharValue.trim()) return;

        setFormData(prev => ({
            ...prev,
            characteristics: [
                ...prev.characteristics,
                { label: newCharLabel.trim(), value: newCharValue.trim() }
            ]
        }));
        setNewCharLabel('');
        setNewCharValue('');
    };

    const removeCharacteristic = (index) => {
        setFormData(prev => ({
            ...prev,
            characteristics: prev.characteristics.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        if (!formData.name.trim()) {
            alert('O nome é obrigatório.');
            return;
        }
        if (!formData.category) {
            alert('A categoria é obrigatória.');
            return;
        }
        if (!formData.image.trim()) {
            alert('A imagem é obrigatória.');
            return;
        }
        if (!formData.description.trim()) {
            alert('A descrição é obrigatória.');
            return;
        }

        onSave(formData);
    };

    const selectedCategory = categories.find(c => c.id === formData.category);

    return (
        <motion.div
            className="admin-form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
        >
            <motion.div
                className="admin-form-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="admin-form-header">
                    <h2>{product ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>
                    <button className="admin-form-close" onClick={onCancel}>×</button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Nome do Produto *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Catálogo Premium A4"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row two-cols">
                        <div className="form-group">
                            <label htmlFor="category">Categoria *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecionar categoria...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subcategory">Subcategoria</label>
                            <select
                                id="subcategory"
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                disabled={!formData.category}
                            >
                                <option value="">Selecionar tipo...</option>
                                {selectedCategory?.subcategories.map(sub => (
                                    <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descrição *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva o produto, materiais, acabamentos..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Imagem *</label>
                        <div className="image-input-group">
                            <div className="image-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    id="image-upload"
                                    disabled={uploading}
                                />
                                <label htmlFor="image-upload" className={uploading ? 'uploading' : ''}>
                                    {uploading ? '⏳ A carregar...' : '📎 Carregar imagem'}
                                </label>
                            </div>
                            <span className="or-divider">ou</span>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleImageUrl}
                                placeholder="Cole URL da imagem..."
                                className="image-url-input"
                            />
                        </div>
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Características</label>
                        <div className="characteristics-list">
                            {formData.characteristics.map((char, index) => (
                                <div key={index} className="characteristic-item">
                                    <span className="char-label">{char.label}:</span>
                                    <span className="char-value">{char.value}</span>
                                    <button type="button" onClick={() => removeCharacteristic(index)}>×</button>
                                </div>
                            ))}
                        </div>
                        <div className="add-characteristic">
                            <input
                                type="text"
                                placeholder="Nome (ex: Formato)"
                                value={newCharLabel}
                                onChange={(e) => setNewCharLabel(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Valor (ex: A4)"
                                value={newCharValue}
                                onChange={(e) => setNewCharValue(e.target.value)}
                            />
                            <button type="button" onClick={addCharacteristic}>+</button>
                        </div>
                    </div>

                    <div className="form-row two-cols">
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span>Produto em destaque</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="order">Ordem de exibição</label>
                            <input
                                type="number"
                                id="order"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save">
                            {product ? 'Guardar Alterações' : 'Criar Produto'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
