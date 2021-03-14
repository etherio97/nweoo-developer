class Auth {
    static guard(fallback) {
        return action.bind(fallback);
    }
}

function action(req, res, next) {
    if ('session' in req && req.session && req.session['loggedIn']) {
        return next();
    }
    res.redirect(this);
    res.end();
}

module.exports = Auth;