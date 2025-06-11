const jwt = require('jsonwebtoken');
const User = require('./tables/user.schema');
const config = require('../config/config');
const ApiError = require('./api-errors');

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, config.app.secret, { expiresIn: '5m' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.app.secret);
  } catch (err) {
    console.log('Ошибка верификации токена', err);
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw ApiError.BadRequest(`Требуется авторизация`);
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    throw ApiError.BadRequest(`Неверный токен`);
  }
  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw ApiError.NotFound(`Пользователь при авторизации не найден`);
  }

  req.user = user;
  next();
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, config.app.secret + '-refresh', {
    expiresIn: '7d',
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.app.secret + '-refresh');
  } catch (err) {
    console.log('Ошибка верификации токена', err);
  }
};

const authRefreshMiddleware = async (req, res, next) => {
  console.log(req.cookies);

  const refreshToken = req.cookies.refreshToken; // Получаем из кук

  if (!refreshToken) {
    throw ApiError.BadRequest(`Требуется refresh-токен`);
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw ApiError.BadRequest(`Неверный refresh-токен`);
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw ApiError.NotFound(`Пользователь при авторизации не найден`);
  }

  req.user = user;
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  generateRefreshToken,
  verifyRefreshToken,
  authRefreshMiddleware,
};
