const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { checkAdminAccess } = require('../middleware/adminToken');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de ficheiro não suportado. Use: JPEG, PNG, WebP ou GIF.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// POST /api/upload - Upload image (admin only - using secret token)
router.post('/', checkAdminAccess, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhuma imagem fornecida.'
            });
        }

        // Build URL for the uploaded file
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Imagem carregada com sucesso!',
            image: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar imagem.'
        });
    }
});

// DELETE /api/upload/:filename - Delete image (admin only)
router.delete('/:filename', checkAdminAccess, (req, res) => {
    try {
        const filepath = path.join(uploadsDir, req.params.filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                message: 'Ficheiro não encontrado.'
            });
        }

        fs.unlinkSync(filepath);

        res.json({
            success: true,
            message: 'Ficheiro eliminado com sucesso!'
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao eliminar ficheiro.'
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ficheiro demasiado grande. Máximo 5MB.'
            });
        }
    }

    res.status(400).json({
        success: false,
        message: error.message
    });
});

module.exports = router;
