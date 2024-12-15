import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { FaFile } from "react-icons/fa";
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

function TeacherQuizDetails() {
  const { courseId, quizId } = useParams();
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [quiz, setQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    questions: [],
    duration: 0,
    number_of_questions: 0,
    deadline: "",
  });

  const navigate = useNavigate();

  // Fetch quiz details
  const fetchQuiz = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      const deadlineDate = new Date(res.data.deadline);
      const formattedDeadline = deadlineDate.toISOString().split("T")[0];
      setQuiz(res.data);
      setFormData({
        title: res.data.title,
        topic: res.data.topic,
        questions: res.data.questions,
        duration: res.data.duration,
        number_of_questions: res.data.number_of_questions,
        deadline: formattedDeadline,
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch quiz details.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/submissions`,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setSubmissions(res.data);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to fetch submissions.",
        heading: "Error",
        type: "error",
      });
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}/pdf`,
        {},
        {
          headers: { authorization: `Bearer ${authState.token}` },
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a blob and a downloadable link for the zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${quiz.title}_Quiz.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setFlashMessage({
        status: true,
        message: "PDF quiz generated successfully.",
        heading: "Success",
        type: "success",
      });
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to generate PDF quiz.",
        heading: "Error",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchQuiz();
    fetchSubmissions();
  }, []);

  // Handle edit quiz
  const handleEditQuiz = async (e) => {
    e.preventDefault();

    // Prepare the updated quiz data
    const updatedQuiz = {
      ...formData,
      questions: formData.questions.map((question) => {
        const { __v, created_at, updated_at, ...cleanedQuestion } = question;

        // Ensure `_id` is included
        return {
          _id: question._id,
          ...cleanedQuestion,
        };
      }),
    };

    try {
      // Send the updated quiz data
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}`,
        updatedQuiz,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFlashMessage({
        status: true,
        message: "Quiz updated successfully.",
        heading: "Success",
        type: "success",
      });
      setShowEditForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to update quiz.",
        heading: "Error",
        type: "error",
      });
    }
    setShowEditForm(false);
  };

  // Handle delete quiz
  const handleDeleteQuiz = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/${quizId}`,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setFlashMessage({
        status: true,
        message: "Quiz deleted successfully.",
        heading: "Success",
        type: "success",
      });
      navigate(-1);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Failed to delete quiz.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Handle input changes
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Split the name to extract question index and field key
    const [prefix, questionIdx, key] = name.split("-");

    if (key === "content") {
      // Update the content of the question
      const updatedQuestions = [...formData.questions];
      updatedQuestions[parseInt(questionIdx)].content = value;
      setFormData({ ...formData, questions: updatedQuestions });
    } else if (key === "option") {
      // Update the option for the specific question
      const updatedQuestions = [...formData.questions];
      updatedQuestions[parseInt(questionIdx)].options[parseInt(value.index)] =
        value.option;
      setFormData({ ...formData, questions: updatedQuestions });
    } else if (key === "correct_option") {
      // Update the correct option for the specific question
      const updatedQuestions = [...formData.questions];
      updatedQuestions[parseInt(questionIdx)].correct_option = value;
      setFormData({ ...formData, questions: updatedQuestions });
    } else {
      // For other fields like title, topic, duration
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />

        <div className="container mx-auto mt-5 p-5 grid grid-cols-2 gap-4">
          {/* Quiz Details Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-auto h-[500px]">
            <h1 className="text-3xl font-bold mb-4">Quiz Details</h1>
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
              <p>Loading quiz details...</p>
            ) : quiz ? (
              <div>
                <h2 className="text-3xl font-bold">{quiz.title}</h2>
                <p className="text-lg mt-4">Topic: {quiz.topic}</p>
                <p className="text-lg mt-4">
                  Duration: {quiz.duration} minutes
                </p>
                <p className="text-lg mt-4">
                  Number of Questions: {quiz.number_of_questions}
                </p>
                <p className="text-lg mt-4">
                  Deadline: {new Date(quiz.deadline).toLocaleDateString()}
                </p>

                <h3 className="text-2xl font-semibold mt-4">Questions</h3>
                <div className="mt-2">
                  {quiz.questions.map((question, idx) => (
                    <div key={idx} className="mb-4">
                      <p>{question.content}</p>
                      <ul>
                        {question.options.map((option, optIdx) => (
                          <li key={optIdx}>
                            <label>
                              <input
                                type="radio"
                                name={`questions-${idx}-correct_option`}
                                value={option}
                                checked={question.correct_option === option}
                                readOnly
                              />
                              {option}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {quiz.document_id && (
                  <div className="flex items-center mt-4">
                    <FaFile className="text-2xl text-gray-500 mr-2" />
                    <span>{quiz.document_id.split("-")[1]}</span>
                  </div>
                )}

                <button
                  onClick={() => setShowEditForm(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit Quiz
                </button>

                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Quiz
                </button>

                <button
                  onClick={handleGeneratePDF}
                  className="mt-4 ml-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Generate Quizzes PDF
                </button>
              </div>
            ) : (
              <p>No quiz details available.</p>
            )}
          </div>

          {/* Submissions Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-auto h-[500px]">
            <h2 className="text-2xl font-bold mb-4">Student Submissions</h2>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div
                  key={submission._id}
                  onClick={() => navigate(`submission/${submission._id}`)}
                  className="flex items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={`http://localhost:9090/profile_pictures/${submission.student.account.profile_picture}`}
                    alt="Student Avatar"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{submission.student.name}</p>
                    <p className="text-sm text-gray-500">
                      {submission.student.account.email}
                    </p>
                    {submission.isFlagged ? (
                      <p className="text-red-500">Flagged</p>
                    ) : (
                      <p>{submission.score}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No submissions yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Quiz Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
          <div className="bg-white p-8 rounded-lg w-full max-w-3xl h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>
            <form onSubmit={handleEditQuiz}>
              <div className="mb-4">
                <label className="block text-lg">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg">Number of Questions</label>
                <input
                  type="number"
                  name="number_of_questions"
                  value={formData.number_of_questions}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Questions */}
              {formData.questions.map((question, idx) => (
                <div key={idx} className="mb-4">
                  <label className="block text-lg">Question {idx + 1}</label>
                  <textarea
                    name={`questions-${idx}-content`}
                    value={question.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div>
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} className="block mt-2">
                        <input
                          type="radio"
                          name={`questions-${idx}-correct_option`} // Ensure this name corresponds to the question index
                          value={option} // Ensure value corresponds to the option value
                          checked={question.correct_option === option}
                          onChange={handleInputChange} // Handle change for correct option
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">Do you really want to delete this quiz?</p>
            <button
              onClick={handleDeleteQuiz}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-4"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherQuizDetails;
