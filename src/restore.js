const sqlite3 = require("sqlite3").verbose();
const userData = require("./../db/data.json");
const db = new sqlite3.Database("db/login.db");

const dropUsers = function () {
    return new Promise((resolve, reject) => {
        db.run("DROP TABLE IF EXISTS users", [], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const createUserTable = function () {
    return new Promise((resolve, reject) => {
        let userTable = "CREATE TABLE users (";

        userTable += "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,";
        userTable += "username	TEXT NOT NULL UNIQUE,";
        userTable += "password TEXT NOT NULL,";
        userTable += "admin INTEGER NOT NULL)";

        db.run(userTable, [], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const createUsers = function () {
    return new Promise((resolve, reject) => {
        let stmt = db.prepare("INSERT INTO users (username, password, admin) VALUES (?, ?, ?)");

        userData["users"].forEach(user => {
            stmt.run(user.username, user.password, user.admin);
            console.log("Added user: " + user.username + " with password: " + user.password + " and admin level: " + user.admin);
        });

        stmt.finalize((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    dropUsers: dropUsers,
    createUserTable: createUserTable,
    createUsers: createUsers
};
