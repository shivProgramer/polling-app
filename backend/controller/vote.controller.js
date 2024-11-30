const Vote = require("../models/Vote.model.js");
const Poll = require("../models/Poll.model.js");

const createVote = async (req, res) => {
  const { pollId, userId, response, responseType, votedFor } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    }

    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted",
      });
    }

    const newVote = new Vote({
      pollId,
      userId,
      response,
      responseType,
      votedFor,
    });

    await newVote.save();
    return res
      .status(201)
      .json({ success: true, message: "Vote submitted", data: newVote });
  } catch (error) {
    console.error("Error creating vote:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get votes for a poll
const getVotesByPoll = async (req, res) => {
  const { pollId } = req.params;

  try {
    // Find all votes for the given poll
    const votes = await Vote.find({ pollId }).populate(
      "userId",
      "first_Name last_Name email"
    );
    return res.status(200).json({ success: true, data: votes });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all votes by a user
const getVotesByUser = async (req, res) => {
  const { userId, pollId } = req.body;

  try {
    // Find all votes by the given user
    const votes = await Vote.find({ userId, pollId: pollId });
    return res.status(200).json({ success: true, data: votes });
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete a vote
const deleteVote = async (req, res) => {
  const { voteId } = req.params;

  try {
    // Find and delete the vote
    const vote = await Vote.findByIdAndDelete(voteId);
    if (!vote) {
      return res
        .status(404)
        .json({ success: false, message: "Vote not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Vote deleted successfully" });
  } catch (error) {
    console.error("Error deleting vote:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createVote,
  getVotesByPoll,
  getVotesByUser,
  deleteVote,
};
