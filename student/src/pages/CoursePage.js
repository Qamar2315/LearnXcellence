// CoursePage.js
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
  const { setFlashMessage } = useContext(FlashContext);
  const [course, setCourse] = useState(null);
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

  const leaveCourse = () => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/course/${courseId}/leave`,
        {},
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
            heading: "Course Left",
            type: "success",
          });
          navigate("/studentDashboard");
        } else {
          setFlashMessage({
            status: true,
            message: res.data.message || "Failed to leave course",
            heading: "Error",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to leave course",
          heading: "Error",
          type: "error",
        });
      });
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
          <p className="text-lg mb-6">{course.description}</p>
          <button
            onClick={leaveCourse}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Leave Course
          </button>
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
