import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { AuthContext } from "../helpers/AuthContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { FlashContext } from "../helpers/FlashContext"; // Import FlashContext
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherVivaDetails() {
  const [viva, setViva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedVivaDate, setUpdatedVivaDate] = useState("");
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [showRemarkForm, setShowRemarkForm] = useState(false);
  const { authState } = useContext(AuthContext);
  const { courseId, vivaId } = useParams();
  const navigate = useNavigate();
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [projectId, setProjectId] = useState("");
  const [questionType, setQuestionType] = useState("general");

  const [remarks, setRemarks] = useState({}); // Store the remark data
  const [remarkFormData, setRemarkFormData] = useState({
    overallPerformance: "Good",
    feedback: "",
    obtainedMarks: 0,
    totalMarks: 100,
  });

  // Fetch viva details
  const fetchVivaDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/viva/${courseId}/${vivaId}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.success) {
        setViva(res.data.data.viva);
        setUpdatedStatus(res.data.data.viva.status);
        setUpdatedVivaDate(res.data.data.viva.vivaDate);
        setProjectId(res.data.data.project_id);
        if (res.data.data.viva.remarks) {
          setRemarks(res.data.data.viva.remarks);
        }
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch viva details",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update viva details
  const updateViva = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/viva/${courseId}/${vivaId}`,
        {
          status: updatedStatus,
          vivaDate: updatedVivaDate,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.success) {
        setFlashMessage({
          status: true,
          message: "Viva updated successfully",
          heading: "Success",
          type: "success",
        });
        setShowEditForm(false);
        fetchVivaDetails(); // Refresh the details after update
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update viva",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Fetch viva questions
  const fetchVivaQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/viva/${courseId}/${projectId}/generate-viva-questions?numberOfQuestions=${numQuestions}&difficulty=${difficulty}&questionType=${questionType}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.success) {
        setQuestions(res.data.data);
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to generate questions",
        heading: "Error",
        type: "error",
      });
    } finally {
      setQuestionsLoading(false);
    }
  };

  const addRemarks = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/remarks/viva/${courseId}/${projectId}/add`,
        remarkFormData,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.success) {
        setFlashMessage({
          status: true,
          message: "Remarks added successfully",
          heading: "Success",
          type: "success",
        });
        setShowRemarkForm(false);
        fetchVivaDetails(); // Refresh the details after update
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to add remarks",
        heading: "Error",
        type: "error",
      });
      setShowRemarkForm(false);
    }
  };

  // Edit Remarks (PUT)
  const editRemarks = async () => {
    console.log(remarkFormData);
    const remarkId = remarks._id;
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/remarks/viva/${courseId}/${vivaId}/${remarkId}`,
        {
          overallPerformance: remarkFormData.overallPerformance,
          feedback: remarkFormData.feedback,
          obtainedMarks: remarkFormData.obtainedMarks,
          totalMarks: remarkFormData.totalMarks,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.success) {
        setFlashMessage({
          status: true,
          message: "Remarks updated successfully",
          heading: "Success",
          type: "success",
        });
        setShowRemarkForm(false);
        fetchVivaDetails(); // Refresh the details after update
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update remarks",
        heading: "Error",
        type: "error",
      });
      setShowRemarkForm(false);
    }
  };

  // Handle Remark Form Submit
  const handleRemarkSubmit = (e) => {
    e.preventDefault();
    if (remarks._id) {
      editRemarks(); // If remark exists, edit
    } else {
      addRemarks(); // Otherwise, add new remark
    }
  };

  useEffect(() => {
    fetchVivaDetails();
  }, []);

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
        <div className="flex-grow p-5">
          {/* Flash messages */}
          <div className="max-w-2xl mx-auto mb-4">
            {flashMessage.status &&
              (flashMessage.type === "error" ? (
                <Alert
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ) : (
                <Success
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ))}
          </div>
          <div className="container mx-auto  flex">
            <div className="w-1/2 pl-4 ">
              <h1 className="text-3xl font-bold">Viva Details</h1>

              {viva && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-xl font-semibold">Viva ID: {viva._id}</p>
                  <p
                    className={`mt-2 font-semibold ${
                      viva.status === "taken"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    <strong>Status:</strong> {viva.status}
                  </p>

                  <p className="mt-2">
                    <strong>Date Created:</strong>{" "}
                    {new Date(viva.dateCreated).toLocaleDateString()}
                  </p>
                  <p className="mt-2">
                    <strong>Viva Date:</strong>{" "}
                    {new Date(viva.vivaDate).toLocaleString()}
                  </p>
                  <p className="text-xl font-semibold">Remark:</p>
                  {viva.remarks ? (
                    <div>
                      <p
                        className={`mt-2 font-semibold ${
                          viva.remarks.overallPerformance === "Excellent"
                            ? "text-purple-800"
                            : viva.remarks.overallPerformance === "Good"
                            ? "text-green-600"
                            : viva.remarks.overallPerformance === "Fair"
                            ? "text-yellow-600"
                            : viva.remarks.overallPerformance === "Poor"
                            ? "text-orange-600"
                            : viva.remarks.overallPerformance === "Bad"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {viva.remarks.overallPerformance}
                      </p>
                      <p className="mt-2 mb-2 h-[calc(30vh-4rem)] overflow-y-auto   rounded-md">
                        <strong>Feedback:</strong> {viva.remarks.feedback}
                      </p>
                      {viva.remarks.obtainedMarks}/{viva.remarks.totalMarks}
                    </div>
                  ) : (
                    <p>Not marked yet</p>
                  )}

                  <button
                    onClick={() => setShowEditForm(true)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                  >
                    Edit Viva
                  </button>
                  {remarks._id ? (
                    <button
                      onClick={() => {
                        setRemarkFormData(remarks); // Pre-fill form with existing remark
                        setShowRemarkForm(true);
                      }}
                      className="ml-4 mt-4 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500"
                    >
                      Edit Remarks
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowRemarkForm(true)}
                      className="ml-4 mt-4 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500"
                    >
                      Add Remarks
                    </button>
                  )}
                </div>
              )}

              {/* Edit/Add Remark Form Popup */}
              {showRemarkForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                    <h2 className="text-xl font-semibold mb-4">
                      {remarks._id ? "Edit Remarks" : "Add Remarks"}
                    </h2>
                    <form onSubmit={handleRemarkSubmit}>
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">
                          Overall Performance:
                        </label>
                        <select
                          value={remarkFormData.overallPerformance}
                          onChange={(e) =>
                            setRemarkFormData({
                              ...remarkFormData,
                              overallPerformance: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                          <option value="Bad">Bad</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">
                          Feedback:
                        </label>
                        <textarea
                          value={remarkFormData.feedback}
                          onChange={(e) =>
                            setRemarkFormData({
                              ...remarkFormData,
                              feedback: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">
                          Obtained Marks:
                        </label>
                        <input
                          type="number"
                          value={remarkFormData.obtainedMarks}
                          onChange={(e) =>
                            setRemarkFormData({
                              ...remarkFormData,
                              obtainedMarks: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">
                          Total Marks:
                        </label>
                        <input
                          type="number"
                          value={remarkFormData.totalMarks}
                          onChange={(e) =>
                            setRemarkFormData({
                              ...remarkFormData,
                              totalMarks: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowRemarkForm(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                        >
                          {remarks._id ? "Update" : "Add"} Remarks
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Form Popup */}
              {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">Edit Viva</h2>
                    <label className="block mb-2">
                      <span>Status:</span>
                      <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="taken">Taken</option>
                      </select>
                    </label>

                    <label className="block mb-4">
                      <span>Viva Date:</span>
                      <input
                        type="datetime-local"
                        value={updatedVivaDate}
                        onChange={(e) => setUpdatedVivaDate(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </label>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowEditForm(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateViva}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-1/2 pl-4 h-[calc(84vh-4rem)] overflow-y-auto   rounded-md">
              <h2 className="text-2xl font-bold mb-4">
                Generate Viva Questions
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {/* Number of Questions */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Number of Questions:
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>

                {/* Difficulty Level */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Difficulty Level:
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Question Type */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Question Type:
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="implementation">Implementation</option>
                  </select>
                </div>

                {/* Generate Questions Button */}
                <button
                  onClick={fetchVivaQuestions}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
                >
                  Generate Questions
                </button>

                {/* Loading State */}
                <div className="mt-4 flex justify-center">
                  {questionsLoading && (
                    <div className="ai-generating">
                      <span className="ai-generating-text">
                        Generating Questions
                      </span>
                      <div className="ai-generating-loader"></div>
                    </div>
                  )}
                </div>

                {/* Display Questions with Scroll View */}
                <div className="mt-4 ">
                  {questions.map((question, index) => (
                    <p key={index} className="mt-2">
                      {index + 1}. {question.questionText}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherVivaDetails;
