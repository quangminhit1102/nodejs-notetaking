require("dotenv").config(); // .Env config

const express = require("express"); // ExpressJs
const path = require("path"); // Path
const router = express.Router(); // Router
const session = require("express-session"); // Express-Session

const app = express(); // App Instance
const MongoDBStore = require("connect-mongodb-session")(session); //Connect Mongodb Session
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
mongoose.connect(process.env.MOOGOOSE_CONNECTION);


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

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let roomData = [[],[]]
io.on('connection', (socket) => {
  socket.on("join-room",(roomId,userId)=>{
      socket.join(roomId);
      console.log(`${userId} connected!`);
      roomData[0].push(socket.id)
      roomData[1].push(roomId)
      socket.on('send-object', function (objectJSON) {
        socket.to(roomId).emit('get-object', objectJSON)
    })
  })
  
});
// let roomData = [[],[]]
// //socket IO connection
// io.on("connection",socket=>{
//   socket.on("join-room",(roomId,userId)=>{
//       socket.join(roomId);
//       console.log(`${userId} connected!`);
//       data[0].push(socket.id)
//       data[1].push(roomId)
//   })
//   let userData = socket.id + "-" + roomID;
//   io.to(socket.id).emit('User Connected', userData);
//   socket.on('send-object', function (objectJSON) {
//       socket.to(roomId).emit('get object', objectJSON)
//   })
//   socket.on('send-command', function (command) {
//       socket.to(roomId).emit('get command', command)
//   })
//   socket.on('disconnect', () => {
//       socket.to(roomID).emit('user-disconnected', userID)
//       let user = data[0].indexOf(socket.id)
//       let room = data[1].indexOf(roomId)
//       data[0].splice(user, 1)
//       data[1].splice(room, 1)
//   })
// })


//404 Not Found
app.use((req, res, next) => {
  res.render("../views/error/404");
});

// Listening TO PORT
server.listen(process.env.PORT, () => {
  console.log(`App listening to PORT: ${process.env.PORT}`);
});
