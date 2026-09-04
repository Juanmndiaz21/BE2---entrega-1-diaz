const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const initializePassport = require('./config/passport.config');
const sessionsRouter = require('./routes/sessions.router');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log('Servidor activo en el puerto ' + PORT);
        });
    })
    .catch((error) => {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    });

module.exports = app;