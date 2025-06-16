require('dotenv').config();

const config = {
  app: {
    secret: process.env.SECRET || 'secret',
  },
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.yandex.ru',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    user: process.env.EMAIL_USER || 'danichp01@yandex.ru',
    pass: process.env.EMAIL_PASS || 'uzuxegjupluqinbf',
    from_whom: process.env.EMAIL_FROM_WHOM || 'danichp01@yandex.ru',
  },
};

module.exports = config;
