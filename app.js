// .Env config
require("dotenv").config();

const express = require("express"); // ExpressJs
const router = express.Router(); // Router
const app = express(); // App Instance
app.use(express.urlencoded({ extended: true })); //It parses incoming requests with urlencoded payloads
app.set("view engine", "ejs"); // View Engine
app.set("views", "views"); // Set views Folder

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/notetakingapp");

const User = require("./model/user");

User.create(
  {
    email: "minh@gmail.com",
    password: "123456",
  }
).then(err=>{
  console.log(err);
})

app.use((req, res, next) => {
  res.send("dsfsdfsd");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening to PORT: ${process.env.PORT}`);
});
