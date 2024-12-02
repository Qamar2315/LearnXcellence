import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";

function TeacherPolls() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    options: [""],
  });
  const [showCreatePollForm, setShowCreatePollForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  const [showPollDetails, setShowPollDetails] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/polls/${courseId}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setPolls(response.data);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to fetch polls.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePollCreation = async (e) => {
    e.preventDefault();
    if (!newPoll.title.trim() || !newPoll.options.every((opt) => opt.trim())) {
      setFlashMessage({
        status: true,
        message: "All fields and options are required.",
        heading: "Error",
        type: "error",
      });
      setShowCreatePollForm(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/polls/${courseId}`,
        newPoll,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setPolls((prevPolls) => [response.data.data, ...prevPolls]);
      setNewPoll({ title: "", description: "", options: [""] });
      setFlashMessage({
        status: true,
        message: "Poll created successfully.",
        heading: "Success",
        type: "success",
      });
      setShowCreatePollForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to create poll.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setNewPoll((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 1) {
      const updatedOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
    setShowPollDetails(true);
  };

  const closePollDetails = () => {
    setShowPollDetails(false);
    setSelectedPoll(null);
  };

  const handleDeletePoll = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/polls/66e89607b4cd4c0d64a2b34f/poll/${pollToDelete._id}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setPolls((prevPolls) =>
        prevPolls.filter((poll) => poll._id !== pollToDelete._id)
      );
      setFlashMessage({
        status: true,
        message: response.data.message,
        heading: "Success",
        type: "success",
      });
      setShowDeleteConfirmation(false); // Close confirmation
      setShowPollDetails(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to delete poll.",
        heading: "Error",
        type: "error",
      });
      setShowDeleteConfirmation(false); // Close confirmation
    }
  };

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold">Polls</h1>
            <div className="mr-5 mt-5 mb-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={() => setShowCreatePollForm(true)}
              >
                Add Poll
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-4">
            {flashMessage.status &&
              (flashMessage.type === "error" ? (
                <Alert
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ) : (
                <Success
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ))}
          </div>

          {showCreatePollForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowCreatePollForm(false)}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">Create New Poll</h2>
                <form onSubmit={handlePollCreation}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Poll Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newPoll.title}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newPoll.description}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Options</label>
                    {newPoll.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          className="flex-grow p-2 border rounded mr-2"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="px-2 py-1 text-red-500"
                          onClick={() => removeOption(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline mt-2"
                      onClick={addOption}
                    >
                      Add Option
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Create Poll
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(75vh-4rem)] overflow-y-auto">
            {polls.map((poll) => (
              <div
                key={poll._id}
                className="bg-white shadow-lg rounded-lg p-6 mb-2 cursor-pointer hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105"
                onClick={() => handlePollClick(poll)}
              >
                <h3 className="text-xl font-bold">{poll.title}</h3>
                <p className="mb-2">{poll.description}</p>
                <div className="mt-2">
                  <div className="mt-2">
                    {poll.options.map((option, index) => {
                      const voteCount = poll.votes.filter(
                        (vote) => vote.option === option
                      ).length;
                      return (
                        <div
                          key={index}
                          className="flex justify-between bg-gray-100 p-2 rounded mt-1"
                        >
                          <span>{option}</span>
                          <span className="text-gray-600">
                            {voteCount} vote{voteCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created on: {new Date(poll.created_at).toLocaleString()}
                </p>
                {/* Buttons for View Poll and Delete Poll */}
                <div className="flex justify-end mt-4 gap-4"></div>
              </div>
            ))}
          </div>

          {/* Poll Details Popup */}
          {showPollDetails && selectedPoll && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={closePollDetails}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedPoll.title}
                </h2>
                <p className="mb-2">{selectedPoll.description}</p>
                <div>
                  {selectedPoll.options.map((option, index) => {
                    const votersForOption = selectedPoll.votes.filter(
                      (vote) => vote.option === option
                    );
                    const voteCount = votersForOption.length;
                    return (
                      <div key={index} className="mb-4 ">
                        <h3 className="font-semibold">
                          {option} -{" "}
                          {voteCount > 0
                            ? `${voteCount} vote${voteCount > 1 ? "s" : ""}`
                            : "0 votes"}
                        </h3>
                        {voteCount === 0 ? (
                          <p className="text-gray-500">No votes yet</p>
                        ) : (
                          <ul role="list" className="divide-y divide-gray-100">
                            {votersForOption.map((vote) => (
                              <li
                                key={vote.student._id}
                                className="flex justify-between gap-x-6 py-5"
                              >
                                <div className="flex min-w-0 gap-x-4">
                                  <img
                                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                    src={
                                      vote.student.account.profile_picture
                                        ? `http://localhost:9090/profile_pictures/${vote.student.account.profile_picture}`
                                        : "https://via.placeholder.com/150"
                                    }
                                    alt={vote.student.name}
                                  />
                                  <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                      {vote.student.name}
                                    </p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                      {vote.student.account.email}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                      Voted at:{" "}
                                      {new Date(
                                        vote.updated_at
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  className="ml-80 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                  onClick={() => {
                    setPollToDelete(selectedPoll);
                    setShowDeleteConfirmation(true);
                  }}
                >
                  Delete Poll
                </button>
              </div>
            </div>
          )}

          {/* Delete Poll Confirmation */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
                <h2 className="text-2xl font-semibold mb-4">
                  Are you sure you want to delete this poll?
                </h2>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    onClick={handleDeletePoll}
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherPolls;
