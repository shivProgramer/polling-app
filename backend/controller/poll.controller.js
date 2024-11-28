const { createSuccess } = require("../message.js");
const Poll = require("../models/Poll.model.js");

const createPoll = async (req, res) => {
  try {
    console.log("register", req.files);
    const {
      pollTitle,
      pollDescription,
      type,
      status,
      points,
      questions,
      dueDate,
    } = req.body;
    let videoFiles = [];
    let imageFiles = [];

    if (req.files) {
      console.log("req.files", req.customFileArray);
      if (type === "image") {
        imageFiles = req.customFileArray.map((file) => ({
          fileName: file.originalname,
          url: file.path,
          filePath: file.pathName,
        }));
      } else if (type === "video") {
        videoFiles = req.customFileArray.map((file) => ({
          fileName: file.originalname,
          url: file.path,
          filePath: file.pathName,
        }));
      }
    }

    console.log("image files", videoFiles);

    // Create a new poll
    const newPoll = new Poll({
      pollTitle,
      pollDescription,
      type,
      points,
      status,
      videoFiles,
      imageFiles,
      questions,
      dueDate,
    });

    // Save the poll to the database
    const savedPoll = await newPoll.save();

    res
      .status(201)
      .json(
        createSuccess({ msg: "Poll created successfully", data: savedPoll })
      );
  } catch (error) {
    console.error("Error creating poll:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create poll", error });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res
      .status(201)
      .json(createSuccess({ msg: "Poll fetched successfully", data: polls }));
  } catch (error) {
    console.error("Error fetching polls:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch polls", error });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    console.log("poll", poll);
    res
      .status(201)
      .json(createSuccess({ msg: "Poll fetched successfully", data: poll }));
  } catch (error) {
    console.log("error", error);
  }
};

// Delete a poll by ID
const deletePoll = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPoll = await Poll.findByIdAndDelete(id);
    if (!deletedPoll) {
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    }
    res.status(201).json(createSuccess({ msg: "Poll deleted successfully" }));
  } catch (error) {
    console.error("Error deleting poll:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete poll", error });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  deletePoll,
  getPollById,
};
