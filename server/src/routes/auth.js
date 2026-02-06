const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username e password são obrigatórios.'
            });
        }

        // Find user
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Check if user is active
        if (!user.active) {
            return res.status(401).json({
                success: false,
                message: 'Conta desativada.'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login bem sucedido!',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login.'
        });
    }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// POST /api/auth/register - Register new admin (only for existing admins)
router.post('/register', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { username, password, name, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username já existe.'
            });
        }

        // Create user
        const user = new User({
            username,
            password,
            name,
            role: role || 'editor'
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Utilizador criado com sucesso!',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar utilizador.'
        });
    }
});

// POST /api/auth/setup - Initial admin setup (only works if no users exist)
router.post('/setup', async (req, res) => {
    try {
        // Check if any users exist
        const userCount = await User.countDocuments();

        if (userCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Setup já foi realizado.'
            });
        }

        const { username, password, name } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Username, password e nome são obrigatórios.'
            });
        }

        // Create admin user
        const user = new User({
            username,
            password,
            name,
            role: 'admin'
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Admin criado com sucesso!',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar admin.'
        });
    }
});

module.exports = router;
