import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext"; // Import FlashContext
import Success from "../components/Success"; // Assuming you have a Success component
import Alert from "../components/Alert"; // Assuming you have an Alert component

function Projects() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext); // Get flash message context
  const navigate = useNavigate();
  const { courseId } = useParams();

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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProjects(response.data.data.projects);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to fetch projects.",
            heading: "Error",
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Error fetching projects.",
          heading: "Error",
          type: "error",
        });
        setLoading(false);
      });
  }, [authState, courseId, setFlashMessage]); // Ensure to add setFlashMessage to dependency array

  const handleCardClick = (projectId) => {
    navigate(`/course/${courseId}/project/${projectId}`);
  };

  const truncateDescription = (description, length) => {
    return description.length > length
      ? description.substring(0, length) + "..."
      : description;
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Projects</h1>
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

          <div className="flex justify-end">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
              onClick={() => {
                navigate(`/course/${courseId}/addProject`);
              }}
            >
              Add Project
            </button>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleCardClick(project._id)}
                >
                  <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                  <p className="text-gray-600 mb-4">
                    {truncateDescription(project.scope, 100)}
                  </p>
                  <p className="text-sm text-gray-600 flex">
                    Leader:{"  "}
                    <div className=" text-sm text-green-600">
                      {project.projectLeader.name}
                    </div>
                  </p>
                  <p
                    className={`mt-3 max-w-[110px] px-3 py-1 rounded-full text-sm font-semibold text-center ${getStatusStyle(
                      project.status.status
                    )}`}
                  >
                    {project.status.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
