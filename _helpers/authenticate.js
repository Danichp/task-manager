const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./tables/user.schema')
const config = require('../config/config')



const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        config.app.secret,
        { expiresIn: '24h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.app.secret);
    } catch (err) {
        return null;
    }
};

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Неверный токен' });
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(401).json({ error: 'Пользователь не найден в middleware' });
    }

    req.user = user;
    next();
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        config.app.secret + '-refresh',
        { expiresIn: '7d' }
    );
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.app.secret + '-refresh');
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    authMiddleware,
    generateRefreshToken,
    verifyRefreshToken
};