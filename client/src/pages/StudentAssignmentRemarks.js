import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function StudentAssignmentRemarks() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { courseId, submissionId } = useParams();
  const { authState } = useContext(AuthContext);
  const [remark, setRemark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddRemarkForm, setShowAddRemarkForm] = useState(false);
  const [showEditRemarkForm, setShowEditRemarkForm] = useState(false);
  const [remarksId, setRemarksId] = useState("");
  const [formData, setFormData] = useState({
    overallPerformance: "",
    feedback: "",
    obtainedMarks: "",
    totalMarks: "",
  });

  const navigate = useNavigate();

  // Fetch remark details
  const fetchRemark = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/remarks/submission/${courseId}/${submissionId}/0`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      if (res.data.data) {
        setRemark(res.data.data);
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch remark details.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemark();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Submission Details</h1>
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

          {loading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <DotSpinner />
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Remarks</h2>
              {remark ? (
                <div>
                  <p className="text-lg">
                    Performance: {remark.overallPerformance}
                  </p>
                  <p className="text-lg mt-2">Feedback: {remark.feedback}</p>
                  <p className="text-lg mt-2">
                    Marks: {remark.obtainedMarks}/{remark.totalMarks}
                  </p>
                  <p className="text-lg mt-2">
                    Date Created:{" "}
                    {new Date(remark.dateCreated).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => navigate(-1)}
                    className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <p>Not marked yet.</p>
              )}
              {!remark && (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAssignmentRemarks;
