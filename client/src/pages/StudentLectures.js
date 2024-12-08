import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext"; // Import Flash Context
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function StudentLectures() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [lectures, setLectures] = useState([]);
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);

  // Fetch lectures
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/lectures/${courseId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then((response) => {
        setLectures(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lectures:", error);
      });
  }, [authState.token, courseId]);

  // Download Lecture
  const handleDownloadLecture = (lectureId) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/lectures/${courseId}/lecture/${lectureId}/download`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
          responseType: "blob", // Important for downloading files
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `lecture_${lectureId}.mp4`); // Specify the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Failed to download lecture",
          heading: "Error",
          type: "error",
        });
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="h-full mx-auto p-5">
          <h1 className="text-3xl font-bold mb-4">Lectures</h1>

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

          {/* Lectures List with Scrollable Section */}
          <div className="max-h-[470px] overflow-y-auto border border-gray-300 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="bg-white p-4 rounded-lg shadow-md relative"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {lecture.title}
                  </h2>
                  <p
                    className="text-gray-700 truncate"
                    style={{ maxHeight: "4rem" }}
                  >
                    {lecture.description}
                  </p>
                  <video
                    className="w-full rounded-lg mt-2"
                    controls
                    src={`http://localhost:9090/lectures/${lecture.video_id}`}
                  ></video>

                  {/* Space between video and buttons */}
                  <div className="mt-10">
                    {/* Download Button */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                        onClick={() => handleDownloadLecture(lecture._id)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLectures;
