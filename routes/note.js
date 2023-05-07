const express = require("express");

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");

const router = express.Router();

//Type API
router.get("/type", authController.authenticate, noteController.getAllType);
router.get("/type-pagination", authController.authenticate, noteController.getTypePagination);
router.get(
  "/type/:id",
  authController.authenticate,
  noteController.getTypeById
);
router.post(
  "/type/add-new",
  authController.authenticate,
  noteController.postAddType
);
router.patch(
  "/type/:id",
  authController.authenticate,
  noteController.patchEditTypeById
);
router.delete(
  "/type/:id",
  authController.authenticate,
  noteController.deleteTypeById
);

//Note API
router.get("/note", authController.authenticate, noteController.getAllNote);
router.get(
  "/note/:id",
  authController.authenticate,
  noteController.getNoteById
);
router.post(
  "/note/add-new",
  authController.authenticate,
  noteController.postAddNote
);
router.patch(
  "/note/:id",
  authController.authenticate,
  noteController.patchEditNoteById
);
router.delete(
  "/note/:id",
  authController.authenticate,
  noteController.deleteNoteById
);

//Utilites

module.exports = router;
