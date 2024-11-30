import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className=" text-white bg-white top-0 sticky shadow-md z-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="text-2xl text-purple-500 font-bold">
              <Link to="/">HR Polls</Link>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-4">
            <button className="px-4 py-2 text-black hover:bg-gray-100 font-semibold hover:back rounded">
              <Link to="/view-polls">View Polls</Link>
            </button>
            <button className="px-4 py-2 text-black hover:bg-gray-100 font-semibold hover:back rounded">
              <Link to="/leaderboard">Leaderboard</Link>
            </button>
            <button className="px-4 py-2 text-black hover:bg-gray-100 font-semibold hover:back rounded">
              <Link to="/credit-point">Manage Credits</Link>
            </button>

            <button className="px-4 py-2 text-black font-semibold border bg-gray-100  rounded">
              <Link to="/create-poll">Create Poll</Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for the hamburger menu */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (hidden by default, toggle based on state) */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button className="block px-4 py-2 hover:bg-gray-500 rounded w-full text-left">
            View Polls
          </button>
          <button className="block px-4 py-2 rounded  w-full text-left">
            Create Poll
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
