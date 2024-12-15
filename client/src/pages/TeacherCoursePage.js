import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import Success from "../components/Success";
import Alert from "../components/Alert";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherCoursePage() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [course, setCourse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [showEditAnnouncementPopup, setShowEditAnnouncementPopup] =
    useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [editAnnouncement, setEditAnnouncement] = useState({
    _id: "",
    title: "",
    content: "",
  });

  const { courseId } = useParams();
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

    axios
      .get(`${process.env.REACT_APP_API_URL}/announcements/${courseId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          const sortedAnnouncements = res.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setAnnouncements(sortedAnnouncements);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to load announcements",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to load announcements",
          heading: "Error",
          type: "error",
        });
      });
  }, [authState, courseId, setFlashMessage, flashMessage]);

  // Fetch announcements

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
        `
        ${process.env.REACT_APP_API_URL}/course/${courseId}`,
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

  // Function to format date and remove time
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle Project Date Update
  const updateProjectDates = () => {
    axios
      .put(
        `
        ${process.env.REACT_APP_API_URL}/course/updateProject/${courseId}`,
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

    // Format the dates as MM/DD/YYYY
    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const formattedVivaDates = {
      startDate: formatDate(startDateObj),
      endDate: formatDate(endDateObj),
    };

    // Proceed with updating the dates if validation passes
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/course/updateViva/${courseId}`,
        formattedVivaDates,
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
    console.log(formattedVivaDates);
  };

  // Handle Add Announcement Button Click
  const handleAddAnnouncementClick = () => {
    setNewAnnouncement({ title: "", content: "" });
    setShowAnnouncementPopup(true);
  };

  // Handle Create Announcement
  const createAnnouncement = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/announcements/${courseId}`,
        newAnnouncement,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAnnouncements([...announcements, res.data.data]); // Append new announcement
          setFlashMessage({
            status: true,
            message: "Announcement created successfully",
            heading: "Success",
            type: "success",
          });
          setShowAnnouncementPopup(false);
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to create announcement",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Handle Edit Announcement
  const updateAnnouncement = () => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/announcements/${courseId}/announcement/${editAnnouncement._id}`,
        { title: editAnnouncement.title, content: editAnnouncement.content },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAnnouncements(
            announcements.map((ann) =>
              ann._id === editAnnouncement._id ? res.data.data : ann
            )
          );
          setFlashMessage({
            status: true,
            message: "Announcement updated successfully",
            heading: "Success",
            type: "success",
          });
          setShowEditAnnouncementPopup(false);
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to update announcement",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Handle Delete Announcement
  const deleteAnnouncement = (announcementId) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/announcements/${courseId}/announcement/${announcementId}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAnnouncements(
            announcements.filter((ann) => ann._id !== announcementId)
          );
          setFlashMessage({
            status: true,
            message: "Announcement deleted successfully",
            heading: "Success",
            type: "success",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to delete announcement",
          heading: "Error",
          type: "error",
        });
      });
  };

  if (!course) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="flex-grow p-5">
          {/* Flash Notifications */}
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

          {/* Main Content: Split View */}
          <div className="grid grid-cols-7 h-[calc(90vh-4rem)]">
            {/* Left: Course Details */}
            <div className="col-span-4 border-r pr-4 p-5  bg-white shadow-lg rounded-lg  h-[calc(90vh-4rem)] overflow-y-auto">
              <div className="border-b pb-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {course.courseName}
                </h1>
                <p className="text-lg text-gray-600">
                  <strong>Course Code:</strong> {course.courseCode}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  <strong>Description:</strong> {course.description}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  <strong>Project Requirements:</strong>{" "}
                  {course.projectRequirements}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-lg text-gray-600">
                  <strong>Project Schedule:</strong>
                </div>
                <div className="text-right">
                  <p className="text-lg text-gray-600">
                    {course.projectStartDate
                      ? formatDate(course.projectStartDate)
                      : "Not Set"}{" "}
                    -{" "}
                    {course.projectEndDate
                      ? formatDate(course.projectEndDate)
                      : "Not Set"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-lg text-gray-600">
                  <strong>Viva Schedule:</strong>
                </div>
                <div className="text-right">
                  <p className="text-lg text-gray-600">
                    {course.vivaStartDate
                      ? formatDate(course.vivaStartDate)
                      : "Not Set"}{" "}
                    -{" "}
                    {course.vivaEndDate
                      ? formatDate(course.vivaEndDate)
                      : "Not Set"}
                  </p>
                </div>
              </div>

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
                    <h2 className="text-2xl font-bold mb-4">
                      Update Viva Dates
                    </h2>
                    <label className="block mb-2">Viva Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={vivaDates.startDate}
                      onChange={(e) =>
                        setVivaDates({
                          ...vivaDates,
                          startDate: e.target.value,
                        })
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

            {/* Right: Announcements Section */}
            <div className="col-span-3 bg-white shadow-lg rounded-lg ml-6 mr-6 pl-6 pr-6 h-[calc(90vh-4rem)] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-4">Announcements</h2>
              <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 "
                onClick={handleAddAnnouncementClick}
              >
                Add Announcement
              </button>
              <ul>
                {announcements.map((announcement) => (
                  <li
                    key={announcement._id}
                    className="mb-4 p-4 border rounded shadow-lg"
                  >
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p>{announcement.content}</p>
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => {
                        setEditAnnouncement(announcement);
                        setShowEditAnnouncementPopup(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 ml-4 mt-2"
                      onClick={() => deleteAnnouncement(announcement._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Popup */}
      {showAnnouncementPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add Announcement</h2>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value,
                })
              }
              className="border rounded p-2 mb-4 w-full"
            />
            <label className="block mb-2">Content</label>
            <textarea
              name="content"
              value={newAnnouncement.content}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  content: e.target.value,
                })
              }
              className="border rounded p-2 mb-4 w-full"
            ></textarea>
            <button
              onClick={createAnnouncement}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Add
            </button>
            <button
              onClick={() => setShowAnnouncementPopup(false)}
              className="ml-4 px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Announcement Popup */}
      {showEditAnnouncementPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Announcement</h2>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={editAnnouncement.title}
              onChange={(e) =>
                setEditAnnouncement({
                  ...editAnnouncement,
                  title: e.target.value,
                })
              }
              className="border rounded p-2 mb-4 w-full"
            />
            <label className="block mb-2">Content</label>
            <textarea
              name="content"
              value={editAnnouncement.content}
              onChange={(e) =>
                setEditAnnouncement({
                  ...editAnnouncement,
                  content: e.target.value,
                })
              }
              className="border rounded p-2 mb-4 w-full"
            ></textarea>
            <button
              onClick={updateAnnouncement}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Update
            </button>
            <button
              onClick={() => setShowEditAnnouncementPopup(false)}
              className="ml-4 px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherCoursePage;

// return (
//   <div className="h-screen flex flex-col">
//     <TeacherNavbar />
//     <div className="flex">
//       <TeacherSidebar />
//       <div className="container mx-auto mt-5 p-5">

//       </div>
//     </div>
//   </div>
// );
