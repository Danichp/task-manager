const express = require('express');
const router = express.Router();

router.use('/user', require('./user/user.controller'));
router.use('/task', require('./task/task.controller'));

module.exports = router;
