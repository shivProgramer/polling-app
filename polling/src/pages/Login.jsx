"use client";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../Slices/pollSlice";
import { useNavigate } from "react-router-dom";
import { SuccessMsg } from "../../Toaster";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages
    setLoading(true); // Show loading indicator

    try {
      // Make the login request
      const response = await fetch(
        "https://inhouse2.digitalsnug.com/API/Account/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Send email and password
        }
      );

      // Parse the response body as JSON
      const data = await response.json();

      // If status is "1", the login is successful
      if (data.status === "1") {
        // Save token and user info in localStorage
        localStorage.setItem("token", data?.key);
        localStorage.setItem("userInfo", JSON.stringify(data?.userInfo));

        // Dispatch action to update user login state in Redux (if you're using Redux)
        dispatch(userLogin(data?.userInfo));

        // Show success message
        SuccessMsg({ msg: "Login Successfully" });

        // Navigate to home page ("/")
        navigate("/");
      } else {
        // If status is "0", login failed
        ErrorMsg({ msg: data.message || "Login Failed. Invalid Credentials." });
        navigate("/login"); // Optionally redirect back to login page
      }
    } catch (error) {
      // Catch any errors that occur during the fetch request
      console.error("Login error:", error);
      setError("Invalid email or password"); // Display generic error message
    } finally {
      setLoading(false); // Set loading state to false once done
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
          Sign in to your account
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
