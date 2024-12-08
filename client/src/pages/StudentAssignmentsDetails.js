import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaFileDownload, FaFileUpload, FaTrash } from "react-icons/fa";

function StudentAssignmentDetails() {
  const { courseId, assignmentId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}/assignment/${assignmentId}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const assignmentData = res.data;
      const studentSubmission = assignmentData.submissions.find(
        (sub) => sub.student._id === authState.id
      );

      if (studentSubmission) {
        const submissionRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/submissions/assignment/${courseId}/${assignmentId}/submissions/${studentSubmission._id}`,
          {
            headers: {
              authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setSubmission(submissionRes.data);
      }

      setAssignment(assignmentData);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message ||
          "Failed to fetch assignment details.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmission = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("submision_document", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/submissions/${courseId}/assignment/${assignmentId}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSubmission(res.data.data);
      setFlashMessage({
        status: true,
        message: "Submission uploaded successfully.",
        heading: "Success",
        type: "success",
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to upload submission.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleDeleteSubmission = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/submissions/assignment/${courseId}/${assignmentId}/submissions/${submission._id}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setSubmission(null);
      setFlashMessage({
        status: true,
        message: "Submission deleted successfully.",
        heading: "Success",
        type: "success",
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to delete submission.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}/assignment/${assignmentId}/download`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${assignment.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to download assignment.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleSubmissionDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/assignment/${assignmentId}/submissions/${submission._id}/download`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${assignment.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to download submission.",
        heading: "Error",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Assignment Details</h1>
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
            <p>Loading assignment details...</p>
          ) : assignment ? (
            <div className="bg-white shadow-lg rounded-lg p-3">
              <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
              <p className="text-lg mb-4">{assignment.description}</p>
              <p className="text-lg mb-4">
                Deadline: {new Date(assignment.deadline).toLocaleDateString()}
              </p>
              {assignment.document_id && (
                <div
                  className="flex items-center mt-4 cursor-pointer"
                  onClick={handleDownload}
                >
                  <FaFileDownload className="text-2xl text-gray-500 mr-2" />
                  <span>{assignment.document_id.split("-")[1]}</span>
                </div>
              )}
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                My Submission
              </h2>
              {submission ? (
                <>
                  <div className="flex items-center mt-4">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={handleSubmissionDownload}
                    >
                      <FaFileDownload className="text-2xl text-gray-500 mr-2" />
                      <span>{submission.document_id.split("-")[1]}</span>
                    </div>
                    <FaTrash
                      className="text-2xl text-red-500 ml-4 cursor-pointer"
                      onClick={handleDeleteSubmission}
                    />
                  </div>
                  {submission.remarks ? (
                    <>
                      {" "}
                      <div className="mt-6  bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Remarks</h3>
                        <div>
                          <p
                            className={`mt-2 font-semibold ${
                              submission.remarks.overallPerformance ===
                              "Excellent"
                                ? "text-purple-800"
                                : submission.remarks.overallPerformance ===
                                  "Good"
                                ? "text-green-600"
                                : submission.remarks.overallPerformance ===
                                  "Fair"
                                ? "text-yellow-600"
                                : submission.remarks.overallPerformance ===
                                  "Poor"
                                ? "text-orange-600"
                                : submission.remarks.overallPerformance ===
                                  "Bad"
                                ? "text-red-600"
                                : ""
                            }`}
                          >
                            {submission.remarks.overallPerformance}
                          </p>
                          <p>
                            <strong>Feedback:</strong>{" "}
                            {submission.remarks.feedback}
                          </p>
                          <p>
                            <strong>Marks:</strong>{" "}
                            {submission.remarks.obtainedMarks} /{" "}
                            {submission.remarks.totalMarks}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <p className="mt-2">Not marked Yet</p>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center mt-4">
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <FaFileUpload className="text-2xl text-gray-500 mr-2" />
                    <span>Attach my work</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleUploadSubmission}
                  />
                </div>
              )}
            </div>
          ) : (
            <p>No assignment details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAssignmentDetails;
