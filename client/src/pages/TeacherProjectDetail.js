import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherProjectDetail() {
  const { projectId, courseId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditStatusPopup, setShowEditStatusPopup] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [statusDescription, setStatusDescription] = useState("");
  const [statusId, setStatusId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-300 text-yellow-800";
      case "approved":
        return "bg-green-300 text-green-800";
      case "disapproved":
        return "bg-red-300 text-red-800";
      case "unsatisfactory":
        return "bg-orange-300 text-orange-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  // Function to fetch the status of the project
  const fetchProjectStatus = (statusId) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/status/${courseId}/${projectId}/${statusId}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProjectStatus(response.data.data.status); // Set project status
          setStatusDescription(response.data.data.description); // Set status description
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to fetch project status.",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error fetching project status.",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Function to fetch the project details and status
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProject(response.data.data);
          setStatusId(response.data.data.status);
          if (response.data.data.status) {
            fetchProjectStatus(response.data.data.status);
          }
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to fetch project details.",
            heading: "Error",
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error fetching project details.",
          heading: "Error",
          type: "error",
        });
        setLoading(false);
      });
  }, [projectId, authState, courseId, setFlashMessage]);

  // Function to handle status update
  const handleStatusUpdate = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/status/${courseId}/${projectId}/${statusId}`,
        {
          status: newStatus,
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProjectStatus(response.data.data.status);
          setStatusDescription(response.data.data.description);
          setFlashMessage({
            status: true,
            message: "Status updated successfully",
            heading: "Success",
            type: "success",
          });
          setShowEditStatusPopup(false);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to update status.",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Error adding member.";
        setFlashMessage({
          status: true,
          message: errorMessage,
          heading: "Error",
          type: "error",
        });
      });
    setShowEditStatusPopup(false);
  };

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Project Details</h1>
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
          ) : project ? (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {projectStatus && (
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        projectStatus
                      )}`}
                    >
                      {projectStatus}
                    </span>
                    {statusDescription && (
                      <p className="text-gray-600 text-sm mt-2">
                        {statusDescription}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-lg mb-6">{project.scope}</p>
              <p className="text-lg mb-6">
                Viva:{" "}
                {project.viva ? (
                  <span className="text-green-600">Scheduled</span>
                ) : (
                  "Not Scheduled"
                )}
              </p>

              <div>
                <h2 className="text-xl font-semibold mb-2">Members:</h2>
                <ul className="list-disc ml-5 mb-4">
                  {project.members.map((member) => (
                    <li key={member._id} className="mb-1">
                      {member.name}{" "}
                      {member.isGroupLeader && (
                        <span className="text-green-600">(Leader)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowEditStatusPopup(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Edit Status
              </button>
            </div>
          ) : (
            <p>No project details available</p>
          )}

          {/* Edit Status Popup */}
          {showEditStatusPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Status</h2>
                <label>Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="">Select Status</option>
                  {/* <option value="unsatisfactory">Unsatisfactory</option> */}
                  <option value="approved">Approved</option>
                  <option value="disapproved">Disapproved</option>
                </select>
                <label>Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 mr-2 bg-gray-300 rounded"
                    onClick={() => setShowEditStatusPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleStatusUpdate}
                  >
                    Save Changes
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

export default TeacherProjectDetail;
