const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    userId: {
      // jinhone vote kiya hai
      type: Number,
      required: true,
    },
    response: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "responseType",
    },
    responseType: {
      type: String,
      required: true,
      enum: ["Poll.questions.options", "Poll.videoFiles", "Poll.imageFiles"],
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
    votedFor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

voteSchema.index({ pollId: 1, userId: 1 }, { unique: true }); // Ensures a user can vote only once per poll

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
