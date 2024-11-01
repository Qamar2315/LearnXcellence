import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";

function TeacherAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignment_document: null,
    deadline: "",
  });

  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data) {
        setAssignments(res.data);
      } else {
        setFlashMessage({
          status: true,
          message: "No assignments found.",
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to fetch assignments",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);

    // Conditionally append assignment_document only if it's provided
    if (formData.assignment_document) {
      formDataObj.append("assignment_document", formData.assignment_document);
    }

    // Format deadline as MM/DD/YYYY
    try {
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid Date Format");
      }
      const formattedDeadline = deadlineDate.toLocaleDateString("en-US"); // Format as MM/DD/YYYY
      formDataObj.append("deadline", formattedDeadline); // Append formatted string
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Please select a valid deadline date.",
        heading: "Error",
        type: "error",
      });
      return; // Stop submission if deadline is invalid
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/assignments/${courseId}`,
        formDataObj,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAssignments([...assignments, res.data.data]);
      setFlashMessage({
        status: true,
        message: "Assignment created successfully",
        heading: "Success",
        type: "success",
      });
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        assignment_document: null,
        deadline: "",
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to create assignment",
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

  const handleAssignmentClick = (assignmentId) => {
    navigate(`${assignmentId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold ">Assignments</h1>
            <div className="mr-5 mt-5 mb-2">
              {" "}
              {/* Add mt-2 for spacing below the heading */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={() => setShowForm(true)}
              >
                Create Assignment
              </button>
            </div>
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
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  onClick={() => handleAssignmentClick(assignment._id)}
                  className="bg-white shadow-lg rounded-lg p-6 mb-2 cursor-pointer hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{assignment.description}</p>
                  <p className="text-gray-500">
                    Deadline:{" "}
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No assignments available</p>
            )}
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">New Assignment</h2>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
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
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 bg-gray-400 rounded-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 rounded-md text-white"
                    >
                      Create
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

export default TeacherAssignment;
