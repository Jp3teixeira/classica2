const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Categoria é obrigatória'],
        enum: ['catalogos', 'livros', 'embalagens', 'rotulagem', 'impressao-digital'],
    },
    subcategory: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Imagem é obrigatória']
    },
    characteristics: [{
        label: String,
        value: String
    }],
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, active: 1 });
productSchema.index({ category: 1, subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);
