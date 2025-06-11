const {
  generateToken,
  generateRefreshToken,
} = require('../../_helpers/authenticate');
const User = require('../../_helpers/tables/user.schema');
const Task = require('../../_helpers/tables/task.schema');
const ApiError = require('../../_helpers/api-errors');
const bcrypt = require('bcrypt');
const { validationResult } = require(`express-validator`);

class UserService {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw ApiError.NotFound(`Такого пользователя не существует`);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw ApiError.BadRequest(`Неверный пароль`);
      }
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      res.json({
        token,
        expiresIn: '24h',
      });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(`Ошибка валидации`, errors.errors));
      }
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw ApiError.BadRequest(`Все поля обязательны для заполнения`);
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw ApiError.BadRequest(
          `Пользователь с таким email:${email} уже существует`
        );
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await User.create({ name, email, password: hashedPassword });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) throw ApiError.NotFound(`Пользователь не найден`);

      // Удаляем все задачи пользователя
      await Task.destroy({
        where: { userId: req.params.id },
      });

      await user.destroy();
      res.json({ message: 'Пользователь и связанные задачи удалены' });
    } catch (err) {
      next(err);
    }
  }

  async getUserWithTasks(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: Task,
      });
      if (!user) throw ApiError.NotFound(`Пользователь не найден`);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      res.json(req.user);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) throw ApiError.NotFound(`Пользователь не найден`);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(`Ошибка валидации`, errors.errors));
      }
      const user = req.user;
      let { name, email, password } = req.body;
      if (password) {
        password = await bcrypt.hash(password, 8);
      }
      await user.update({ name, email, password });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async token(req, res, next) {
    try {
      const user = req.user;
      const newAccessToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      res.json({
        token: newAccessToken,
        expiresIn: '24h',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserService();
