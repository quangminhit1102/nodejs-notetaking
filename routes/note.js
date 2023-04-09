const express = require("express");

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/type", noteController.getAllType);
router.post("/type/add-new", noteController.postAddType);
router.get("/type/:id", noteController.getTypeById);
router.post("/type/:id", noteController.postEditTypeById);
router.delete("/type/:id", noteController.deleteTypeById);

module.exports = router;
