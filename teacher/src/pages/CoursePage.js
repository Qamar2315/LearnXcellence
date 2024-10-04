import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";

function CoursePage() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [course, setCourse] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showVivaPopup, setShowVivaPopup] = useState(false);
  const [editFormData, setEditFormData] = useState({
    courseName: "",
    description: "",
    projectRequirements: "",
  });
  const [projectDates, setProjectDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [vivaDates, setVivaDates] = useState({
    startDate: "",
    endDate: "",
  });

  const { courseId } = useParams();

  // Fetch course details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/course/${courseId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to load course details",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to load course",
          heading: "Error",
          type: "error",
        });
      });
  }, [authState, courseId, setFlashMessage]);

  // Handle Edit Button Click
  const handleEditButtonClick = () => {
    setEditFormData({
      courseName: course.courseName,
      description: course.description,
      projectRequirements: course.projectRequirements,
    });
    setShowEditPopup(true);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update Course
  const updateCourse = () => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/course/${courseId}`,
        editFormData,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Course Updated",
            type: "success",
          });
          setCourse(res.data.data);
          setShowEditPopup(false);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to update course",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to update course",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Handle Project Date Update
  const updateProjectDates = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/course/updateProject/${courseId}`,
        projectDates,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setFlashMessage({
            status: true,
            message: "Project Schedule Updated",
            heading: "Success",
            type: "success",
          });
          setCourse(res.data.data);
          setShowProjectPopup(false);
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message ||
            "Failed to update project schedule",
          heading: "Error",
          type: "error",
        });
      });
    console.log(projectDates);
  };

  // Handle Viva Date Update
  // Handle Viva Date Update
  const updateVivaDates = () => {
    // Check if the dates are valid
    if (!vivaDates.startDate || !vivaDates.endDate) {
      setFlashMessage({
        status: true,
        message: "Please enter both viva start and end dates.",
        heading: "Error",
        type: "error",
      });
      return;
    }

    const startDateObj = new Date(vivaDates.startDate);
    const endDateObj = new Date(vivaDates.endDate);

    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      setFlashMessage({
        status: true,
        message: "Invalid dates entered. Please provide valid dates.",
        heading: "Error",
        type: "error",
      });
      return;
    }

    // Proceed with updating the dates if validation passes
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/course/updateViva/${courseId}`,
        vivaDates,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setFlashMessage({
            status: true,
            message: "Viva Schedule Updated",
            heading: "Success",
            type: "success",
          });
          setCourse(res.data.data); // Update the course data with the new viva dates
          setShowVivaPopup(false);
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to update viva schedule",
          heading: "Error",
          type: "error",
        });
      });
    console.log(vivaDates);
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <div className="max-w-2xl mx-auto m-5">
            {flashMessage.status && flashMessage.type === "error" && (
              <Alert
                message={flashMessage.message}
                heading={flashMessage.heading}
              />
            )}
            {flashMessage.status && flashMessage.type === "success" && (
              <Success
                message={flashMessage.message}
                heading={flashMessage.heading}
              />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
          <p className="text-lg mb-2">
            <strong>Course Code:</strong> {course.courseCode}
          </p>
          <p className="text-lg mb-4">
            <strong>Description:</strong> {course.description}
          </p>
          <p className="text-lg mb-4">
            <strong>Project Requirements:</strong> {course.projectRequirements}
          </p>
          <p className="text-lg mb-4">
            <strong>Project Start Date:</strong>{" "}
            {course.projectStartDate || "Not Set"}
          </p>
          <p className="text-lg mb-4">
            <strong>Project End Date:</strong>{" "}
            {course.projectEndDate || "Not Set"}
          </p>
          <p className="text-lg mb-4">
            <strong>Viva Start Date:</strong>{" "}
            {course.vivaStartDate || "Not Set"}
          </p>
          <p className="text-lg mb-4">
            <strong>Viva End Date:</strong> {course.vivaEndDate || "Not Set"}
          </p>

          {/* Edit Course Button */}
          <button
            onClick={handleEditButtonClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Edit Course
          </button>

          {/* Update Project Dates Button */}
          <button
            onClick={() => setShowProjectPopup(true)}
            className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            Update Project Dates
          </button>

          {/* Update Viva Dates Button */}
          <button
            onClick={() => setShowVivaPopup(true)}
            className="mt-4 ml-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
          >
            Update Viva Dates
          </button>

          {/* Edit Course Popup */}
          {showEditPopup && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
                <label className="block mb-2">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={editFormData.courseName}
                  onChange={handleInputChange}
                  className="border rounded p-2 mb-4 w-full"
                />
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  className="border rounded p-2 mb-4 w-full"
                ></textarea>
                <label className="block mb-2">Project Requirements</label>
                <textarea
                  name="projectRequirements"
                  value={editFormData.projectRequirements}
                  onChange={handleInputChange}
                  className="border rounded p-2 mb-4 w-full"
                ></textarea>
                <button
                  onClick={updateCourse}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="ml-4 px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Project Date Popup */}
          {showProjectPopup && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  Update Project Dates
                </h2>
                <label className="block mb-2">Project Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={projectDates.startDate}
                  onChange={(e) =>
                    setProjectDates({
                      ...projectDates,
                      startDate: e.target.value,
                    })
                  }
                  className="border rounded p-2 mb-4 w-full"
                />
                <label className="block mb-2">Project End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={projectDates.endDate}
                  onChange={(e) =>
                    setProjectDates({
                      ...projectDates,
                      endDate: e.target.value,
                    })
                  }
                  className="border rounded p-2 mb-4 w-full"
                />
                <button
                  onClick={updateProjectDates}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Save Project Dates
                </button>
                <button
                  onClick={() => setShowProjectPopup(false)}
                  className="ml-4 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Viva Date Popup */}
          {showVivaPopup && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Update Viva Dates</h2>
                <label className="block mb-2">Viva Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={vivaDates.startDate}
                  onChange={(e) =>
                    setVivaDates({ ...vivaDates, startDate: e.target.value })
                  }
                  className="border rounded p-2 mb-4 w-full"
                />
                <label className="block mb-2">Viva End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={vivaDates.endDate}
                  onChange={(e) =>
                    setVivaDates({ ...vivaDates, endDate: e.target.value })
                  }
                  className="border rounded p-2 mb-4 w-full"
                />
                <button
                  onClick={updateVivaDates}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                >
                  Save Viva Dates
                </button>
                <button
                  onClick={() => setShowVivaPopup(false)}
                  className="ml-4 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
