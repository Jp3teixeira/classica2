const express = require('express');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Get all products (public)
router.get('/', async (req, res) => {
    try {
        const { category, subcategory, featured, active = 'true' } = req.query;

        // Build query
        const query = {};

        if (active === 'true') {
            query.active = true;
        }

        if (category) {
            query.category = category;
        }

        if (subcategory) {
            query.subcategory = subcategory;
        }

        if (featured === 'true') {
            query.featured = true;
        }

        const products = await Product.find(query)
            .sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter produtos.'
        });
    }
});

// GET /api/products/categories - Get products grouped by category
router.get('/categories', async (req, res) => {
    try {
        const products = await Product.find({ active: true })
            .sort({ order: 1, createdAt: -1 });

        // Group by category
        const grouped = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        res.json({
            success: true,
            categories: grouped
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter categorias.'
        });
    }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter produto.'
        });
    }
});

// POST /api/products - Create product (admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, category, subcategory, image, characteristics, featured, order } = req.body;

        const product = new Product({
            name,
            description,
            category,
            subcategory,
            image,
            characteristics,
            featured,
            order
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso!',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar produto.',
            error: error.message
        });
    }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, description, category, subcategory, image, characteristics, featured, order, active } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, category, subcategory, image, characteristics, featured, order, active },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso!',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar produto.',
            error: error.message
        });
    }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        res.json({
            success: true,
            message: 'Produto eliminado com sucesso!'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao eliminar produto.'
        });
    }
});

module.exports = router;
