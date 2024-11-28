const User = require("../models/User.model");

const userLogin = async (req, res) => {
  console.log("req.body", req.body);

  try {
    const user = await User.create(req.body);
    res.json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
};

module.exports = {
  userLogin,
};
