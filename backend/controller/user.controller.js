const UserPoints = require("../models/Credit.model");
const User = require("../models/User.model");

const userLogin = async (req, res) => {
  console.log("req.body", req.body);

  try {
    const exist = await User.findOne({ user_Id: req.body.user_id });
    if (exist) {
      return res.status(201).json({ msg: "User already exists", data: exist });
    } else {
      const user = await User.create(req.body);
      return res
        .status(201)
        .json({ msg: "User created successfully", data: user });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
};

const updateCredits = async (req, res) => {
  try {
    const { username, points, operation, reason } = req.body;
    const user = await User.findOne({ user_Id: parseInt(username) });
    if (user) {
      const currentPoints = parseInt(user.creditPoints);
      if (operation === "add") {
        user.creditPoints = currentPoints + parseInt(points);
      } else if (operation === "reduce") {
        user.creditPoints = currentPoints - parseInt(points);
      } else {
        return res.status(400).json({ message: "Invalid operation" });
      }
      await user.save();
    }

    const credit = await UserPoints.create({
      userId: username,
      points: parseInt(points),
      operation,
      reason,
    });

    return res
      .status(201)
      .json({ message: "Credits updated successfully", data: credit });
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(201).json({ message: "Users fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    // Get the current date (in UTC format to avoid timezone issues)
    const currentDate = new Date();

    // Helper function to calculate the start date for the respective time frames
    const getDateRange = (period) => {
      switch (period) {
        case "monthly":
          return new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        case "weekly":
          return new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        case "yearly":
          return new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000); // 365 days ago
        default:
          return new Date(0); // All-time (start of epoch)
      }
    };

    // Fetch all user points for different time periods (monthly, weekly, yearly)
    const userPoints = await UserPoints.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            operation: "$operation",
          },
          totalPoints: {
            $sum: {
              $cond: [
                { $eq: ["$operation", "add"] },
                "$points",
                {
                  $cond: [
                    { $eq: ["$operation", "reduce"] },
                    { $multiply: ["$points", -1] },
                    0,
                  ],
                },
              ],
            },
          },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          userId: "$_id.userId",
          operation: "$_id.operation",
          totalPoints: 1,
          createdAt: 1,
          _id: 0,
        },
      },
      {
        $match: {
          createdAt: { $gte: getDateRange("yearly") }, // Fetch for the year onwards
        },
      },
      {
        $sort: { totalPoints: -1 }, // Sort points in descending order
      },
    ]);

    // Aggregate user credit points to handle user initial points (non-changeable data)
    const users = await User.aggregate([
      {
        $match: { user_Id: { $in: userPoints.map((u) => u.userId) } },
      },
      {
        $project: {
          userId: "$user_Id",
          creditPoints: 1,
          createdOn: 1,
        },
      },
    ]);

    // Now, combine both userPoints and creditPoints data
    const userPointsMap = {
      allTime: {},
      monthly: {},
      weekly: {},
      yearly: {},
    };

    // Populate the userPointsMap with userPoints data
    userPoints.forEach((entry) => {
      const { userId, totalPoints, createdAt } = entry;
      const createdAtDate = new Date(createdAt);
      // Update monthly points
      if (createdAtDate >= getDateRange("monthly")) {
        if (!userPointsMap.monthly[userId]) userPointsMap.monthly[userId] = 0;
        userPointsMap.monthly[userId] += totalPoints;
      }

      // Update weekly points
      if (createdAtDate >= getDateRange("weekly")) {
        if (!userPointsMap.weekly[userId]) userPointsMap.weekly[userId] = 0;
        userPointsMap.weekly[userId] += totalPoints;
      }

      // Update yearly points
      if (createdAtDate >= getDateRange("yearly")) {
        if (!userPointsMap.yearly[userId]) userPointsMap.yearly[userId] = 0;
        userPointsMap.yearly[userId] += totalPoints;
      }
    });

    // Populate userPointsMap with creditPoints from the users collection
    users.forEach((user) => {
      const userId = user.userId;

      // Add User creditPoints to all-time points
      if (!userPointsMap.allTime[userId]) userPointsMap.allTime[userId] = 0;
      userPointsMap.allTime[userId] += user.creditPoints;

      // Add User creditPoints to monthly points if within the last month
      if (new Date(user.createdOn) >= getDateRange("monthly")) {
        if (!userPointsMap.monthly[userId]) userPointsMap.monthly[userId] = 0;
        userPointsMap.monthly[userId] += user.creditPoints;
      }

      // Add User creditPoints to weekly points if within the last 7 days
      if (new Date(user.createdOn) >= getDateRange("weekly")) {
        if (!userPointsMap.weekly[userId]) userPointsMap.weekly[userId] = 0;
        userPointsMap.weekly[userId] += user.creditPoints;
      }

      // Add User creditPoints to yearly points if within the last year
      if (new Date(user.createdOn) >= getDateRange("yearly")) {
        if (!userPointsMap.yearly[userId]) userPointsMap.yearly[userId] = 0;
        userPointsMap.yearly[userId] += user.creditPoints;
      }
    });

    // Prepare the leaderboard data by sorting users' points
    const leaderboard = {
      allTime: Object.keys(userPointsMap.allTime)
        .map((userId) => ({ userId, points: userPointsMap.allTime[userId] }))
        .sort((a, b) => b.points - a.points),

      monthly: Object.keys(userPointsMap.monthly)
        .map((userId) => ({ userId, points: userPointsMap.monthly[userId] }))
        .sort((a, b) => b.points - a.points),

      weekly: Object.keys(userPointsMap.weekly)
        .map((userId) => ({ userId, points: userPointsMap.weekly[userId] }))
        .sort((a, b) => b.points - a.points),

      yearly: Object.keys(userPointsMap.yearly)
        .map((userId) => ({ userId, points: userPointsMap.yearly[userId] }))
        .sort((a, b) => b.points - a.points),
    };

    // Fetch user details to get names (to be added in leaderboard)
    const finalLeaderboard = {};
    for (let period of ["allTime", "monthly", "weekly", "yearly"]) {
      finalLeaderboard[period] = await Promise.all(
        leaderboard[period].map(async (entry) => {
          const user = await User.findOne({ user_Id: entry.userId });
          return {
            name: user.full_Name,
            points: entry.points,
            userId: entry.userId,
          };
        })
      );
    }

    // Return the leaderboard
    return res.status(200).json(finalLeaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  userLogin,
  getAllUsers,
  updateCredits,
  getLeaderboard,
};
