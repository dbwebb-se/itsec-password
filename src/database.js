const sqlite3 = require("sqlite3").verbose();
const restore = require("./restore");
const db = new sqlite3.Database("db/login.db");

const fetchOneUser = function(id) {
    return new Promise((resolve, reject) => {
        let stmt = "SELECT * FROM users WHERE id = " + id;

        db.get(stmt, [], (error, result) => {
            if (error) {
                console.log(error);
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

    let stmtString = `
        UPDATE users
        SET username='${username}',
            password='${password}',
            admin='${admin}'
        WHERE id=${id}
    `;

    let stmt = db.prepare(stmtString);

    stmt.run([], (error) => {
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

    let stmtString = `
        DELETE FROM users
        WHERE id=${id}
    `;

    let stmt = db.prepare(stmtString);

    stmt.run([], (error) => {
        if (error) {
            console.error(error);
            res.redirect("/?feedback=unsucessful");
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

module.exports = {
    restoreDatabase: restoreDatabase,
    fetchOneUser: fetchOneUser,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};
