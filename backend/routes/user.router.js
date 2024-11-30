const express = require("express");
const {
  userLogin,
  getAllUsers,
  updateCredits,
  getLeaderboard,
} = require("../controller/user.controller");
const router = express.Router();

router.post("/", userLogin);
router.get("/getAllUsers", getAllUsers);
router.post("/modifyCredits", updateCredits);
router.get("/getLeaderboard", getLeaderboard);

module.exports = router;
