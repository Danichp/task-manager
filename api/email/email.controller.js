const express = require('express');
const router = express.Router();
const service = require('./email.service');
const { body } = require('express-validator');

router.post('/send', body('to').isEmail(), body('text').notEmpty(), service.sendEmail);

module.exports = router;
