const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(`/api`, require('./api/api.controller'));


app.get('/', (req, res) => {
    res.send('Task Manager API работает!');
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
