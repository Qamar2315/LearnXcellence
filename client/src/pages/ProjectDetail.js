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

function ProjectDetail() {
  const { projectId, courseId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditMemberPopup, setShowEditMemberPopup] = useState(false);
  const [editName, setEditName] = useState("");
  const [editScope, setEditScope] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [projectStatus, setProjectStatus] = useState(""); // New state for project status
  const [statusDescription, setStatusDescription] = useState(""); // New state for status description
  const navigate = useNavigate();
  const [isLeader, setIsLeader] = useState(false); // State to check if user is leader
  const [availableMembers, setAvailableMembers] = useState([]); // Members available for addition
  const [newMember, setNewMember] = useState(""); // New members to be added
  const [viva, setViva] = useState("");

  // Fetch available members (you can modify the endpoint accordingly)
  const fetchAvailableMembers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setAvailableMembers(response.data.data.students); // Set available members
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to fetch available members.",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error fetching available members.",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Function to add a single member
  const handleAddMember = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/${projectId}/${newMember}/add-member`, // Updated the URL
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProject(response.data.data);
          setSelectedMembers(response.data.data.members);
          setFlashMessage({
            status: true,
            message: "Member added successfully",
            heading: "Success",
            type: "success",
          });
          setShowEditMemberPopup(false); // Close popup after adding member
        } else {
          setFlashMessage({
            status: true,
            message: response.data.message || "Failed to add member.", // Fallback message
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Error adding member."; // Access the response message if available
        setFlashMessage({
          status: true,
          message: errorMessage,
          heading: "Error",
          type: "error",
        });
      });
  };

  // Delete Project
  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setFlashMessage({
            status: true,
            message: response.data.message,
            heading: "Success",
            type: "success",
          });
          navigate(`/course/${courseId}/project`); // Redirect after delete
        } else {
          setFlashMessage({
            status: true,
            message: response.data.message,
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error deleting project.",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Edit Project
  const handleEditSubmit = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/${projectId}`,
        {
          name: editName,
          scope: editScope,
          members: selectedMembers, // Existing members IDs
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProject(response.data.data); // Update project with new details
          // Update selectedMembers as well
          setFlashMessage({
            status: true,
            message: "Project updated successfully",
            heading: "Success",
            type: "success",
          });
          setShowEditPopup(false); // Close popup after edit
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to update project.",
            heading: "Error",
            type: "error",
          });
        }
        console.log({
          name: editName,
          scope: editScope,
          members: selectedMembers, // Existing members IDs
        });
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error updating project.",
          heading: "Error",
        });
      });
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

  // Function to get the status style based on its value
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

  const removeMember = (memberId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/${projectId}/${memberId}/remove-member`,
        {}, // Send an empty object or the required data here if needed
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProject(response.data.data);
          setSelectedMembers(response.data.data.members);
          setFlashMessage({
            status: true,
            message: response.data.message,
            heading: "Success",
            type: "success",
          });
          // Update the project state with the new data
          // If there's a status description to set, you can uncomment the next line
          // setStatusDescription(response.data.data.description);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to remove student.",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Error while removing student.",
          heading: "Error",
          type: "error",
        });
      });
  };

  //add viva

  const addViva = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/viva/${courseId}/${projectId}/add`, // Updated the URL
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          // setProject(response.data.data);
          // setSelectedMembers(response.data.data.members);
          setFlashMessage({
            status: true,
            message: response.data.message || "Member added successfully",
            heading: "Success",
            type: "success",
          });
        } else {
          setFlashMessage({
            status: true,
            message: response.data.message || "Failed to add viva.", // Fallback message
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Error adding viva."; // Access the response message if available
        setFlashMessage({
          status: true,
          message: errorMessage,
          heading: "Error",
          type: "error",
        });
      });
  };

  // Fetch project details
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
          const projectData = response.data.data;
          setProject(projectData);
          setEditName(projectData.name); // Set initial values for edit form
          setEditScope(projectData.scope);
          setSelectedMembers(projectData.members); // Extract member IDs

          if (response.data.data.viva) {
            setViva(response.data.data.viva);
          }

          // Fetch project status using the statusId from the project details
          if (response.data.data.status) {
            fetchProjectStatus(response.data.data.status);
          }

          // Check if the current user is the leader
          const leader = projectData.members.find(
            (member) => member.isGroupLeader
          );
          if (leader && leader._id === authState.id) {
            setIsLeader(true); // The authenticated user is the leader
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
    fetchAvailableMembers();
  }, [setSelectedMembers, projectId, authState, courseId, flashMessage]);

  const goToViva = () => {
    navigate(`${viva}`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
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
                {/* Project Name */}
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {/* Status Badge */}
                {projectStatus && (
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        projectStatus
                      )}`}
                    >
                      {projectStatus}
                    </span>
                    {/* Status Description */}
                    {statusDescription && (
                      <p className=" text-gray-600 text-sm mt-2">
                        feedback: {statusDescription}
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
                  {selectedMembers.map((member) => (
                    <li
                      key={member._id}
                      className="mb-1 flex justify-between items-center"
                    >
                      <span>
                        {member.name}{" "}
                        {member.isGroupLeader && (
                          <span className="text-green-600">(Leader)</span>
                        )}
                      </span>

                      {isLeader && !member.isGroupLeader && (
                        <button
                          onClick={() => removeMember(member._id)}
                          className="text-gray-500 transition hover:text-gray-600"
                        >
                          <span className="sr-only">Remove member</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditionally render the Edit and Delete buttons if the user is the project leader */}
              {isLeader && (
                <div>
                  {/* <button
                    onClick={() => setShowEditMemberPopup(true)}
                    disabled={project.viva ? true : false}
                    className="mt-4 mr-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Add Member
                  </button> */}
                  <button
                    onClick={() => setShowEditMemberPopup(true)}
                    disabled={project.viva ? true : false} // Disable if project.viva exists
                    className={`mt-4 mr-2 px-4 py-2 text-white rounded-lg transition duration-200 ${
                      project.viva
                        ? "bg-gray-400 cursor-not-allowed" // Gray background and not-allowed cursor when disabled
                        : "bg-green-500 hover:bg-green-600 cursor-pointer" // Green background when enabled
                    }`}
                  >
                    Add Member
                  </button>

                  <button
                    onClick={() => setShowEditPopup(true)}
                    disabled={project.viva ? true : false} // Disable if project.viva exists
                    className={`mt-4 mr-2 px-4 py-2 text-white rounded-lg transition duration-200 ${
                      project.viva
                        ? "bg-gray-400 cursor-not-allowed" // Gray background when disabled
                        : "bg-blue-500 hover:bg-blue-600 cursor-pointer" // Blue background when enabled
                    }`}
                  >
                    Edit Project
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    disabled={project.viva ? true : false} // Disable if project.viva exists
                    className={`mt-4 mr-2 px-4 py-2 text-white rounded-lg transition duration-200 ${
                      project.viva
                        ? "bg-gray-400 cursor-not-allowed" // Gray background when disabled
                        : "bg-red-600 hover:bg-red-700 cursor-pointer" // Red background when enabled
                    }`}
                  >
                    Delete Project
                  </button>

                  {/* <button
                    onClick={() => setShowEditPopup(true)}
                    className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Edit Project
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="mt-4 mr-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Delete Project
                  </button> */}

                  {project.viva ? (
                    <button
                      onClick={goToViva}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      View Viva
                    </button>
                  ) : (
                    <button
                      onClick={addViva}
                      className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
                    >
                      Schedule Viva
                    </button>
                  )}

                  {!project.viva && (
                    <p className="text-red-600">
                      Note: After scheduling viva you can not add member, edit
                      and delete project
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No project details available</p>
          )}

          {/* Edit Project Popup */}
          {showEditPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
                <label>Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <label>Project Scope</label>
                <textarea
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 mr-2 bg-gray-300 rounded"
                    onClick={() => setShowEditPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleEditSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this Project?</p>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditMemberPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Add Member</h2>
                <label>Select Member to Add</label>
                <select
                  value={newMember} // Change to single member ID state
                  onChange={(e) => setNewMember(e.target.value)} // Set the selected member ID
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="">Select a member</option>
                  {/* Placeholder option */}
                  {availableMembers
                    .filter(
                      (member) =>
                        !project.members.some(
                          (currentMember) => currentMember._id === member._id
                        )
                    ) // Filter out existing members
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 mr-2 bg-gray-300 rounded"
                    onClick={() => setShowEditMemberPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleAddMember} // This function adds the selected member
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* {showRemovalConfirmation && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirm Removal</h2>
                <p>Are you sure you want to remove this member?</p>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => removeMember(member._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
