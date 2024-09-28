import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext"; // Import FlashContext
import Success from "../components/Success"; // Assuming you have a Success component
import Alert from "../components/Alert"; // Assuming you have an Alert component

function ProjectDetail() {
  const { projectId } = useParams();
  const { courseId } = useParams();
  const { authState } = useContext(AuthContext);

  const { flashMessage, setFlashMessage } = useContext(FlashContext); // Get flash message context
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Error fetching project details.",
          heading: "Error",
          type: "error",
        });
        setLoading(false);
      });
  }, [projectId, authState, courseId, setFlashMessage]);

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
          navigate(`/course/${courseId}/project`); // Redirect to projects list
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to delete project.",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Error deleting project.",
          heading: "Error",
          type: "error",
        });
      });
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Project Details</h1>
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
            <p>Loading project details...</p>
          ) : project ? (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
              <p className="text-lg mb-6">{project.scope}</p>
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
                onClick={handleDelete}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Project
              </button>
            </div>
          ) : (
            <p>No project details available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
