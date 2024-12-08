import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [quizData, setQuizData] = useState(null);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // Fetch quiz data
  const fetchQuiz = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/get`,
        { headers: { authorization: `Bearer ${authState.token}` } }
      );
      setQuizData(response.data);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch quiz details.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Start the quiz
  const startQuiz = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/start`,
        {},
        { headers: { authorization: `Bearer ${authState.token}` } }
      );
      setStarted(true);
      const endTime = new Date(response.data.data.endTime).getTime();
      const currentTime = new Date().getTime();
      setCountdown(Math.max(0, Math.floor((endTime - currentTime) / 1000)) - 1); // Set timer in seconds
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to start quiz.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        question: { _id: questionId },
        selectedOption,
      })),
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/submit`,
        payload,
        { headers: { authorization: `Bearer ${authState.token}` } }
      );
      setFlashMessage({
        status: true,
        message: "Quiz submitted successfully!",
        heading: "Success",
        type: "success",
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to submit quiz.",
        heading: "Error",
        type: "error",
      });
    }
    navigate(-1);
  };

  // Format countdown as min:secs
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Countdown timer logic
  useEffect(() => {
    if (countdown === 0) {
      submitQuiz();
    } else if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  // Fetch quiz data on page load
  useEffect(() => {
    fetchQuiz();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 p-6">
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
          <div className=" mx-auto bg-white shadow-lg rounded-lg p-6 relative">
            {/* Quiz Title and Timer */}
            {started && (
              <div className="flex justify-between items-center border-b pb-4 mb-2 ">
                <h1 className="text-2xl font-bold text-gray-700">
                  {quizData?.title || "Quiz Title"}
                </h1>
                <div className="text-lg font-semibold text-gray-500">
                  Time Left:{" "}
                  <span className="text-blue-500">{formatTime(countdown)}</span>
                </div>
              </div>
            )}

            {/* Quiz Content */}
            {!started ? (
              <div className="h-[calc(80vh-3rem)]  flex flex-col items-center justify-center space-y-6 pb-10">
                <h1 className="text-2xl font-bold text-gray-700">
                  {quizData?.title || "Quiz Title"}
                </h1>
                <div className="text-lg font-semibold text-gray-500">
                  Duration :{" "}
                  <span className="text-blue-500">
                    {quizData?.duration} mins
                  </span>
                </div>
                <PlayCircle className="w-24 h-24 text-blue-500" />
                <button
                  onClick={startQuiz}
                  className="px-8 py-4 text-lg font-semibold text-white bg-blue-500   rounded hover:bg-blue-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105  "
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto h-[350px] space-y-6">
                {quizData?.questions.map((question) => (
                  <div
                    key={question._id}
                    className="space-y-2 border-b pb-4 last:border-b-0"
                  >
                    <p className="font-semibold text-lg text-gray-800">
                      {question.content}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <label
                          key={index}
                          className="block cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                        >
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            className="mr-2"
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: option,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            {started && (
              <div className="mt-6 text-center">
                <button
                  onClick={submitQuiz}
                  className="  bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
