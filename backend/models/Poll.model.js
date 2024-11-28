const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  pollTitle: { type: String, required: true },
  pollDescription: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["video", "image", "question"],
  },
  points: {
    type: Number,
    default: 0,
  },
  videoFiles: [
    {
      fileName: { type: String },
      url: { type: String },
      filePath: { type: String },
    },
  ],
  imageFiles: [
    {
      fileName: { type: String },
      url: { type: String },
      filePath: { type: String },
    },
  ],
  dueDate: {
    type: Date,
    required: true,
  },
  questions: [
    {
      question: { type: String },
      options: [{ type: String }],
    },
  ],
  status: { type: String, default: "active", enum: ["active", "inactive"] },
  createdAt: { type: Date, default: Date.now },
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
