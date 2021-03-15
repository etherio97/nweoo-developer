const router = require('express').Router();

router.get('/', (req, res) =>
    res.render('pages/Deaths', {
        title: 'Deaths',
    })
);

module.exports = router;