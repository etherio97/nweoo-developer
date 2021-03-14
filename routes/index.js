const e = require('express');

const router = require('express').Router();

router.get('/', (req, res) => {
    if (req.session.isLogged) {
        res.render('pages/Home.ejs', {
            title: 'Home'
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    if (req.session.isLogged) {
        res.redirect('/');
    } else {
        res.render('auth/Login.ejs', {
            title: 'Developer Login'
        });
    }
});

router.post('/login', (req, res) => {
    const errors = [];
    const { email, password } = req.body;
    console.log(req.body);
    if (!email) errors.push('Email address is required')
    if (!password) errors.push('Password is required')

    res.render('auth/Login.ejs', {
        title: "Developer Login",
        errors,
    });
})

module.exports = router;