const database = require("./database");

const isAuthenticated = function (req, res, next) {
    if (req.app.locals.authentication) {
        if (!req.session.user) {
            res.redirect("/login");
        } else {
            return next();
        }
    } else {
        if (!req.session.user) {
            req.session.user = req.app.locals.dummyUser;
        }

        return next();
    }
};

const isAdmin = function (req, res, next) {
    if (req.app.locals.authentication) {
        if (req.session.user == undefined) {
            res.redirect("/login");
            return;
        }

        if (req.params.id == req.session.user.id) {
            return next();
        } else if (req.session.user.admin) {
            return next();
        }

        res.redirect("/");
    } else {
        if (!req.session.user) {
            req.session.user = req.app.locals.dummyUser;
        }

        return next();
    }
};

const login = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    database.verifyLogin(username, password)
        .then((result) => {
            req.session.user = result;

            res.redirect("/");
        })
        .catch((error) => {
            console.error(error);
            res.redirect("/login?login=unsuccessful");
        });
};

const logout = function (req, res) {
    req.session.destroy();
    res.redirect("/login");
};

module.exports = {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    login: login,
    logout: logout
};
