const express = require('express');
const router = express.Router();
const service = require('./user.service')
const authenticate = require('../../_helpers/authenticate')
const { body } = require('express-validator')

router.get('/profile', authenticate.authMiddleware, service.getProfile);
router.get('/with-task/:id', service.getUserWithTasks);
router.get('/all', service.getAllUsers);
router.get('/:id', service.getUser);
router.post('/create',
    body('email').isEmail(),
    body('name').isLength({ min: 3, max: 32 }),
    body('password').isLength({ min: 3, max: 32 }).matches(/^[A-Za-z0-9]+$/).withMessage('Пароль должен содержать только латинские буквы и цифры'),
    service.createUser
);
router.post('/login', service.login);
router.post('/refresh', authenticate.authRefreshMiddleware, service.token)
router.put('/update',
    authenticate.authMiddleware,
    body('email').optional().isEmail(),
    body('name').optional().isLength({ min: 3, max: 32 }),
    body('password').optional().isLength({ min: 3, max: 32 }).matches(/^[A-Za-z0-9]+$/).withMessage('Пароль должен содержать только латинские буквы и цифры'),
    service.updateUser)
router.delete('/:id', authenticate.authMiddleware, service.deleteUser);


module.exports = router;




