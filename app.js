const express = require("express");
const session = require("express-session");
const database = require("./src/database");
const render = require("./src/render");
const auth = require("./src/auth");

const app = express();
const port = 3000;

app.use(session({
    secret: 'a very good secret',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Set to false to disable authentication throughout the application
app.locals.authentication = true;
// And specify dummy user data here
app.locals.dummyUser = {
    id: 9000,
    username: "SuperHacker",
    password: "sh1",
    admin: 1
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.info(`Example app listening on port ${port}!`));
app.set("view engine", "ejs");

app.use("/fontawesome", express.static(__dirname + "/node_modules/@fortawesome/fontawesome-free"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

app.use("/style", express.static(__dirname + "/style"));
app.use("/img", express.static(__dirname + "/img"));

app.get("/", auth.isAuthenticated, (req, res) => render.listUsers(req, res));

app.get("/login", (req, res) => render.login(req, res));
app.post("/login", (req, res) => auth.login(req, res));

app.get("/logout", auth.isAuthenticated, (req, res) => auth.logout(req, res));

app.get("/user/remove/:id", auth.isAdmin, (req, res) => render.removeUser(req, res));
app.post("/user/remove/:id", auth.isAdmin, (req, res) => database.removeUser(req, res));

app.get("/user/update/:id", auth.isAdmin, (req, res) => render.updateUser(req, res));
app.post("/user/update/:id", auth.isAdmin, (req, res) => database.updateUser(req, res));

app.get("/user/create", auth.isAdmin, (req, res) => render.createUserForm(req, res));
app.post("/user/create", auth.isAdmin, (req, res) => render.createUser(req, res));

app.get("/database/restore", (req, res) => database.restoreDatabase(req, res));
