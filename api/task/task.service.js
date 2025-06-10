const Task = require('../../_helpers/tables/task.schema');
const ApiError = require('../../_helpers/api-errors')


class TaskService {
    async createTask(req, res, next) {
        try {
            const userId = req.user.id
            const { title, description, status, dueDate } = req.body;
            const task = await Task.create({ title, description, status, dueDate, userId });
            res.status(201).json(task);
        } catch (err) {
            next(err)
        }
    }

    async getAllTasks(req, res, next) {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (err) {
            next(err)
        }
    }

    async updateTask(req, res, next) {
        try {
            const user = req.user
            const task = await Task.findByPk(req.params.id);
            if (!task) throw ApiError.NotFound(`Задача не найдена`);
            if (user.id !== task.userId) throw ApiError.Forbidden();

            await task.update(req.body);
            res.json(task);
        } catch (err) {
            next(err)
        }
    }

    async deleteTask(req, res, next) {
        try {
            const task = await Task.findByPk(req.params.id);
            if (!task) throw ApiError.NotFound(`Задача не найдена`);

            await task.destroy();
            res.json({ message: 'Задача удалена' });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new TaskService();