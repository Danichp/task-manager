const express = require('express');
const router = express.Router();
const service = require('./task.service');
const authenticate = require('../../_helpers/authenticate');

router.post('/create', authenticate.authMiddleware, service.createTask);
router.delete('/:id', authenticate.authMiddleware, service.deleteTask);
router.get('/', authenticate.authMiddleware, service.getAllTasks);
router.get('/overdue', authenticate.authMiddleware, service.getOverdueTasks);
router.put('/:id', authenticate.authMiddleware, service.updateTask);

module.exports = router;
