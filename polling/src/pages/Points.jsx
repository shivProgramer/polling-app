import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, manageCredits } from "../Slices/pollSlice";

const CreditPointsPage = () => {
  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});
  const [currentBalance, setCurrentBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { allUsers } = useSelector((state) => state.poll);
  console.log("allUsers", allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Please select a user.";
    if (!formData.points || Number(formData.points) <= 0)
      newErrors.points = "Amount must be greater than 0.";
    if (!formData.reason || formData.reason.length < 5)
      newErrors.reason = "Reason must be at least 5 characters long.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await dispatch(manageCredits(formData));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto mt-12 px-4 py-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Manage Credit Points
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Dropdown */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <select
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a user</option>
              {allUsers.map((user, index) => (
                <option key={index} value={user?.user_Id}>
                  {user?.full_Name}
                </option>
              ))}
            </select>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium mb-1">
              Points
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.points && (
              <p className="text-red-500 text-sm mt-1">{errors.points}</p>
            )}
          </div>

          {/* Operation Radio Buttons */}
          <div>
            <label className="block text-sm font-medium mb-1">Operation</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  value="add"
                  checked={formData.operation === "add"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Add
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  value="reduce"
                  checked={formData.operation === "reduce"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Reduce
              </label>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-1">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              rows="3"
            ></textarea>
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Update Credit Points
          </button>
        </form>

        {/* Current Balance */}
        {currentBalance !== null && (
          <div className="mt-4 text-gray-700">
            <p className="text-sm">
              Current balance:{" "}
              <span className="font-bold">{currentBalance}</span> points
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditPointsPage;
