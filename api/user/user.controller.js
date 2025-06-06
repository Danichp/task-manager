const express = require('express');
const router = express.Router();

const { generateToken, generateRefreshToken, authMiddleware } = require('../../_helpers/authenticate')
const User = require('../../_helpers/tables/user.schema');
const Task = require('../../_helpers/tables/task.schema');



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(user.password == password)) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // await user.update({ refreshToken });

        res.json({
            token,
            refreshToken,
            expiresIn: '15m'
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка входа' });
    }

};

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).json({ error: "Пользователь не найден" })

        await user.destroy()
        res.json({ message: 'Пользователь удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении пользователя' })
    }
};

const getUserWithTasks = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: Task,
        });
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения пользователя' });
    }
};

const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        console.error('Ошибка получения профиля:', err);
        res.status(500).json({ error: 'Ошибка получения профиля' });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения пользователя' });
    }
};


router.get('/profile', authMiddleware, getProfile);
router.get('/with-task/:id', getUserWithTasks);
router.get('/:id', authMiddleware, getUser);
router.post('/create', createUser);
router.post('/login', login);
router.delete('/:id', deleteUser);

module.exports = router;




