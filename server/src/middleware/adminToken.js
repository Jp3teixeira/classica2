// Middleware to verify admin secret token
const verifyAdminToken = (req, res, next) => {
    const token = req.params.token || req.headers['x-admin-token'];
    const validToken = process.env.ADMIN_SECRET_TOKEN;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acesso não fornecido.'
        });
    }

    if (token !== validToken) {
        return res.status(403).json({
            success: false,
            message: 'Token de acesso inválido.'
        });
    }

    // Token is valid, proceed
    next();
};

// Middleware to check token from query or header
const checkAdminAccess = (req, res, next) => {
    const token = req.query.token || req.headers['x-admin-token'];
    const validToken = process.env.ADMIN_SECRET_TOKEN;

    if (!token || token !== validToken) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado.'
        });
    }

    next();
};

module.exports = { verifyAdminToken, checkAdminAccess };
