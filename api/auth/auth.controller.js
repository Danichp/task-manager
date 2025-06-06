const express = require('express');
const router = express.Router();
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../../_helpers/authenticate');
const User = require('../../_helpers/tables/user.schema');

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Требуется refresh-токен' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ error: 'Неверный refresh-токен' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await user.update({ refreshToken: newRefreshToken });

    res.json({
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: '15m'
    });
});

router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Требуется refresh-токен' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ error: 'Неверный refresh-токен' });
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    // Отзываем токен
    await user.update({ refreshToken: null });
    res.json({ message: 'Выход выполнен' });
});

module.exports = router;