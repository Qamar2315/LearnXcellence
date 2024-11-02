import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { FaFile } from "react-icons/fa";

function TeacherAssignmentDetails() {
  const { courseId, assignmentId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignment_document: null,
    deadline: "",
  });

  const navigate = useNavigate();

  // Fetch assignment details
  const fetchAssignment = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}/assignment/${assignmentId}`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      const deadlineDate = new Date(res.data.deadline);
      const formattedDeadline = deadlineDate.toISOString().split("T")[0];
      setAssignment(res.data);
      setFormData({
        title: res.data.title,
        description: res.data.description,
        assignment_document: null,
        deadline: formattedDeadline,
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to fetch assignment details.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/${courseId}/assignment/${assignmentId}`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setSubmissions(res.data);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to fetch submissions.",
        heading: "Error",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchAssignment();
    fetchSubmissions();
  }, []);

  // Update in handleEditAssignment function before submission
  const handleEditAssignment = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    if (formData.assignment_document) {
      formDataObj.append("assignment_document", formData.assignment_document);
    }

    try {
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid Date Format");
      }
      const formattedDeadline = deadlineDate.toLocaleDateString("en-US");
      formDataObj.append("deadline", formattedDeadline); // Append formatted deadline

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}/assignment/${assignmentId}`,
        formDataObj,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAssignment(res.data.data);
      setFlashMessage({
        status: true,
        message: "Assignment updated successfully.",
        heading: "Success",
        type: "success",
      });
      setShowEditForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to update assignment.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Confirm Delete Lecture
  const confirmDeleteLecture = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteAssignment = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}/assignment/${assignmentId}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setFlashMessage({
        status: true,
        message: "Assignment deleted successfully.",
        heading: "Success",
        type: "success",
      });
      navigate(-1);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to delete assignment.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />

        <div className="container mx-auto mt-5 p-5 grid grid-cols-2 gap-4">
          {/* Assignment Details Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">Assignment Details</h1>
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
              <p>Loading assignment details...</p>
            ) : assignment ? (
              <div>
                <h2 className="text-3xl font-bold">{assignment.title}</h2>
                <p className="text-lg mt-4">{assignment.description}</p>
                <p className="text-lg mt-4">
                  Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                </p>
                {assignment.document_id && (
                  <div className="flex items-center mt-4">
                    <FaFile className="text-2xl text-gray-500 mr-2" />
                    <span>{assignment.document_id.split("-")[1]}</span>
                  </div>
                )}
                <button
                  onClick={() => setShowEditForm(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit Assignment
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="mt-4 ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Assignment
                </button>
              </div>
            ) : (
              <p>No assignment details available.</p>
            )}
          </div>

          {/* Submissions Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-auto h-[500px]">
            <h2 className="text-2xl font-bold mb-4">Student Submissions</h2>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div
                  key={submission._id}
                  onClick={() => navigate(`submission/${submission._id}`)}
                  className="flex items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={`http://localhost:9090/profile_pictures/${submission.student.account.profile_picture}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {submission.student.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {submission.student.account.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No submissions available.</p>
            )}

            {/* Edit Assignment Form Popup */}
            {showEditForm && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Edit Assignment</h2>
                  <form onSubmit={handleEditAssignment} className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="file"
                      name="assignment_document"
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="px-4 py-2 bg-gray-400 rounded-md text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 rounded-md text-white"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Popup */}
            {showDeleteConfirmation && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                  <p>Are you sure you want to delete this Assignment?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmation(false)}
                      className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAssignment}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignmentDetails;
