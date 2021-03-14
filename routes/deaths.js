const router = require('express').Router();

router.get('/', (req, res) =>
    res.render('pages/Deaths.ejs', {
        title: 'Deaths',
    })
);

module.exports = router;