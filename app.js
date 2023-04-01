// .Env config
require("dotenv").config();

// ExpressJs
const express = require("express");
const router = express.Router();

const app = express();

app.use((req, res, next) => {
  res.send("<h1>Hello World</h1>");
});
app.listen(3000);
