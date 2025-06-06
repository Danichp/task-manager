const express = require('express');
const router = express.Router();

const Task = require('../../_helpers/tables/task.schema');




const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, userId } = req.body;
        const task = await Task.create({ title, description, status, dueDate, userId });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении задач' });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Задача не найдена' });

        await task.update(req.body);
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Задача не найдена' });

        await task.destroy();
        res.json({ message: 'Задача удалена' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
};

router.post('/create', createTask)
router.delete('/:id', deleteTask)
router.get('/', getAllTasks)
router.put('/:id', updateTask)

module.exports = router