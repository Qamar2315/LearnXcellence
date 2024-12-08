import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { FaFlag, FaEdit, FaFileDownload } from "react-icons/fa";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherQuizSubmission() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { quizId, courseId, submissionId } = useParams();
  const [submission, setSubmission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showEditScoreModal, setShowEditScoreModal] = useState(false);
  const [newScore, setNewScore] = useState("");
  const [newFlagStatus, setNewFlagStatus] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/submission/${submissionId}`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setSubmission(res.data);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch submissions.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFlagChange = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/update-flag/${submission._id}`,
        { isFlagged: newFlagStatus },
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setFlashMessage({
        status: true,
        message: "Flag status updated successfully.",
        heading: "Success",
        type: "success",
      });
      fetchSubmissions();
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update flag.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setShowFlagModal(false);
    }
  };

  const handleScoreEdit = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/update-marks/${submission._id}`,
        { newScore },
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setFlashMessage({
        status: true,
        message: "Score updated successfully.",
        heading: "Success",
        type: "success",
      });
      fetchSubmissions();
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update score.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setShowEditScoreModal(false);
    }
  };

  const handleProctoringReportDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/ai-proctoring/${courseId}/${quizId}/generate-report/${submission.student._id}`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "proctoring-report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to generate report.",
        heading: "Error",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Quiz Submission Details</h1>

          {flashMessage.status && (
            <div className="max-w-2xl mx-auto mb-4">
              {flashMessage.type === "error" ? (
                <Alert
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ) : (
                <Success
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              )}
            </div>
          )}

          {loading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <DotSpinner />
            </div>
          ) : (
            <div className="bg-white shadow-md p-6 rounded-lg">
              <div>
                <p>
                  <strong>Student Name:</strong> {submission.student?.name}
                </p>
                <p>
                  <strong>Email:</strong> {submission.student?.account.email}
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  {submission.isFlagged ? (
                    <span className="text-red-500 font-medium">Flagged</span>
                  ) : (
                    <span>{submission.score}</span>
                  )}
                </p>

                <p>
                  <strong>Flagged:</strong>{" "}
                  {submission.isFlagged ? "Yes" : "No"}
                </p>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-200 ease-in-out flex items-center space-x-2"
                  onClick={() => {
                    setNewFlagStatus(!submission.isFlagged);
                    setShowFlagModal(true);
                  }}
                >
                  <FaFlag /> {submission.isFlagged ? "Unflag" : "Flag"}
                </button>
                <button
                  className="mt-4 px-6 py-3 bg-green-500 text-white font-medium text-sm rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition duration-200 ease-in-out flex items-center space-x-2"
                  onClick={() => {
                    setNewScore(submission.score);
                    setShowEditScoreModal(true);
                  }}
                >
                  <FaEdit /> Edit Score
                </button>
                <button
                  className="mt-4 px-6 py-3 bg-gray-500 text-white font-medium text-sm rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg transition duration-200 ease-in-out flex items-center space-x-2"
                  onClick={handleProctoringReportDownload}
                >
                  <FaFileDownload /> Download Proctoring Report
                </button>
              </div>
            </div>
          )}

          {/* Flag Modal */}
          {showFlagModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Change Flag Status</h2>
                <p>
                  Are you sure you want to {newFlagStatus ? "flag" : "unflag"}{" "}
                  this submission?
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowFlagModal(false)}
                    className="px-4 py-2 bg-gray-400 rounded-md text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFlagChange}
                    className="px-4 py-2 bg-blue-500 rounded-md text-white"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Score Modal */}
          {showEditScoreModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Score</h2>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowEditScoreModal(false)}
                    className="px-4 py-2 bg-gray-400 rounded-md text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScoreEdit}
                    className="px-4 py-2 bg-green-500 rounded-md text-white"
                  >
                    Update Score
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

export default TeacherQuizSubmission;
