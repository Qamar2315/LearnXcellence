import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate import
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function StudentPolls() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate(); // Use navigate hook

  const [showPollDetails, setShowPollDetails] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);

  // Fetch Polls
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

  // Handle Poll Click (Show Details)
  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
    setShowPollDetails(true);
  };

  // Close Poll Details
  const closePollDetails = () => {
    setShowPollDetails(false);
    setSelectedPoll(null);
  };

  // Handle Voting
  const handleVote = async (pollId, option) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/polls/${courseId}/poll/${pollId}/vote`,
        { option },
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setFlashMessage({
        status: true,
        message: response.data.message || "Vote submitted successfully.",
        heading: "Success",
        type: "success",
      });
      fetchPolls(); // Refresh polls to reflect vote count
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to vote.",
        heading: "Error",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [courseId]);

  // Get the user's vote for a poll
  const getUserVote = (poll) => {
    const userVote = poll.votes.find(
      (vote) => vote.student._id === authState.id
    );
    return userVote ? userVote.option : null;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-4xl font-bold">Polls</h1>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(75vh-4rem)] overflow-y-auto">
            {polls.map((poll) => {
              const userVote = getUserVote(poll); // Get the user's vote for this poll

              return (
                <div
                  key={poll._id}
                  className="bg-white shadow-lg rounded-lg p-6 mb-2 cursor-pointer flex flex-col justify-between "
                >
                  <h3 className="text-xl font-bold">{poll.title}</h3>
                  <p className="mb-2">{poll.description}</p>
                  <div className="mt-2 flex-grow ">
                    {poll.options.map((option, index) => {
                      const voteCount = poll.votes.filter(
                        (vote) => vote.option === option
                      ).length;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded mt-1 cursor-pointer hover:bg-blue-100 hover:ring-2 hover:ring-blue-300 transition-all duration-200 hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105"
                          onClick={() => handleVote(poll._id, option)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name={`poll_${poll._id}`}
                              checked={userVote === option} // Check the radio button if the user has voted for this option
                              onChange={() => handleVote(poll._id, option)} // Trigger vote when user selects option
                              className="mr-2"
                            />
                            <span>{option}</span>
                          </div>
                          <span className="text-gray-600">
                            {voteCount} vote{voteCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Created on: {new Date(poll.created_at).toLocaleString()}
                  </p>
                  <button
                    className=" mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
                    onClick={() => handlePollClick(poll)}
                  >
                    View Poll
                  </button>
                </div>
              );
            })}
          </div>

          {/* Poll Details Popup */}
          {showPollDetails && selectedPoll && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
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
                      <div key={index} className="mb-4">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPolls;
