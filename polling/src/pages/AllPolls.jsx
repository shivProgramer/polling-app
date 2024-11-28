import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Use the appropriate routing solution
import { getAllPolls } from "../Slices/pollSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AllPolls() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pollFilter, setPollFilter] = useState("all");
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "active";

  console.log("pollFilter", pollFilter);

  useEffect(() => {
    dispatch(getAllPolls());
  }, []);

  const { allPolls } = useSelector((state) => state.poll);
  console.log("asll", allPolls);

  function Button({ children, className, ...props }) {
    return (
      <button
        className={`bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const currentDate = new Date();
  const activePolls = allPolls.filter((poll) => {
    const dueDate = new Date(poll?.dueDate);
    return dueDate >= currentDate;
  });

  const inactivePolls = allPolls.filter((poll) => {
    const dueDate = new Date(poll?.dueDate);
    return dueDate < currentDate;
  });

  const pollFiltersData = activePolls.filter((poll) => {
    return poll.type === pollFilter;
  });

  // Custom Badge component
  function Badge({ children, variant = "primary", className, ...props }) {
    let badgeStyle = "bg-blue-500 text-white";

    if (variant === "secondary") {
      badgeStyle = "bg-gray-500 text-white";
    } else if (variant === "success") {
      badgeStyle = "bg-green-500 text-white";
    } else if (variant === "warning") {
      badgeStyle = "bg-yellow-500 text-white";
    } else if (variant === "error") {
      badgeStyle = "bg-red-500 text-white";
    } else if (variant === "active") {
      badgeStyle = "bg-green-600 text-white";
    } else if (variant === "inactive") {
      badgeStyle = "bg-gray-600 text-white";
    }

    return (
      <span
        className={`inline-block text-xs font-medium py-1 px-3 rounded-full ${badgeStyle} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[13vw] min-h-[100vh] bg-gray-800 text-white p-6 fixed top-0 left-0 shadow-lg">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Polls Dashboard
        </h2>
        <ul className="space-y-3">
          <li>
            <Link to="/view-polls?type=active">
              <button
                className={`flex ${
                  type === "active" && "bg-purple-700"
                } items-center space-x-4 text-lg text-white hover:bg-purple-600 hover:text-white w-full px-6 py-3 rounded-lg transition duration-200 ease-in-out`}
              >
                <i className="fas fa-check-circle"></i> {/* Add an icon here */}
                <span>Active Polls</span>
              </button>
            </Link>
          </li>
          <li>
            <Link to="/view-polls?type=inactive">
              <button
                className={`flex ${
                  type === "inactive" && "bg-purple-700"
                } items-center space-x-4 text-lg text-white hover:bg-purple-600 hover:text-white w-full px-6 py-3 rounded-lg transition duration-200 ease-in-out`}
              >
                <i className="fas fa-times-circle"></i> {/* Add an icon here */}
                <span>Inactive Polls</span>
              </button>
            </Link>
          </li>
          {/* Add more links here if needed */}
        </ul>
      </div>

      {/* Content area */}
      <div className="w-[77vw] ml-[13vw] p-12">
        {type === "active" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Active Polls
                </h2>
              </div>
              <div className="border p-2">
                <label for="cars">Filter : </label>

                <select
                  onChange={(e) => setPollFilter(e.target.value)}
                  name="cars"
                  id="cars"
                >
                  <option value="all">All poll</option>
                  <option value="image">Image Polls</option>
                  <option value="video">Video Polls</option>
                  <option value="question">Question Polls</option>
                </select>
              </div>
            </div>
            <hr className="py-3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {activePolls.length > 0 ? (
                (pollFiltersData.length > 0
                  ? pollFiltersData
                  : activePolls
                )?.map((poll) => (
                  <div
                    key={poll?._id}
                    className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300"
                  >
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {poll?.pollTitle || ""}
                      </h2>
                      <Badge
                        variant={
                          poll?.status === "active" ? "active" : "inactive"
                        }
                      >
                        {poll?.status || "inactive"}
                      </Badge>
                    </div>
                    <div className="p-4 flex-grow">
                      <p className="text-gray-700 mb-4">
                        {poll?.pollDescription || "Description"}
                      </p>
                      {poll?.image && (
                        <img
                          src={poll?.image}
                          alt={poll?.title}
                          className="w-full h-auto mb-4 rounded-md"
                        />
                      )}
                      {poll.video && (
                        <video
                          controls
                          className="w-full h-auto mb-4 rounded-md"
                        >
                          <source src={poll?.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-extrabold">Due:</span>{" "}
                        {new Date(poll?.dueDate).toISOString().split("T")[0]}
                      </p>
                    </div>
                    <div className="p-4 border-t">
                      <Link to={`/poll?pollId=${poll._id}`} className="w-full">
                        <Button className="w-full">Vote Now</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className=" text-gray-600">No inactive polls found</p>
                </>
              )}
            </div>
          </>
        )}
        {type === "inactive" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Inactive Polls
            </h2>
            <hr className="py-3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {inactivePolls.length > 0 ? (
                inactivePolls?.map((poll) => (
                  <div
                    key={poll?._id}
                    className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300"
                  >
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {poll?.pollTitle || ""}
                      </h2>
                      <Badge
                        variant={
                          poll?.status === "active" ? "active" : "inactive"
                        }
                      >
                        {poll?.status || "inactive"}
                      </Badge>
                    </div>
                    <div className="p-4 flex-grow">
                      <p className="text-gray-700 mb-4">
                        {poll?.pollDescription || "Description"}
                      </p>
                      {poll?.image && (
                        <img
                          src={poll?.image}
                          alt={poll?.title}
                          className="w-full h-auto mb-4 rounded-md"
                        />
                      )}
                      {poll.video && (
                        <video
                          controls
                          className="w-full h-auto mb-4 rounded-md"
                        >
                          <source src={poll?.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <p className="text-sm text-gray-500">
                        Due:{" "}
                        {new Date(poll?.dueDate).toISOString().split("T")[0]}
                      </p>
                    </div>
                    <div className="p-4 border-t">
                      <Link to={`/poll?pollId=${poll._id}`} className="w-full">
                        <Button className="w-full">Vote Now</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-center text-gray-600">
                    No inactive polls found
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
