import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../Slices/pollSlice";
import { useDispatch } from "react-redux";

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const [leaderboard, setLeaderboard] = useState({});
  console.log("leaderboard", leaderboard);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const action = await dispatch(getLeaderboard()); // Wait for the result
        setLeaderboard(action.payload);

        console.log("Leaderboard Data: ", action.payload);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
      }
    };

    fetchLeaderboard();
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState("allTime");

  const renderLeaderboardEntries = (entries) => {
    if (!Array.isArray(entries)) {
      return <p>No data available</p>; // Or handle the error as needed
    }
    return entries.map((entry, index) => (
      <div
        key={index}
        className="w-full py-4 px-4 border-b last:border-b-0 hover:bg-purple-50 transition duration-200"
      >
        <table className="w-full table-auto text-center">
          <thead className="text-black">
            <tr>
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Avatar</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-purple-50 transition duration-200">
              <td className="py-2 px-4 text-lg font-semibold text-purple-700">
                {index + 1}
              </td>
              <td className="py-2 px-4 ">
                <img
                  src={entry?.avatar || "default-avatar-url"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-purple-300 mx-auto object-cover"
                />
              </td>
              <td className="py-2 px-4 text-lg font-medium text-gray-800">
                {entry?.name}
              </td>
              <td className="py-2 px-4 text-lg font-bold text-purple-600">
                {entry?.points || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-10">
        🌟 Leaderboard
      </h1>
      <div className="bg-white shadow-lg rounded-xl max-w-4xl mx-auto overflow-hidden">
        {/* Tabs */}
        <div className="flex bg-purple-600">
          <button
            onClick={() => setActiveTab("allTime")}
            className={`flex-1 py-3 text-center text-white font-medium transition duration-300 ${
              activeTab === "allTime"
                ? "bg-purple-700 shadow-lg"
                : "hover:bg-purple-500"
            }`}
          >
            All-time
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-3 text-center text-white font-medium transition duration-300 ${
              activeTab === "monthly"
                ? "bg-purple-700 shadow-lg"
                : "hover:bg-purple-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`flex-1 py-3 text-center text-white font-medium transition duration-300 ${
              activeTab === "yearly"
                ? "bg-purple-700 shadow-lg"
                : "hover:bg-purple-500"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-3 text-center text-white font-medium transition duration-300 ${
              activeTab === "weekly"
                ? "bg-purple-700 shadow-lg"
                : "hover:bg-purple-500"
            }`}
          >
            Weekly
          </button>
        </div>
        {/* Content */}
        <div className="p-6 bg-gray-50">
          {activeTab === "allTime" &&
            renderLeaderboardEntries(leaderboard?.allTime)}
          {activeTab === "monthly" &&
            renderLeaderboardEntries(leaderboard?.monthly)}
          {activeTab === "yearly" &&
            renderLeaderboardEntries(leaderboard?.yearly)}
          {activeTab === "weekly" &&
            renderLeaderboardEntries(leaderboard?.weekly)}
        </div>
      </div>
    </div>
  );
}
