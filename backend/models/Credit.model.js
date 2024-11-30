const mongoose = require("mongoose");
const { Schema } = mongoose;

const userPointsSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    operation: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserPoints = mongoose.model("UserPoints", userPointsSchema);

module.exports = UserPoints;
