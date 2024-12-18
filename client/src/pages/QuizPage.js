import React, { useState, useEffect, useContext, useRef } from "react";
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
  const videoRef = useRef(null);
  const [proctorInterval, setProctorInterval] = useState(null);

  const proctoringApiUrl = `${process.env.REACT_APP_API_URL}/ai-proctoring/${courseId}/${quizId}/analyze-image`;

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
      setCountdown(Math.max(0, Math.floor((endTime - currentTime) / 1000)) - 2);

      // Start webcam
      startProctoring();
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to start quiz.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Start webcam and proctoring interval
  const startProctoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const interval = setInterval(() => {
        captureImageAndSend();
      }, 20000); // 20 seconds
      setProctorInterval(interval);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to access webcam for proctoring.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Capture image and send to API
  const captureImageAndSend = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    // Set the desired width and height for the compressed image
    const targetWidth = 320; // Adjust as needed
    const targetHeight = (video.videoHeight / video.videoWidth) * targetWidth;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    // Convert the canvas content to a base64 string with reduced quality
    const compressedImage = canvas.toDataURL("image/jpeg", 0.7); // Quality between 0 (low) to 1 (high)

    // Convert base64 string to Blob
    const byteString = atob(compressedImage.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: "image/jpeg" });

    // Create FormData and append the Blob as 'proctor_image'
    const formData = new FormData();
    formData.append("proctor_image", blob, "proctor_image.jpg");

    // Send the image to the API
    axios
      .post(proctoringApiUrl, formData, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        console.log("Proctoring image sent successfully.");
      })
      .catch((error) => {
        console.error("Failed to send proctoring image:", error);
      });
  };

  // Stop proctoring
  const stopProctoring = () => {
    if (proctorInterval) {
      clearInterval(proctorInterval);
    }
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    stopProctoring();
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProctoring();
    };
  }, []);

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

  // Format countdown as min:secs
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-2">
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
          <div className="mx-auto bg-white shadow-lg rounded-lg p-6 relative">
            {started && (
              <div>
                <video ref={videoRef} autoPlay className="hidden" />
              </div>
            )}
            {/* Quiz Title and Timer */}
            {started && (
              <div className="flex justify-between items-center border-b pb-4 mb-2">
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
              <div className="h-[calc(80vh-3rem)] flex flex-col items-center justify-center space-y-6 pb-10">
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
                  className="px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-all hover:shadow-xl transform hover:scale-105"
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
                        <label key={index} className="block cursor-pointer">
                          <input
                            type="radio"
                            name={`answer-${question._id}`}
                            value={option}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {started && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={submitQuiz}
                  className="px-8 py-3 text-lg font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-all hover:shadow-xl transform hover:scale-105"
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
