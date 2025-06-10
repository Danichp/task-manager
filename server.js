const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./_helpers/error-handler')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(`/api`, require('./api/api.controller'));
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Task Manager API работает!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
