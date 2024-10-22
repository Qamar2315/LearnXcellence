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
  const [announcements, setAnnouncements] = useState([]);

  const { courseId } = useParams();

  // Function to format date and remove time
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  // Fetch announcements
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/announcements/${courseId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          // Sort announcements by date in descending order
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
  }, [authState, courseId, setFlashMessage]);

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-5">
          <div className="grid grid-cols-7 h-[calc(90vh-4rem)]">
            {/* Left Section: Course Details */}
            <div className="col-span-4 bg-white ml-6 mt-6 shadow-lg rounded-lg p-6 h-[calc(90vh-4rem)] overflow-y-auto">
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
            </div>

            {/* Right Section: Announcements */}
            <div className="col-span-3 bg-white shadow-lg rounded-lg ml-6 mr-6 mt-6 p-6 h-[calc(90vh-4rem)] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Announcements
              </h2>
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement._id} className="m-4 border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600">{announcement.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(announcement.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p>No announcements available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
