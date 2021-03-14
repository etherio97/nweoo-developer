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

router.use('/auth', require('./auth'));

module.exports = router;