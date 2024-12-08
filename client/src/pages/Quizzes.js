import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/course/${courseId}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data) {
        setQuizzes(res.data);
      } else {
        setFlashMessage({
          status: true,
          message: "No quizzes found.",
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to fetch quizzes",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId) => {
    navigate(`${quizId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold ">Quizzes</h1>
            <div className="mr-5 mt-5 mb-2"></div>
          </div>

          {/* Flash messages */}
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
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  onClick={() => handleQuizClick(quiz._id)}
                  className="bg-white shadow-lg rounded-lg p-6 mb-2 cursor-pointer hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-700 mb-1">
                    <strong>Topic:</strong> {quiz.topic}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Duration:</strong> {quiz.duration} minutes
                  </p>
                  <p className="text-gray-500">
                    <strong>Deadline:</strong>{" "}
                    {new Date(quiz.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No quizzes available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
