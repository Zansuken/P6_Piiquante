const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const { signup, login } = userCtrl;

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
