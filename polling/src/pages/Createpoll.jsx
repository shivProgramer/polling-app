import React, { useState } from "react";
import { submitPoll } from "../Slices/pollSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Createpoll = () => {
  const [pollType, setPollType] = useState("video"); // Default poll type is 'video'
  const [videoFiles, setVideoFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [pollData, setPollData] = useState({});
  const [options, setOptions] = useState([""]);
  const [videoForm, submitVideoForm] = useState({});
  const [imageForm, submitImageForm] = useState({});
  const [quesForm, submitQuesForm] = useState({});

  const dispatch = useDispatch();

  // video Poll;

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles([...videoFiles, ...files]);
  };

  const handlePolldata = (e) => {
    setPollData({ ...pollData, [e.target.id]: e.target.value });
  };

  const videoFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    submitVideoForm({ videoFiles: videoFiles, ...pollData, type: "video" });
    formData.append("pollTitle", pollData.pollTitle);
    formData.append("pollDescription", pollData.pollDescription);
    formData.append("points", pollData.points);
    formData.append("type", "video");
    formData.append("dueDate", pollData.dueDate);

    videoFiles.forEach((file) => {
      formData.append("videoFiles", file); // Correctly append each file under the same field name
    });

    axios
      .post("http://localhost:3000/api/poll/createVideoPoll", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      })
      .then((response) => {
        console.log("Poll created successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error creating poll:", error.response.data);
      });
  };

  console.log("video", videoForm);
  console.log("image", imageForm);
  console.log("question", quesForm);

  // image poll

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  const imageFormSubmit = (e) => {
    e.preventDefault();
    console.log("Poll data:", pollData);

    const formData = new FormData();

    formData.append("pollTitle", pollData.pollTitle);
    formData.append("pollDescription", pollData.pollDescription);
    formData.append("points", pollData.points);
    formData.append("type", "image");
    formData.append("dueDate", pollData.dueDate);

    imageFiles.forEach((file) => {
      formData.append("imageFiles", file); // Correctly append each file under the same field name
    });

    axios
      .post("http://localhost:3000/api/poll/createImagePoll", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      })
      .then((response) => {
        console.log("Poll created successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error creating poll:", error.response.data);
      });
  };

  // question poll

  const handleQuesChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: [""] }]);
  };

  const questionFormSubmit = (e) => {
    e.preventDefault();
    submitQuesForm({
      questions: questions,
      pollDescription: pollData.pollDescription,
      pollTitle: pollData.pollTitle,
      type: "question",
      dueDate: pollData.dueDate,
    });

    console.log("quesForm", quesForm);

    axios
      .post("http://localhost:3000/api/poll/createQuesPoll", quesForm)
      .then((response) => {
        console.log("Poll created successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error creating poll:", error.response.data);
      });
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = questions.filter((_, i) => i !== questionIndex);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-8 mt-10">
      <div className="border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create a New Poll</h2>
        <p className="text-gray-600 mt-2">
          Choose the type of poll and customize the content accordingly.
        </p>
      </div>
      <div className="flex justify-around mt-4">
        <button
          className={`px-6 py-2 rounded-lg font-semibold ${
            pollType === "video"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setPollType("video")}
        >
          Video Poll
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold ${
            pollType === "image"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setPollType("image")}
        >
          Image Poll
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold ${
            pollType === "question"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setPollType("question")}
        >
          Question Poll
        </button>
      </div>

      <form className="space-y-8">
        {/* Common Fields */}
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-semibold text-gray-700"
          >
            Poll Title
          </label>
          <input
            id="pollTitle"
            type="text"
            onChange={(e) => handlePolldata(e)}
            className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
            placeholder="Enter poll title"
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-semibold text-gray-700"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            onChange={(e) => handlePolldata(e)}
            className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
            placeholder="Enter poll title"
          />
        </div>
        <div>
          <label
            htmlFor="points"
            className="block text-lg font-semibold text-gray-700"
          >
            Poll Points
          </label>
          <input
            id="points"
            type="number"
            onChange={(e) => handlePolldata(e)}
            className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
            placeholder="Enter poll points"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="pollDescription"
            onChange={(e) => handlePolldata(e)}
            className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
            placeholder="Enter description"
            rows={5}
          ></textarea>
        </div>

        {/* Conditional Forms */}
        {pollType === "video" && (
          <div>
            <label
              htmlFor="video"
              className="block text-lg font-semibold text-gray-700"
            >
              Upload Video
            </label>
            <input
              id="video"
              type="file"
              multiple
              onChange={handleVideoChange}
              accept="video/*"
              className="mt-2 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        )}

        {pollType === "image" && (
          <div>
            <label
              htmlFor="images"
              className="block text-lg font-semibold text-gray-700"
            >
              Upload Images
            </label>
            <input
              id="images"
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="mt-2 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        )}

        {pollType === "question" && (
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Questions
            </label>
            <div className="space-y-4 mt-4">
              {questions.map((questionData, questionIndex) => (
                <div key={questionIndex} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
                      placeholder={`Question ${questionIndex + 1}`}
                      value={questionData.question}
                      onChange={(e) => handleQuesChange(e, questionIndex)}
                    />
                    {/* <button
                      type="button"
                      onClick={() => handleDeleteQuestion(questionIndex)}
                      className="border px-4 py-2 hover:bg-red-400 hover:text-white rounded-lg"
                    >
                      Delete Question
                    </button> */}
                  </div>

                  {/* Options for this question */}
                  {questionData.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-4"
                    >
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-base p-3"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(e, questionIndex, optionIndex)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteOption(questionIndex, optionIndex)
                        }
                        className="border px-4 py-2 hover:bg-red-400 hover:text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddOption(questionIndex)}
                      className="mt-4 px-5 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 focus:ring focus:ring-purple-300"
                    >
                      Add Option
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(questionIndex)}
                      className="border ml-5 px-4 py-2 hover:bg-red-400 hover:text-white rounded-lg"
                    >
                      Delete Question
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-4 px-5 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 focus:ring focus:ring-purple-300"
              >
                Add Question
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          onClick={
            (pollType == "video" && videoFormSubmit) ||
            (pollType == "image" && imageFormSubmit) ||
            (pollType == "question" && questionFormSubmit)
          }
          className="w-full px-5 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default Createpoll;
