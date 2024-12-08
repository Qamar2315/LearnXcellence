import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { FaFileDownload, FaFileUpload, FaTrash } from "react-icons/fa";

function TeacherAssignmentRemarks() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { courseId, submissionId, assignmentId } = useParams();
  const { authState } = useContext(AuthContext);
  const [remark, setRemark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddRemarkForm, setShowAddRemarkForm] = useState(false);
  const [showEditRemarkForm, setShowEditRemarkForm] = useState(false);
  const [remarksId, setRemarksId] = useState("");
  const [submission, setSubmission] = useState("");
  const [formData, setFormData] = useState({
    overallPerformance: "",
    feedback: "",
    obtainedMarks: "",
    totalMarks: "",
  });

  const navigate = useNavigate();

  // Fetch remark details
  const fetchRemark = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/remarks/submission/${courseId}/${submissionId}/0`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setRemark(res.data.data);
      if (res.data.data) {
        setRemarksId(res.data.data._id);
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch remark details.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmission = async () => {
    const submissionRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/submissions/assignment/${courseId}/${assignmentId}/submissions/${submissionId}`,
      {
        headers: {
          authorization: `Bearer ${authState.token}`,
        },
      }
    );
    setSubmission(submissionRes.data);
  };
  useEffect(() => {
    fetchRemark();
    fetchSubmission();
  }, [flashMessage]);

  // Handle add remark
  const handleAddRemark = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/remarks/submission/${courseId}/${submissionId}/add`,
        formData,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setRemark(res.data.data);
      setFlashMessage({
        status: true,
        message: "Remark added successfully.",
        heading: "Success",
        type: "success",
      });
      setShowAddRemarkForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to add remark.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Handle edit remark
  const handleEditRemark = async (e) => {
    console.log(
      `${process.env.REACT_APP_API_URL}/remarks/submission/${courseId}/${submissionId}/${remarksId}`
    );
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/remarks/submission/${courseId}/${submissionId}/${remarksId}`,
        formData,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setRemark(res.data.data);
      setFlashMessage({
        status: true,
        message: "Remark updated successfully.",
        heading: "Success",
        type: "success",
      });
      setShowEditRemarkForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update remark.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleSubmissionDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/${courseId}/submission/${submission._id}/download`,
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
      link.setAttribute("download", `${submission.document_id}.pdf`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Submission Details</h1>
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

          {loading ? (
            <p>Loading submission details...</p>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Submission</h2>
              {submission && (
                <div className="flex items-center mt-4">
                  <div
                    className="flex items-center cursor-pointer mb-4"
                    onClick={handleSubmissionDownload}
                  >
                    <FaFileDownload className="text-2xl text-gray-500 mr-2" />
                    <span>{submission.document_id.split("-")[1]}</span>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-4">Remarks</h2>
              {remark ? (
                <div>
                  <p className="text-lg">
                    Performance: {remark.overallPerformance}
                  </p>
                  <p className="text-lg mt-2">Feedback: {remark.feedback}</p>
                  <p className="text-lg mt-2">
                    Marks: {remark.obtainedMarks}/{remark.totalMarks}
                  </p>
                  <p className="text-lg mt-2">
                    Date Created:{" "}
                    {new Date(remark.dateCreated).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {
                      setFormData({
                        overallPerformance: remark.overallPerformance,
                        feedback: remark.feedback,
                        obtainedMarks: remark.obtainedMarks,
                        totalMarks: remark.totalMarks,
                      });
                      setShowEditRemarkForm(true);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit Remark
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <p>Not marked yet.</p>
              )}
              {!remark && (
                <>
                  <button
                    onClick={() => setShowAddRemarkForm(true)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Remark
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          )}

          {/* Add Remark Form Popup */}
          {showAddRemarkForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Remark</h2>
                <form onSubmit={handleAddRemark} className="space-y-4">
                  <select
                    name="overallPerformance"
                    value={formData.overallPerformance}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Performance</option>
                    <option value="Bad">Bad</option>
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                  <textarea
                    name="feedback"
                    placeholder="Feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="obtainedMarks"
                    placeholder="Obtained Marks"
                    value={formData.obtainedMarks}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="Total Marks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRemarkForm(false)}
                      className="px-4 py-2 bg-gray-400 rounded-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 rounded-md text-white"
                    >
                      Add Remark
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Remark Form Popup */}
          {showEditRemarkForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Remark</h2>
                <form onSubmit={handleEditRemark} className="space-y-4">
                  <select
                    name="overallPerformance"
                    value={formData.overallPerformance}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Performance</option>
                    <option value="Bad">Bad</option>
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                  <textarea
                    name="feedback"
                    placeholder="Feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="obtainedMarks"
                    placeholder="Obtained Marks"
                    value={formData.obtainedMarks}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="Total Marks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowEditRemarkForm(false)}
                      className="px-4 py-2 bg-gray-400 rounded-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 rounded-md text-white"
                    >
                      Update Remark
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignmentRemarks;
