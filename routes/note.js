const express = require("express");

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");

const router = express.Router();

//Type
router.get("/type", noteController.getAllType);
router.post("/type/add-new", noteController.postAddType);
router.get("/type/:id", noteController.getTypeById);
router.post("/type/:id", noteController.postEditTypeById);
router.delete("/type/:id", noteController.deleteTypeById);

//Note
router.get("/note", noteController.getAllNote);
router.post("/note/add-new", noteController.postAddNote);

module.exports = router;
