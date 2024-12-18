import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { useNavigate } from "react-router-dom";
import ClassCard from "../components/ClassCard";
import axios from "axios";
import Navbar from "../components/Navbar";
import ClassNotJoinedMessage from "../components/ClassNotCreatedMessage";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherClassCard from "../components/TeacherClassCard";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherDashboard() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false); // State for showing the form
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    projectRequirements: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.status && !authState.isTeacher) {
      navigate("/login");
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/course/getAll`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data.courses);
          setLoading(false);
        } else {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Something went wrong",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to fetch courses",
          heading: "Error",
          type: "error",
        });
      });
  }, [authState, navigate, setFlashMessage]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle course creation
  const handleCreateCourse = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/course/create`, courseData, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFlashMessage({
            status: true,
            message: "Course Created Successfully",
            heading: "Success",
            type: "success",
          });
          setCourses([...courses, res.data.data]); // Update course list
          setCourseData({
            courseName: "",
            description: "",
            projectRequirements: "",
          });
          setShowCreateForm(false); // Close the form after creation
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Course Creation Failed",
          heading: "Error",
          type: "error",
        });
        setShowCreateForm(false);
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div>
      <TeacherNavbar />

      <div className=" container mx-auto mt-5">
        <div className="flex justify-between items-start">
          <h1 className="text-5xl font-bold ml-16">Courses</h1>
          <div className="mr-20 mt-5">
            {" "}
            {/* Add mt-2 for spacing below the heading */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setShowCreateForm(true)} // Show form on button click
            >
              Create New Course
            </button>
          </div>
        </div>

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

        {courses.length === 0 ? (
          <ClassNotJoinedMessage />
        ) : (
          <div className=" m-5 h-[calc(80svh-4rem)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 m-10">
              {courses.map((classItem) => (
                <TeacherClassCard
                  key={classItem._id}
                  id={classItem._id}
                  className={classItem.courseName}
                  teacher={classItem.teacher.name}
                />
              ))}
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Create Course
              </h2>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={courseData.courseName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter course description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Project Requirements
                  </label>
                  <textarea
                    name="projectRequirements"
                    value={courseData.projectRequirements}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter project requirements"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-700 text-white font py-2 px-4 rounded-lg"
                    onClick={() => setShowCreateForm(false)} // Close form without submitting
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font py-2 px-4 rounded-lg"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
