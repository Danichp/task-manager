const nodemailer = require('nodemailer');
const config = require('../../config/config');
const ApiError = require('../../_helpers/api-errors');
const { validationResult } = require(`express-validator`);

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }

  sendEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(`Ошибка валидации`, errors.errors));
    }
    const { to, text } = req.body;

    try {
      await this.transporter.sendMail({
        from: `"Task manager" <${config.email.user}>`,
        to,
        subject: 'Письмо с нашего сервера',
        text: '',
        html: `<div>
                <h1>Пришло письмо</h1>
                <p>${text}</p>
              </div>`,
      });

      res.status(200).json({ message: 'Сообщение отправлено' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new EmailService();
