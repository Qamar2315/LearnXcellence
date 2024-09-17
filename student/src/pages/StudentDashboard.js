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

function StudentDashboard() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
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

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-5">
        <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>
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
        <div className="flex justify-end mr-20">
          {" "}
          <Link
            to={"/joinClass"}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Join New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <ClassNotJoinedMessage />
        ) : (
          <div className="overflow-y-auto h-96 m-10 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 m-10">
              {courses.map((classItem) => (
                <ClassCard
                  key={classItem._id}
                  id={classItem._id}
                  className={classItem.courseName}
                  teacher={classItem.teacher.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
