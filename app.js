const express = require("express");
const database = require("./src/database");
const render = require("./src/render");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.set("view engine", "pug");

app.use("/fontawesome", express.static(__dirname + "/node_modules/@fortawesome/fontawesome-free"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

app.use("/style", express.static(__dirname + "/style"));
app.use("/img", express.static(__dirname + "/img"));

app.get("/", (req, res) => render.listUsers(req, res));
app.get("/login", (req, res) => res.render("login"));

app.get("/user/remove/:id", (req, res) => render.removeUser(req, res));
app.post("/user/remove/:id", (req, res) => database.removeUser(req, res));

app.get("/user/update/:id", (req, res) => render.updateUser(req, res));
app.post("/user/update/:id", (req, res) => database.updateUser(req, res));

app.get("/user/create", (req, res) => render.createUserForm(req, res));
app.post("/user/create", (req, res) => render.createUser(req, res));

app.get("/database/restore", (req, res) => database.restoreDatabase(req, res));
