import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function StudentQuizPage() {
  const { courseId, quizId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [quiz, setQuiz] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const navigate = useNavigate();

  const fetchQuizDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/get`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const quizData = res.data;
      const currentTime = new Date();
      const quizDeadline = new Date(quizData.deadline);
      setIsDeadlinePassed(currentTime > quizDeadline);
      setQuiz(quizData);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch quiz details.",
        heading: "Error",
        type: "error",
      });
    }
    setLoading(false);
  };

  const fetchSubmissionDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/submission`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );

      setSubmission(res.data);
    } catch (error) {
      // setFlashMessage({
      //   status: true,
      //   message:
      //     error.response?.data?.message ||
      //     "Failed to fetch submission details.",
      //   heading: "Error",
      //   type: "error",
      // });
    }
  };

  const handleStartQuiz = () => {
    navigate("start");
  };

  useEffect(() => {
    fetchQuizDetails();
    fetchSubmissionDetails();
  }, []);

  const renderScore = () => {
    if (submission) {
      const { score, isCompleted } = submission;
      if (isCompleted) {
        const scoreColor =
          score >= 8
            ? "text-green-500"
            : score >= 5
            ? "text-yellow-500"
            : "text-red-500";
        return (
          <div className="text-center mt-6">
            <h2 className={`text-2xl font-bold ${scoreColor}`}>
              <p>
                Score:{" "}
                {submission.isFlagged ? (
                  <span className="text-red-500 font-medium">Flagged</span>
                ) : (
                  <span>{score}</span>
                )}
              </p>
            </h2>
          </div>
        );
      }
    }
    return null;
  };

  const isQuizAttempted = submission && submission.isCompleted;

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Quiz Details</h1>
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
          {loading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <DotSpinner />
            </div>
          ) : quiz ? (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
              <p className="text-lg mb-2">
                <strong>Topic:</strong> {quiz.topic}
              </p>
              <p className="text-lg mb-2">
                <strong>Duration:</strong> {quiz.duration} minutes
              </p>
              <p className="text-lg mb-2">
                <strong>Number of Questions:</strong> {quiz.number_of_questions}
              </p>
              <p className="text-lg mb-4">
                <strong>Deadline:</strong>{" "}
                {new Date(quiz.deadline).toLocaleString()}
              </p>
              {renderScore()}
              {isDeadlinePassed && !isQuizAttempted && (
                <p className=" text-red-600  ">
                  Note: The deadline for this quiz has passed. You cannot start
                  it.
                </p>
              )}
              <button
                onClick={handleStartQuiz}
                className={`mt-4 py-2 px-4 rounded transition-all hover:shadow-xl transform hover:scale-105 self-end ${
                  isDeadlinePassed || isQuizAttempted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={isDeadlinePassed || isQuizAttempted}
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <p>No quiz details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentQuizPage;
