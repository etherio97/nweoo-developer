class Guest {
    static guard(fallback) {
        return action.bind(fallback);
    }
}

function action(req, res, next) {
    if ('session' in req && req.session && req.session['loggedIn']) {
        res.redirect(this);
        res.end();
        return;
    }
    next();
}

module.exports = Guest;