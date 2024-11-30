// // const Poll = require("../models/Poll.model.js");
// // const updateExpiredPolls = async () => {
// //   try {
// //     const now = new Date();

// //     const expiredPolls = await Poll.updateMany(
// //       { dueDate: { $lte: now }, status: "active" },
// //       { $set: { status: "inactive" } }
// //     );

// //     console.log(`${expiredPolls.modifiedCount} polls marked as inactive.`);
// //   } catch (error) {
// //     console.error("Error updating expired polls:", error);
// //   }
// // };

// // module.exports = { updateExpiredPolls };

const mongoose = require("mongoose");
const Poll = require("../models/Poll.model.js");
const User = require("../models/User.model.js"); // Assuming the User model is imported here
const UserPoints = require("../models/Credit.model.js");
const Vote = require("../models/Vote.model.js");

const updateExpiredPolls = async () => {
  const now = Date.now();
  try {
    const expiredPolls = await Poll.find({
      dueDate: { $lte: now },
      status: "active",
    });

    console.log("expiredPolls", expiredPolls);

    const users = await User.find({});

    console.log("users", users);
    // return;

    for (const poll of expiredPolls) {
      const pollVotes = await Vote.find({ pollId: poll._id });
      console.log("pollVotes", pollVotes);
      let pollDataParticipants = [];

      if (poll.type === "image") {
        const imageParticipants = poll.imageFiles; // Assumes the poll type is image
        const fileNames = imageParticipants.map((image) => image.fileName);

        // Normalize image file names (remove extension, remove spaces, convert to lowercase)
        const processedNames = fileNames.map((fileName) =>
          fileName.split(".")[0].replace(/\s+/g, "").toLowerCase()
        );

        console.log("processedNames", processedNames);

        // Find matching users for the poll participants
        const participantsArray = users.filter((user) => {
          const processedFullName = user.full_Name
            .replace(/\s+/g, "")
            .toLowerCase();
          return processedNames.includes(processedFullName);
        });

        console.log("participantsArray", participantsArray);

        // For each participant, get the votes they received
        for (const participant of participantsArray) {
          const participantName = participant.full_Name
            .replace(/\s+/g, "")
            .toLowerCase();

          // Filter votes for the participant (normalize the votedFor value)
          const participantVotes = pollVotes.filter((vote) => {
            const processedVotedFor = vote.votedFor
              .split(".")[0]
              .replace(/\s+/g, "")
              .toLowerCase();
            return processedVotedFor === participantName;
          });

          console.log("participantVotesnew", participantVotes);

          // Find if the participant already exists in the pollDataParticipants array
          const existingParticipant = pollDataParticipants.find(
            (data) =>
              data.user.full_Name.replace(/\s+/g, "").toLowerCase() ===
              participantName
          );

          if (existingParticipant) {
            // If the participant exists, simply add the votes
            existingParticipant.votes.push(...participantVotes);
          } else {
            // Otherwise, create a new entry for the participant
            pollDataParticipants.push({
              user: participant,
              votes: participantVotes,
            });
          }
        }
      }

      // Example: Do something with the pollDataParticipants (e.g., give credits)
      for (const participant of pollDataParticipants) {
        const totalVotes = participant.votes.length;
        console.log(`${participant.user.full_Name} has ${totalVotes} votes.`);
        await participant.user.updateOne({
          creditPoints:
            participant.user.creditPoints + totalVotes * poll.points,
        });

        console.log("participant", participant);
        console.log("poll", poll);
        await UserPoints.create({
          userId: participant.user.user_Id,
          points: participant.votes.length * poll.points,
          operation: "add",
          reason: "Poll votes",
        });
      }

      // Mark the poll as inactive after processing
      await Poll.updateOne({ _id: poll._id }, { $set: { status: "inactive" } });
      console.log(`Poll ${poll._id} marked as inactive.`);
      console.log("Poll Data Participants:", pollDataParticipants);
    }
  } catch (error) {
    console.error("Error updating expired polls:", error);
  }
};

module.exports = { updateExpiredPolls };
