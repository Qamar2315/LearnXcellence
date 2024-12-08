import React from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import ClassCard from "../components/ClassCard";
import axios from "axios";
import Navbar from "../components/Navbar";
import ClassNotJoinedMessage from "../components/ClassNotJoinedMessage";
import Success from "../components/Success";
import Alert from "../components/Alert";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function StudentDashboard() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-5">
        <div className="flex justify-between items-start">
          <h1 className="text-5xl font-bold ml-16">Courses</h1>

          <div className="mr-20 mt-5">
            {" "}
            <Link
              to={"/joinClass"}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Join New Course
            </Link>
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
          <div className="m-5 h-[calc(80svh-4rem)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 m-10">
              {courses.map((classItem) => (
                // <Link to={`/course/${classItem._id}`}>
                <ClassCard
                  key={classItem._id}
                  id={classItem._id}
                  className={classItem.courseName}
                  teacher={classItem.teacher.name}
                />
                // </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
