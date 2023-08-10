const authenticate = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Plaese log in for access to this page');
        res.redirect('/users/login');
    }

module.exports = authenticate;