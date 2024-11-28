const express = require("express");
const { userLogin } = require("../controller/user.controller");
const router = express.Router();

router.post("/", userLogin);

module.exports = router;
