import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col pt-20 items-center text-center mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to HR Polling</h1>
        <p className="mb-6 text-xl font-semibold">
          Engage with your colleagues and share your opinions on important
          workplace matters.
        </p>

        <Link to="/view-polls?type=active">
          <button className="bg-gray-800 hover:bg-gray-600 ease-in duration-200 text-white px-7 py-3 rounded-xl">
            View active polls
          </button>
        </Link>
        <img
          className="mt-24"
          src="https://imgs.search.brave.com/7SeBzJWACSTylR1uoGnpfwYCEJLpdMpS5A6AtXlAhpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5jaW1hZ2VzLmNv/bS91cGxvYWRlZF9m/aWxlcy9pbWFnZS8x/OTIweDEwODAvZ2V0/dHlfMTQzOTIyOTE2/XzQxMTM2LmpwZw"
        />
      </div>
    </div>
  );
};

export default Home;
