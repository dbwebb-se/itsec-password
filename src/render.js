const sqlite3 = require("sqlite3").verbose();
const database = require("./database");
const db = new sqlite3.Database("db/login.db");

const listUsers = function (req, res) {
    let feedback = req.query.feedback != undefined ? req.query.feedback : null;

    db.all("SELECT * FROM users", function (err, row) {
        if (row == undefined) {
            row = [];
        }

        res.render("user/listUsers", {
            data: row,
            user: "Admin",
            title: "List all users",
            feedback: feedback
        });
    });
};

const createUserForm = function (req, res) {
    res.render("user/createUser", {
        title: "Create User",
        feedback: null
    });
};

const createUser = function (req, res) {
    database.createUser(req.body.username, req.body.password)
        .then(() => {
            res.render("user/createUser", {
                title: "Create User",
                feedback: "successful"
            });
        })
        .catch((error) => {
            console.error(error);
            res.render("user/createUser", {
                title: "Create User",
                feedback: "unsuccessful"
            });
        });
};

const updateUser = async function (req, res) {
    let feedback = req.query.feedback != undefined ? req.query.feedback : null;

    database.fetchOneUser(req.params.id)
        .then((user) => {
            res.render("user/updateUser", {
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
            res.render("user/removeUser", {
                title: "Remove User",
                user: user
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = {
    listUsers: listUsers,
    createUserForm: createUserForm,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};
