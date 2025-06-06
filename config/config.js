require('dotenv').config();

const config = {
    app: {
        secret: process.env.SECRET || 'secret'
    }
}

module.exports = config;