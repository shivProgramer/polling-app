import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Createpoll from "./pages/Createpoll";
import Navbar from "./components/Navbar";
import AllPolls from "./pages/AllPolls";
import PollDetails from "./pages/PollDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import LeaderboardPage from "./pages/LeaderBoars";
import CreditPointsPage from "./pages/Points";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-poll" element={<Createpoll />} />
          <Route path="/view-polls" element={<AllPolls />} />
          <Route path="/poll" element={<PollDetails />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/credit-point" element={<CreditPointsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
