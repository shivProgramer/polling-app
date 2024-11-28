const express = require("express");
const {
  createPoll,
  getAllPolls,
  deletePoll,
  getPollById,
} = require("../controller/poll.controller");
const upload = require("../middleware/multer.js");
const videoUpload = require("../middleware/videomulter.js");
const router = express.Router();

router.post("/createImagePoll", upload, createPoll);
router.post("/createVideoPoll", videoUpload, createPoll);
router.post("/createQuesPoll", createPoll);

router.get("/getAllPolls", getAllPolls);
router.get("/getPollById/:pollId", getPollById);
router.delete("/deletePoll", deletePoll);

module.exports = router;
