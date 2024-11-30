const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userrouter = require("./routes/user.router.js");
const pollrouter = require("./routes/poll.router.js");
const cron = require("./routes/updatePollStatus.js");
const voterouter = require("./routes/vote.router.js");
const path = require("path");
const User = require("./models/User.model.js");
const Vote = require("./models/Vote.model.js");
const Poll = require("./models/Poll.model.js");
const UserPoints = require("./models/Credit.model.js");
dotenv.config();

const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas", err);
  });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/user", userrouter);
app.use("/api/poll", pollrouter);
app.use("/api/vote", voterouter);

// const updateExpiredPolls = async () => {
//   const now = Date.now();
//   try {
//     const expiredPolls = await Poll.find({
//       dueDate: { $lte: now },
//       status: "active",
//     });

//     console.log("expiredPolls", expiredPolls);

//     const users = await User.find({});

//     console.log("users", users);
//     // return;

//     for (const poll of expiredPolls) {
//       const pollVotes = await Vote.find({ pollId: poll._id });
//       console.log("pollVotes", pollVotes);
//       let pollDataParticipants = [];

//       if (poll.type === "image") {
//         const imageParticipants = poll.imageFiles; // Assumes the poll type is image
//         const fileNames = imageParticipants.map((image) => image.fileName);

//         // Normalize image file names (remove extension, remove spaces, convert to lowercase)
//         const processedNames = fileNames.map((fileName) =>
//           fileName.split(".")[0].replace(/\s+/g, "").toLowerCase()
//         );

//         console.log("processedNames", processedNames);

//         // Find matching users for the poll participants
//         const participantsArray = users.filter((user) => {
//           const processedFullName = user.full_Name
//             .replace(/\s+/g, "")
//             .toLowerCase();
//           return processedNames.includes(processedFullName);
//         });

//         console.log("participantsArray", participantsArray);

//         // For each participant, get the votes they received
//         for (const participant of participantsArray) {
//           const participantName = participant.full_Name
//             .replace(/\s+/g, "")
//             .toLowerCase();

//           // Filter votes for the participant (normalize the votedFor value)
//           const participantVotes = pollVotes.filter((vote) => {
//             const processedVotedFor = vote.votedFor
//               .split(".")[0]
//               .replace(/\s+/g, "")
//               .toLowerCase();
//             return processedVotedFor === participantName;
//           });

//           console.log("participantVotesnew", participantVotes);

//           // Find if the participant already exists in the pollDataParticipants array
//           const existingParticipant = pollDataParticipants.find(
//             (data) =>
//               data.user.full_Name.replace(/\s+/g, "").toLowerCase() ===
//               participantName
//           );

//           if (existingParticipant) {
//             // If the participant exists, simply add the votes
//             existingParticipant.votes.push(...participantVotes);
//           } else {
//             // Otherwise, create a new entry for the participant
//             pollDataParticipants.push({
//               user: participant,
//               votes: participantVotes,
//             });
//           }
//         }
//       }

//       // Example: Do something with the pollDataParticipants (e.g., give credits)
//       for (const participant of pollDataParticipants) {
//         const totalVotes = participant.votes.length;
//         console.log(`${participant.user.full_Name} has ${totalVotes} votes.`);
//         await participant.user.updateOne({
//           creditPoints:
//             participant.user.creditPoints + totalVotes * poll.points,
//         });

//         console.log("participant", participant);
//         console.log("poll", poll);
//         await UserPoints.create({
//           userId: participant.user.user_Id,
//           points: participant.votes.length * poll.points,
//           operation: "add",
//           reason: "Poll votes",
//         });
//       }

//       // Mark the poll as inactive after processing
//       // await Poll.updateOne({ _id: poll._id }, { $set: { status: "inactive" } });
//       console.log(`Poll ${poll._id} marked as inactive.`);
//       console.log("Poll Data Participants:", pollDataParticipants);
//     }
//   } catch (error) {
//     console.error("Error updating expired polls:", error);
//   }
// };

// updateExpiredPolls();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
