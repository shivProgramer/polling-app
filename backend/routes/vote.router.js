const express = require("express");
const router = express.Router();
const voteController = require("../controller/vote.controller.js");

router.post("/votes", voteController.createVote);
router.get("/votes/poll/:pollId", voteController.getVotesByPoll);
router.post("/votes/user", voteController.getVotesByUser);
router.delete("/votes/:voteId", voteController.deleteVote);

module.exports = router;
