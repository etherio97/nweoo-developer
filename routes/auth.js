const { verify, generate } = require('password-hash');
const router = require('express').Router();

const User = require('../src/User');

router.get('/', (req, res) => {
    if (req.session.isLogged) {
        res.redirect('/');
    } else {
        res.render('auth/Login.ejs', {
            title: 'Developer Login',
            errors: [],
            email: '',
            password: '',
        });
    }
});

router.post('/', (req, res) => {
    const errors = [];
    const { email, password } = req.body;
    const resolve = (user) => {
        req.session['loggedIn'] = true;
        req.session['email'] = user.email;
        res.redirect('/');
    };
    const reject = () => res.render('auth/Login.ejs', {
        title: "Developer Login",
        errors,
        email,
    });

    if (!(email || '').length) errors.push('Email address is required');
    if (!(password || '').length) errors.push('Password is required');
    if (errors.length) {
        reject();
    } else {
        User
            .findOne({ email })
            .then((user) => {
                if (!user) return errors.push('Invalid email address') && reject();
                if (!verify(password, user.password)) {
                    return errors.push('Incorrect password') && reject();
                }
                user.password = undefined;
                delete user.password;
                resolve(user);
            }).catch(err => errors.push(err.message) && reject())
    }
});

router.get('/register', (req, res) => res.render('auth/Create.ejs', {
    title: 'Create an account',
    errors: [],
    email: '',
}));

router.post('/register', (req, res) => {
    const errors = [];
    const { email, password, repassword } = req.body;
    const resolve = (user) => {
        req.session = {
            _user: user,
            loggedIn: true
        };
        res.redirect('/');
    };
    const reject = () => res.render('auth/Create.ejs', {
        title: "Developer Login",
        errors,
        email,
        password,
    });

    if (!(email || '').length) errors.push('Email address is required');
    if (!(password || '').length) errors.push('Password is required');
    if (password !== repassword) errors.push('Password does not match');
    if (errors.length) {
        reject();
    } else {
        User
            .create({ email, password: generate(password), role: 'User', })
            .then((user) => {
                user.password = undefined;
                delete user.password;
                resolve(user);
            })
            .catch((err) => errors.push(err.message) && reject());
    }
});

module.exports = router;