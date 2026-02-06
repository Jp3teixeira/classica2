const express = require('express');

const router = express.Router();

// Static categories for the graphic company
const CATEGORIES = [
    {
        id: 'catalogos',
        name: 'Catálogos',
        icon: '📋',
        description: 'Catálogos profissionais para apresentação de produtos e serviços',
        subcategories: [
            { id: 'catalogos-comerciais', name: 'Catálogos Comerciais' },
            { id: 'catalogos-industriais', name: 'Catálogos Industriais' },
            { id: 'catalogos-moda', name: 'Catálogos de Moda' },
            { id: 'catalogos-gastronomia', name: 'Catálogos Gastronómicos' }
        ]
    },
    {
        id: 'livros',
        name: 'Livros',
        icon: '📚',
        description: 'Impressão de livros de alta qualidade com diversos acabamentos',
        subcategories: [
            { id: 'livros-capa-dura', name: 'Capa Dura' },
            { id: 'livros-brochura', name: 'Brochura' },
            { id: 'livros-encadernacao', name: 'Encadernação Especial' },
            { id: 'livros-edicoes-limitadas', name: 'Edições Limitadas' }
        ]
    },
    {
        id: 'embalagens',
        name: 'Embalagens',
        icon: '📦',
        description: 'Embalagens personalizadas para diversos produtos',
        subcategories: [
            { id: 'embalagens-cartao', name: 'Cartão Canelado' },
            { id: 'embalagens-rigidas', name: 'Caixas Rígidas' },
            { id: 'embalagens-alimentar', name: 'Embalagem Alimentar' },
            { id: 'embalagens-cosmeticos', name: 'Embalagem Cosméticos' },
            { id: 'embalagens-luxo', name: 'Embalagem de Luxo' }
        ]
    },
    {
        id: 'rotulagem',
        name: 'Rotulagem',
        icon: '🏷️',
        description: 'Rótulos e etiquetas para todos os tipos de produtos',
        subcategories: [
            { id: 'rotulos-vinhos', name: 'Rótulos de Vinhos' },
            { id: 'rotulos-alimentar', name: 'Rótulos Alimentar' },
            { id: 'rotulos-industriais', name: 'Rótulos Industriais' },
            { id: 'etiquetas-adesivas', name: 'Etiquetas Adesivas' }
        ]
    },
    {
        id: 'impressao-digital',
        name: 'Impressão Digital',
        icon: '🖨️',
        description: 'Impressão digital de alta qualidade para pequenas e grandes tiragens',
        subcategories: [
            { id: 'impressao-grande-formato', name: 'Grande Formato' },
            { id: 'impressao-pequeno-formato', name: 'Pequeno Formato' },
            { id: 'impressao-personalizacao', name: 'Personalização' },
            { id: 'impressao-prototipagem', name: 'Prototipagem' }
        ]
    }
];

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
    res.json({
        success: true,
        categories: CATEGORIES
    });
});

// GET /api/categories/:id - Get single category
router.get('/:id', (req, res) => {
    const category = CATEGORIES.find(c => c.id === req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Categoria não encontrada.'
        });
    }

    res.json({
        success: true,
        category
    });
});

module.exports = router;
