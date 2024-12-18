import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams, useNavigate } from "react-router-dom";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherCourseSetting() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [regeneratedCourseCode, setRegeneratedCourseCode] = useState("");
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setStudents(response.data.data.students);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setFlashMessage({
          status: true,
          message: "Failed to load students",
          heading: "Error",
          type: "error",
        });
      }
    };
    fetchStudents();
  }, [authState.token, courseId, setFlashMessage, studentInfo]);

  const removeStudent = async (studentId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/course/${courseId}/remove`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (response.data.success) {
        setStudents(students.filter((student) => student._id !== studentId));
        setConfirmationVisible(false);
        setFlashMessage({
          status: true,
          message: response.data.message,
          heading: "Student Removed",
          type: "success",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to remove student",
        heading: "Error",
        type: "error",
      });
    }
  };

  const deleteCourse = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        setFlashMessage({
          status: true,
          message: "Course deleted successfully",
          heading: "Success",
          type: "success",
        });

        // Delay navigation slightly to ensure flash message is visible
        setTimeout(() => {
          navigate("/course/teacher");
        }, 100); // Adjust delay if needed
      } else {
        setFlashMessage({
          status: true,
          message: response.data.message || "Failed to delete course",
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error); // Log for debugging
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to delete course",
        heading: "Error",
        type: "error",
      });
    }
  };

  const searchStudent = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/course/search-student-by-email?search=${searchEmail}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
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
          message: "Failed to search student",
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
        });
        setStudentInfo(null);
        setShowSearchBox(false);
      });
  };

  const regenerateCourseCode = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/course/${courseId}/regenerate-course-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        setRegeneratedCourseCode(response.data.data.courseCode); // Set the new course code
        setFlashMessage({
          status: true,
          message: response.data.message,
          heading: "Success",
          type: "success",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to regenerate course code",
        heading: "Error",
        type: "error",
      });
    }
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
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Course Settings</h1>

          {/* Flash messages */}
          <div className="max-w-2xl mx-auto">
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

          <div className="flex justify-between">
            <button
              onClick={() => setDeleteConfirmationVisible(true)}
              className=" mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
            >
              Delete Course
            </button>

            <button
              onClick={() => setShowSearchBox(!showSearchBox)}
              className=" mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
            >
              {showSearchBox ? "Cancel" : "Add Student"}
            </button>
          </div>

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
                className=" mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
              >
                Search Student
              </button>

              {studentInfo && (
                <div className="mt-4">
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      className="h-12 w-12 flex-none rounded-lg bg-gray-50"
                      src={
                        `http://localhost:9090/profile_pictures/${studentInfo.account.profile_picture}` ||
                        "https://via.placeholder.com/150"
                      }
                      alt={studentInfo.name}
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {studentInfo.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {studentInfo.account.email}
                      </p>
                      <button
                        onClick={addStudentToCourse}
                        className=" mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
                      >
                        Add Student to Course
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-3">
            <button
              onClick={regenerateCourseCode} // Regenerate Course Code button
              className=" mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
            >
              Regenerate Course Code
            </button>

            {/* Display the regenerated course code */}
            {regeneratedCourseCode && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">New Course Code:</p>
                  <button
                    className="text-500 hover:text-700 text-2xl font-bold"
                    onClick={() => setRegeneratedCourseCode("")}
                  >
                    ×
                  </button>
                </div>
                <p className="text-xl text-green-600">
                  {regeneratedCourseCode}
                </p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mt-6 mb-4">Course Members</h2>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="max-h-64 overflow-y-scroll border border-gray-300 rounded-lg p-4">
              {students.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <li
                      key={student._id}
                      className="flex justify-between gap-x-6 py-5"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <img
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          src={
                            `http://localhost:9090/profile_pictures/${student.account.profile_picture}` ||
                            "https://via.placeholder.com/150"
                          }
                          alt={student.name}
                        />
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {student.name}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            {student.account.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setConfirmationVisible(true);
                            setStudentToRemove(student._id);
                          }}
                          className=" mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105 self-end "
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students in this course</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Remove Student Confirmation Modal */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Remove Student</h2>
            <p>Are you sure you want to remove this student from the course?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => removeStudent(studentToRemove)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {deleteConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Delete Course</h2>
            <p>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={deleteCourse}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteConfirmationVisible(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherCourseSetting;
