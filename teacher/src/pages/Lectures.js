import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext"; // Import Flash Context
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";

function Lectures() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [lectures, setLectures] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lecture_video: null,
  });
  const { courseId } = useParams();

  // Fetch lectures
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/lectures/${courseId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then((response) => {
        setLectures(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lectures:", error);
      });
  }, [authState.token, courseId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, lecture_video: e.target.files[0] });
  };

  // Upload Lecture
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("lecture_video", formData.lecture_video);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/lectures/${courseId}`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLectures([...lectures, response.data.data]);
        setShowUploadForm(false);
        setFlashMessage({
          status: true,
          message: "Lecture uploaded successfully!",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Failed to upload lecture",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Edit Lecture
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const editData = new FormData();
    editData.append("title", formData.title);
    editData.append("description", formData.description);
    editData.append("lecture_video", formData.lecture_video);

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/lectures/${courseId}/lecture/${selectedLecture._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        const updatedLectures = lectures.map((lecture) =>
          lecture._id === response.data.data._id ? response.data.data : lecture
        );
        setLectures(updatedLectures);
        setShowEditForm(false);
        setFlashMessage({
          status: true,
          message: "Lecture updated successfully!",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Failed to update lecture",
          heading: "Error",
          type: "error",
        });
      });
  };

  // Confirm Delete Lecture
  const confirmDeleteLecture = (lectureId) => {
    setSelectedLecture(lectureId);
    setShowDeleteConfirmation(true);
  };

  // Delete Lecture
  const handleDeleteLecture = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/lectures/${courseId}/lecture/${selectedLecture}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((response) => {
        setLectures(
          lectures.filter((lecture) => lecture._id !== selectedLecture)
        );
        setShowDeleteConfirmation(false);
        setFlashMessage({
          status: true,
          message: response.data.message,
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: "Failed to delete lecture",
          heading: "Error",
          type: "error",
        });
      });
  };

  const cancelForm = () => {
    setShowEditForm(false);
    setShowUploadForm(false);
    setShowDeleteConfirmation(false);
    setFormData({
      title: "",
      description: "",
      lecture_video: null,
    });
  };

  return (
    <div className="overflow-hidden">
      {" "}
      {/* Added this class to hide the scroll bar */}
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

          {/* Upload New Lecture Button */}
          <button
            className="mb-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
            onClick={() => setShowUploadForm(true)}
          >
            Upload New Lecture
          </button>

          {/* Lectures List with Scrollable Section */}
          <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-4">
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
                    {/* Edit and Delete Buttons */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded-lg"
                        onClick={() => {
                          setSelectedLecture(lecture);
                          setFormData({
                            title: lecture.title,
                            description: lecture.description,
                            lecture_video: null, // Reset file input for editing
                          });
                          setShowEditForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-lg"
                        onClick={() => confirmDeleteLecture(lecture._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Lecture Popup Form */}
          {showUploadForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Upload Lecture</h2>
                <form onSubmit={handleUploadSubmit}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border mb-4"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border mb-4"
                  ></textarea>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                    className="mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Lecture Popup Form */}
          {showEditForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Lecture</h2>
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border mb-4"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border mb-4"
                  ></textarea>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this lecture?</p>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="mr-2 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteLecture}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lectures;
