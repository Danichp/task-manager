const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    logging: config.db.logging,
  }
);

module.exports = sequelize;

sequelize
  .authenticate()
  .then(async () => {
    console.log('Подключение к БД успешно установлено.');
    await sequelize.sync({ alter: true });
    console.log('Все таблицы успешно синхронизированы');
  })
  .catch((error) => {
    console.error('Ошибка:', error);
  });
