const express = require('express');
const Product = require('../models/Product');
const { checkAdminAccess } = require('../middleware/adminToken');

const router = express.Router();

// All routes require admin token
router.use(checkAdminAccess);

// GET /api/admin/products - Get all products (including inactive)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ category: 1, order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Admin get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter produtos.'
        });
    }
});

// POST /api/admin/products - Create product
router.post('/products', async (req, res) => {
    try {
        const { name, description, category, subcategory, image, characteristics, featured, order } = req.body;

        // Validate required fields
        if (!name || !description || !category || !image) {
            return res.status(400).json({
                success: false,
                message: 'Nome, descrição, categoria e imagem são obrigatórios.'
            });
        }

        const product = new Product({
            name,
            description,
            category,
            subcategory,
            image,
            characteristics: characteristics || [],
            featured: featured || false,
            order: order || 0,
            active: true
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso!',
            product
        });
    } catch (error) {
        console.error('Admin create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar produto.',
            error: error.message
        });
    }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
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
        console.error('Admin update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar produto.',
            error: error.message
        });
    }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
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
        console.error('Admin delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao eliminar produto.'
        });
    }
});

// GET /api/admin/verify - Verify token is valid
router.get('/verify', (req, res) => {
    res.json({
        success: true,
        message: 'Token válido. Bem-vindo ao painel de administração!'
    });
});

module.exports = router;
