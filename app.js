require("dotenv").config(); // .Env config

const express = require("express"); // ExpressJs
const path = require("path"); // Path
const router = express.Router(); // Router
const session = require("express-session"); // Express-Session
const app = express(); // App Instance
const MongoDBStore = require("connect-mongodb-session")(session);
app.use(express.static(path.join(__dirname, "public")));
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
const store = new MongoDBStore({
  uri: process.env.MOOGOOSE_CONNECTION,
  collection: "sessions",
});

app.set("view engine", "ejs"); // View Engine
app.set("views", "views"); // Set views Folder
app.use(express.static(__dirname + "/public/"));
// console.log(__dirname + "/public/assets/");
app.use(express.urlencoded({ extended: true })); //It parses incoming requests with urlencoded payloads
const flash = require("connect-flash");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/notetakingapp");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    maxAge:"7d",
  })
);
app.use(flash());

// Routes
const authRoutes = require("./routes/authentication");
const homeRoutes = require("./routes/home");
const noteRoutes = require("./routes/note");

app.use(authRoutes);
app.use(homeRoutes);
app.use(noteRoutes);

// Check Session Login
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

//404 Not Found
app.use((req, res, next) => {
  res.render("../views/error/404");
});

// Listening TO PORT
app.listen(process.env.PORT, () => {
  console.log(`App listening to PORT: ${process.env.PORT}`);
});
