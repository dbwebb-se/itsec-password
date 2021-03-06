const database = require("./database");

const login = function (req, res) {
    res.render("pages/login", {
        title: "Login",
        login: req.query.login
    });
};

const listUsers = function (req, res) {
    let feedback = req.query.feedback != undefined ? req.query.feedback : null;

    if (req.session.user.admin) {
        database.fetchAllUsers()
            .then((users) => {
                if (users == undefined) {
                    users = [];
                }

                res.render("pages/user/listUsers", {
                    users: users,
                    user: req.session.user.username,
                    title: "List all users",
                    feedback: feedback
                });
            });
    } else {
        database.fetchOneUser(req.session.user.id)
            .then((user) => {
                res.render("pages/user/listUsers", {
                    users: [user],
                    user: req.session.user.username,
                    title: "List user",
                    feedback: feedback
                });
            })
            .catch((error) => {
                console.error(error);
                res.render("pages/user/listUsers", {
                    users: [],
                    user: req.session.user.username,
                    title: "List user",
                    feedback: feedback
                });
            });
    }
};

const createUserForm = function (req, res) {
    res.render("pages/user/createUser", {
        title: "Create User",
        feedback: null
    });
};

const createUser = function (req, res) {
    database.createUser(req.body.username, req.body.password)
        .then(() => {
            res.render("pages/user/createUser", {
                title: "Create User",
                feedback: "successful"
            });
        })
        .catch((error) => {
            console.error(error);
            res.render("pages/user/createUser", {
                title: "Create User",
                feedback: "unsuccessful"
            });
        });
};

const updateUser = async function (req, res) {
    let feedback = req.query.feedback != undefined ? req.query.feedback : null;

    database.fetchOneUser(req.params.id)
        .then((user) => {
            res.render("pages/user/updateUser", {
                title: "Update User",
                user: user,
                feedback: feedback
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

const removeUser = function (req, res) {
    database.fetchOneUser(req.params.id)
        .then((user) => {
            res.render("pages/user/removeUser", {
                title: "Remove User",
                user: user
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = {
    login: login,
    listUsers: listUsers,
    createUserForm: createUserForm,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};
