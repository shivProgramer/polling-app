import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getPollById } from "../Slices/pollSlice";
import { API_URI } from "../../environment";

export default function PollDetails() {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pollId = searchParams.get("pollId");

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const { poll, loading, error } = useSelector((state) => state.poll);

  useEffect(() => {
    if (pollId) {
      dispatch(getPollById(pollId));
    }
  }, [pollId, dispatch]);

  const handleSelectImage = (imagePath) => {
    setSelectedImage(imagePath);
    setSelectedVideo(null); // Deselect video if an image is selected
  };

  const handleSelectVideo = (videoPath) => {
    setSelectedVideo(videoPath);
    setSelectedImage(null); // Deselect image if a video is selected
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption && (selectedImage || selectedVideo)) {
      console.log(`Voted for: ${selectedOption}`);
      console.log(`Selected Media: ${selectedImage || selectedVideo}`);
      // Send selectedOption and media to the backend or process the vote
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
              <span className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full">
                {poll?.type || "General"}
              </span>
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
                      href={`http://localhost:3000/${image?.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`http://localhost:3000/${image?.filePath}`}
                        alt={`Image ${index + 1}`}
                        className="w-full h-[15vh] mb-4 p-1 rounded-lg hover:cursor-pointer"
                      />
                    </a>

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectImage(image?.filePath)}
                      className={`w-full py-2 px-4 font-semibold rounded-md ${
                        selectedImage === image?.filePath
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={selectedImage === image?.filePath}
                    >
                      {selectedImage === image?.filePath
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
                      onClick={() => handleSelectVideo(video?.filePath)}
                      className={`w-full py-2 px-4 font-semibold rounded-md ${
                        selectedVideo === video?.filePath
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={selectedVideo === video?.filePath}
                    >
                      {selectedVideo === video?.filePath
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
          </div>

          {/* Poll Footer */}
          <div className="p-6 border-t text-gray-500 text-sm">
            <p>
              Due:{" "}
              {poll?.dueDate
                ? new Date(poll.dueDate).toLocaleDateString()
                : "No due date specified."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
