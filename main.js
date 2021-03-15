const express = require('express');
const cookie = require('cookie-parser');
const session = require('express-session');
const ejs = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.set('view engine', 'ejs');

app.use(ejs);

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.APP_SECRET
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cookie());

app.use(require('./routes'));

mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() =>
    app.listen(PORT,
        () => console.log('server is running on port', PORT))
);