const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userrouter = require("./routes/user.router.js");
const pollrouter = require("./routes/poll.router.js");
const voterouter = require("./routes/vote.router.js");
const path = require("path");
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
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/user", userrouter);
app.use("/api/poll", pollrouter);
app.use("/api/vote", voterouter);

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
