const sqlite3 = require("sqlite3").verbose();
const restore = require("./restore");
const db = new sqlite3.Database("db/login.db");

const fetchOneUser = function(id) {
    return new Promise((resolve, reject) => {
        let stmt = "SELECT * FROM users WHERE id = ?";

        db.get(stmt, id, [], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const fetchAllUsers = function() {
    return new Promise((resolve, reject) => {
        let stmt = "SELECT * FROM users";

        db.all(stmt, [], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const createUser = function(username, password) {
    return new Promise((resolve, reject) => {
        let stmt = db.prepare("INSERT INTO users (username, password, admin) VALUES (?, ?, 0)");

        stmt.run(username, password, [], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const updateUser = function(req, res) {
    let id = req.params.id;
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    let stmt = db.prepare("UPDATE users SET username = ?, password = ?, admin = ? WHERE id = ?");

    stmt.run(username, password, admin, id, [], (error) => {
        if (error) {
            console.error(error);
            res.redirect("/user/update/" + id + "?feedback=unsucessful");
        } else {
            res.redirect("/user/update/" + id + "?feedback=successful");
        }
    });
};

const removeUser = function (req, res) {
    let id = req.params.id;

    let stmt = db.prepare("DELETE FROM users WHERE id = ?");

    stmt.run(id, [], (error) => {
        if (error) {
            console.error(error);
            res.redirect("/?feedback=unsuccessful");
        } else {
            res.redirect("/?feedback=successful");
        }
    });
};

const restoreDatabase = async function(req, res) {
    await restore.dropUsers();
    await restore.createUserTable();
    await restore.createUsers();

    res.render("restoredUsers", {
        title: "Restored Users"
    });
};

const verifyLogin = function (username, password) {
    return new Promise((resolve, reject) => {
        let stmt = "SELECT * FROM users WHERE username = ? AND password = ?";

        db.get(stmt, username, password, [], (error, result) => {
            if (result == undefined) {
                reject("Username or password is incorrect");
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    fetchOneUser: fetchOneUser,
    fetchAllUsers: fetchAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser,
    restoreDatabase: restoreDatabase,
    verifyLogin: verifyLogin
};
