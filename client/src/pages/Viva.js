import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { AuthContext } from "../helpers/AuthContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { FlashContext } from "../helpers/FlashContext"; // Import FlashContext
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Viva() {
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

  useEffect(() => {
    fetchVivaDetails();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
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
          <div className="container mx-auto  ">
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
                  onClick={() => navigate(-1)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viva;
