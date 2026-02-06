const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token middleware
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Acesso negado. Token não fornecido.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido. Utilizador não encontrado.'
            });
        }

        if (!user.active) {
            return res.status(401).json({
                success: false,
                message: 'Conta desativada.'
            });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Faça login novamente.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Apenas administradores.'
        });
    }
};

module.exports = { authMiddleware, adminOnly };
