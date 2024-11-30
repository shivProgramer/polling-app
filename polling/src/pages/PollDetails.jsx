import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  alreadyVote,
  createVote,
  deletePoll,
  getLeaderboardbyPoll,
  getPollById,
} from "../Slices/pollSlice";
import { API_URI } from "../../environment";
import { ErrorMsg, SuccessMsg } from "../../Toaster";

export default function PollDetails() {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const [pollResult, setPollResult] = useState([]);
  const location = useLocation();
  let pollId = null;
  let status = null;

  if (location.search) {
    const queryString = location.search.replace("?", "");
    const params = new URLSearchParams(queryString);
    pollId = params.get("pollId");
    status = params.get("status");
  }

  console.log("pollId ---", pollId);
  console.log("status ---", status);
  const navigate = useNavigate();

  const { userData, voteData, leaderByPollData } = useSelector(
    (state) => state.poll
  );

  useEffect(() => {
    const fetchData = async () => {
      if (pollId) {
        const data = await dispatch(getLeaderboardbyPoll(pollId)); // Make sure the dispatch action is async
        setPollResult(data?.payload?.data?.leaderboardData);
      }
    };

    fetchData(); // Call the async function
  }, [pollId]); // Dependency array includes `pollId` to re-run when it changes

  const userLocalData = JSON.parse(localStorage.getItem("userInfo"));

  const userId = userData?.user_Id || userLocalData?.user_Id;

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedVideo, setSelectedVideo] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isVoted, setIsVoted] = useState(false);

  const { poll, loading, error } = useSelector((state) => state.poll);
  const [timeLeft, setTimeLeft] = useState("");
  const calculateTimeLeft = () => {
    const now = new Date();
    const due = new Date(poll?.dueDate);

    const diff = due - now; // Difference in milliseconds

    if (diff <= 0) {
      return "Poll has expired";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  useEffect(() => {
    if (poll?._id && userId) {
      const data = {
        pollId: poll?._id,
        userId: userId,
      };
      dispatch(alreadyVote(data));
    }
  }, [poll, userId, isVoted]);

  useEffect(() => {
    if (pollId) {
      dispatch(getPollById(pollId));
    }
  }, [pollId, dispatch]);

  const handleSelectImage = (image) => {
    if (poll?.status === "inactive") {
      ErrorMsg({ msg: " Poll is not active " });
      return;
    }
    if (voteData.length > 0) {
      ErrorMsg({ msg: "You have already Voted on this poll" });
      return;
    }

    setSelectedImage(image);
    setSelectedVideo({}); // Deselect video if an image is selected
  };

  const handleSelectVideo = (video) => {
    if (voteData.length > 0) {
      ErrorMsg({ msg: "You have already Voted on this poll" });
      return;
    }

    setSelectedVideo(video);
    setSelectedImage({}); // Deselect image if a video is selected
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmitVote = async () => {
    if (voteData?.length > 0) {
      ErrorMsg({ msg: "You have already Voted on this poll" });
    }
    if (poll?.status === "inactive") {
      ErrorMsg({ msg: "Poll is not active " });
      return;
    }
    const data = {
      pollId: poll?._id,
      userId: userData?.user_Id || userLocalData?.user_Id,
      response: selectedVideo?._id || selectedImage?._id,
      responseType: "Poll.videoFiles",
      votedFor: selectedVideo?.fileName || selectedImage?.fileName,
    };
    const fileData = await dispatch(createVote(data));
    if (fileData?.payload?.success) {
      setIsVoted(true);
      SuccessMsg({ msg: "Vote submitted successfully" });
    }
  };

  const handleDeletePoll = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(deletePoll(pollId));
      console.log("result ---", result);
      if (result?.payload?.status === 1) {
        SuccessMsg({ msg: result?.payload?.message });
        navigate(`/view-polls?type=${status}`);
      }
    } catch (error) {
      ErrorMsg({ msg: error?.response?.data?.message });
      console.error("Error deleting poll:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption && (selectedImage || selectedVideo)) {
    } else {
      console.log("Please select an option and a media file.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      {/* Loader or Error */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}

      {/* Poll Details */}
      {!loading && poll && (
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg">
          <div className="p-12">
            {/* Poll Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {poll?.pollTitle || "Untitled Poll"}
              </h1>
              <div className="flex flex-col">
                <span className="px-4 py-1 text-center text-sm bg-blue-500 text-white rounded-full">
                  {poll?.type || "General"}
                </span>
                <span className="pt-3">{timeLeft}</span>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              {poll?.pollDescription || "No description available."}
            </p>

            {/* Poll Media in Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              {/* Images */}
              {poll?.imageFiles?.length > 0 &&
                poll?.imageFiles?.map((image, index) => (
                  <div
                    key={image?._id || index}
                    className="flex flex-col items-center bg-gray-200 rounded-lg shadow-lg p-4"
                  >
                    {/* Display Image */}
                    <a
                      href={`{API_URI}/${image?.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`{API_URI}/${image?.filePath}`}
                        alt={`Image ${index + 1}`}
                        className="w-full h-[15vh] mb-4 p-1 rounded-lg hover:cursor-pointer"
                      />
                    </a>

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectImage(image)}
                      className={`w-full py-2 px-4 font-semibold rounded-md ${
                        selectedImage === image?.filePath ||
                        voteData[0]?.response === image?._id
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={
                        selectedImage === image?.filePath ||
                        voteData[0]?.response === image?._id
                      }
                    >
                      {selectedImage === image?.filePath ||
                      voteData[0]?.response === image?._id
                        ? "Selected"
                        : "Select"}
                    </button>
                  </div>
                ))}

              {/* Videos */}
              {poll?.videoFiles?.length > 0 &&
                poll?.videoFiles?.map((video, index) => (
                  <div
                    key={video?._id || index}
                    className="flex flex-col items-center bg-gray-200 rounded-lg shadow-lg p-4"
                  >
                    {/* Display Video */}
                    <video
                      controls
                      src={`${API_URI}/${video?.filePath}`}
                      className="w-full h-[15vh] mb-4 p-1 rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectVideo(video)}
                      className={`w-full py-2 px-4 font-semibold rounded-md ${
                        selectedVideo?.filePath === video?.filePath ||
                        voteData[0]?.response === video?._id
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={
                        selectedVideo?.filePath === video?.filePath ||
                        voteData[0]?.response === video?._id
                      }
                    >
                      {selectedVideo?.filePath === video?.filePath ||
                      voteData[0]?.response === video?._id
                        ? "Selected"
                        : "Select"}
                    </button>
                  </div>
                ))}

              <form onSubmit={handleSubmit}>
                {poll?.questions?.length > 0 &&
                  poll?.questions?.map((question) => (
                    <div key={question?._id} className="mb-6">
                      {/* Question */}
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {question?.question}
                      </h2>

                      {/* Options */}
                      {question?.options?.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-4 mb-4"
                        >
                          <input
                            type="radio"
                            name={`question-${question?._id}`}
                            value={option}
                            checked={selectedOptions[question?._id] === option}
                            onChange={() =>
                              handleOptionChange(question?._id, option)
                            }
                            className="w-5 h-5 text-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ))}

                {/* Submit Button */}
              </form>
            </div>

            {/* Poll Options */}
            {poll?.pollOptions?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Select an Option
                </h2>
                <form onSubmit={handleSubmit}>
                  {poll?.options?.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-4 mb-4"
                    >
                      <input
                        type="radio"
                        name="pollOption"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => handleOptionChange(option)}
                        className="w-5 h-5 text-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Vote
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Poll Footer */}
          <div className="p-6 border-t text-gray-500 text-sm">
            <div className="flex justify-between">
              {" "}
              <button
                onClick={handleSubmitVote}
                className="bg-blue-500  text-white text-lg px-6 w-[10vw] rounded-md hover:bg-blue-400 py-2"
              >
                Submit
              </button>
              {/* {userLocalData?.role_Id === 2 && ( */}
              <button
                onClick={handleDeletePoll}
                className="bg-red-500  text-white text-lg px-6 w-[6vw] rounded-md hover:bg-red-400 py-2"
              >
                Delete
              </button>
              {/* )} */}
            </div>

            <p className="mt-5 text-[15px] text-gray-600 font-semibold">
              Due:{" "}
              {poll?.dueDate
                ? new Date(poll.dueDate).toLocaleDateString()
                : "No due date specified."}
            </p>
          </div>
        </div>
      )}

      {poll?.status === "inactive" && (
        <div>
          <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-10">
              🌟 Leaderboard
            </h1>

            {/* Table Component */}
            <div className="bg-white shadow-lg rounded-xl mx-auto">
              <table className="w-[50vw]">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Username</th>
                    <th className="py-2 px-4 text-left">Total Votes</th>
                    <th className="py-2 px-4 text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {pollResult
                    ?.sort((a, b) => b.points - a.points)
                    .map((entry, index) => (
                      <tr
                        key={index}
                        className="hover:bg-purple-50 transition duration-200"
                      >
                        <td className="py-2 px-4">
                          {entry?.username.charAt(0).toUpperCase() +
                            entry?.username.slice(1)}
                        </td>
                        <td className="py-2 px-4">{entry?.totalVotes}</td>
                        <td className="py-2 px-4">{entry?.points}</td>
                      </tr>
                    ))} */}

                  {pollResult &&
                    [...pollResult]
                      .sort((a, b) => b.points - a.points)
                      .map((entry, index) => (
                        <tr
                          key={index}
                          className="hover:bg-purple-50 transition duration-200"
                        >
                          <td className="py-2 px-4">
                            {entry?.username.charAt(0).toUpperCase() +
                              entry?.username.slice(1)}
                          </td>
                          <td className="py-2 px-4">{entry?.totalVotes}</td>
                          <td className="py-2 px-4">{entry?.points}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
