const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

const {
  getSauces,
  getSauce,
  createSauce,
  updateSauce,
  deleteSauce,
  updateSauceLikes,
} = sauceCtrl;

router.get("/", auth, getSauces);
router.get("/:id", auth, getSauce);
router.post("/", auth, multer, createSauce);
router.put("/:id", auth, multer, updateSauce);
router.delete("/:id", auth, deleteSauce);
router.post("/:id/like", auth, updateSauceLikes);

module.exports = router;
