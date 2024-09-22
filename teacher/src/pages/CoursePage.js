import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [showSearchBox, setShowSearchBox] = useState(false); // Toggle search box visibility
  const [searchEmail, setSearchEmail] = useState("");
  const [studentInfo, setStudentInfo] = useState(null); // Store student info
  const { courseId } = useParams();
  const navigate = useNavigate();

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

  const deleteCourse = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/course/${courseId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Course Deleted",
            type: "success",
          });
          navigate("/teacherDashboard");
        } else {
          setFlashMessage({
            status: true,
            message: res.data.message || "Failed to delete course",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to delete course",
          heading: "Error",
          type: "error",
        });
      });
  };

  const searchStudent = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/course/search-student-by-email?search=${searchEmail}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setStudentInfo(res.data.data);
        } else {
          setFlashMessage({
            status: true,
            message: "Failed to find student",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to search student",
          heading: "Error",
          type: "error",
        });
      });
  };

  const addStudentToCourse = () => {
    if (!studentInfo) return;
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/course/${courseId}/add`,
        { studentId: studentInfo._id },
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
            message: "Student added successfully",
            heading: "Success",
            type: "success",
          });
          setStudentInfo(null);
          setShowSearchBox(false); // Hide search box after adding
        } else {
          setFlashMessage({
            status: true,
            message: res.data.message || "Failed to add student",
            heading: "Error",
            type: "error",
          });
          setStudentInfo(null);
          setShowSearchBox(false);
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to add student",
          heading: "Error",
          type: "error",
        });
        setStudentInfo(null);
        setShowSearchBox(false);
      });
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
          <p className="text-lg mb-6">{course.description}</p>

          <button
            onClick={deleteCourse}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Delete Course
          </button>

          {/* Add Student Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              {showSearchBox ? "Cancel" : "Add Student"}
            </button>

            {showSearchBox && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter student email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="border rounded p-2 mr-4"
                />
                <button
                  onClick={searchStudent}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Search Student
                </button>

                {studentInfo && (
                  <div className="mt-4">
                    <p>
                      <strong>Student Name:</strong> {studentInfo.name}
                    </p>
                    <button
                      onClick={addStudentToCourse}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2"
                    >
                      Add Student to Course
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flash messages */}
          {setFlashMessage.status && setFlashMessage.type === "success" && (
            <Success
              message={setFlashMessage.message}
              heading={setFlashMessage.heading}
            />
          )}
          {setFlashMessage.status && setFlashMessage.type === "error" && (
            <Alert
              message={setFlashMessage.message}
              heading={setFlashMessage.heading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
