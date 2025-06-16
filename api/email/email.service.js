const nodemailer = require('nodemailer');
const config = require('../../config/config');

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
    const { to, text } = req.body;

    try {
      await this.transporter.sendMail({
        from: '"Ваше Имя" <danichp01@yandex.ru>',
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
