module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnautorizeError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static Forbidden(message = 'Нет доступа') {
    return new ApiError(403, message);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }
};
