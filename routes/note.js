const express = require("express");

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");

const router = express.Router();

//Type API
router.get("/type", noteController.getAllType);
router.get("/type/:id", noteController.getTypeById);
router.post("/type/add-new", noteController.postAddType);
router.patch("/type/:id", noteController.patchEditTypeById);
router.delete("/type/:id", noteController.deleteTypeById);

//Note API
router.get("/note", noteController.getAllNote);
router.get("/note/:id", noteController.getNoteById);
router.post("/note/add-new", noteController.postAddNote);
router.patch("/note/:id", noteController.patchEditNoteById);
router.delete("/note/:id", noteController.deleteNoteById);

//Utilites

module.exports = router;
