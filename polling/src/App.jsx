import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Createpoll from "./pages/Createpoll";
import Navbar from "./components/Navbar";
import AllPolls from "./pages/AllPolls";
import PollDetails from "./pages/PollDetails";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Define routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/create-poll" element={<Createpoll />} />
        <Route path="/view-polls" element={<AllPolls />} />
        <Route path="/poll" element={<PollDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
