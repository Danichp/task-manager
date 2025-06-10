const ApiError = require('./api-errors')

module.exports = function errorHandler(err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, error: err.errors })
    }

    return res.status(500).json({ message: "Непредвиденная ошибка" })
}
