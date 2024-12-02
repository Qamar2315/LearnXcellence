import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";

function CreateQuizPage() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: "",
    topic: "",
    duration: "",
    number_of_questions: "",
    deadline: "",
    questions: [
      {
        content: "",
        options: ["", "", "", ""],
        correct_option: "",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [generateDataByContent, setGenerateDataByContent] = useState({
    topic: "",
    numberOfQuestions: "",
    difficulty: "easy",
    content: "",
  });
  const [generateDataByTopic, setGenerateDataByTopic] = useState({
    topic: "",
    numberOfQuestions: "",
    difficulty: "easy",
  });
  const [generatedQuestions, setGeneratedQuestions] = useState("");

  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGenerateByContentChange = (e) => {
    const { name, value } = e.target;
    setGenerateDataByContent((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGenerateByTopicChange = (e) => {
    const { name, value } = e.target;
    setGenerateDataByTopic((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuizData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].correct_option = value;
    setQuizData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        { content: "", options: ["", "", "", ""], correct_option: "" },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData((prevData) => ({ ...prevData, questions: updatedQuestions }));
    }
  };

  const handleQuizCreation = async (e) => {
    e.preventDefault();
    if (quizData.duration < 1 || quizData.number_of_questions < 1) {
      setFlashMessage({
        status: true,
        message: "Duration and number of questions must be at least 1.",
        heading: "Error",
        type: "error",
      });
      return;
    }
    if (!quizData.title.trim() || !quizData.topic.trim()) {
      setFlashMessage({
        status: true,
        message: "Title and topic are required.",
        heading: "Error",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/create`,
        quizData,
        {
          headers: {
            authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setFlashMessage({
        status: true,
        message: "Quiz created successfully.",
        heading: "Success",
        type: "success",
      });
      // Reset form
      setQuizData({
        title: "",
        topic: "",
        duration: "",
        number_of_questions: "",
        deadline: "",
        questions: [
          { content: "", options: ["", "", "", ""], correct_option: "" },
        ],
      });
      navigate(-1);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to create quiz.",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateByTopic = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/generate`,
        {
          params: {
            topic: generateDataByTopic.topic,
            numberOfQuestions: generateDataByTopic.numberOfQuestions,
            difficulty: generateDataByTopic.difficulty,
          },
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setGeneratedQuestions(response.data.data);
      setFlashMessage({
        status: true,
        message: "Successfully generated Questions.",
        heading: "Success",
        type: "success",
      });
      setShowTopicForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to generate Questions.",
        heading: "Error",
        type: "error",
      });
      setShowTopicForm(false);
    }
    setLoading(false);
  };

  const handleGenerateByContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/${courseId}/generate`,
        generateDataByContent,
        {
          headers: { authorization: `Bearer ${authState.token}` },
        }
      );
      setGeneratedQuestions(response.data.data);
      setFlashMessage({
        status: true,
        message: "Successfully generated Questions.",
        heading: "Success",
        type: "success",
      });
      setShowContentForm(false);
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Failed to generate Questions.",
        heading: "Error",
        type: "error",
      });
      setShowContentForm(false);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto  p-5">
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
          <div className="flex">
            <div className="w-1/2">
              {/* Quiz Creation Form (as before) */}

              <div className="col-span-4 border-r pr-4 p-5  bg-white shadow-lg rounded-lg  h-[calc(90vh-4rem)] overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">Create Quiz</h1>
                <form onSubmit={handleQuizCreation}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      name="title"
                      value={quizData.title}
                      onChange={handleQuizInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Topic</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      name="topic"
                      value={quizData.topic}
                      onChange={handleQuizInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      name="duration"
                      value={quizData.duration}
                      onChange={handleQuizInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      name="number_of_questions"
                      value={quizData.number_of_questions}
                      onChange={handleQuizInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      name="deadline"
                      value={quizData.deadline}
                      onChange={handleQuizInputChange}
                    />
                  </div>

                  {quizData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-6 border-b pb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Question {qIndex + 1}
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={question.content}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "content",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Options
                        </label>
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="text"
                              className="flex-grow p-2 border rounded mr-2"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  qIndex,
                                  optIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Correct Option
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={question.correct_option}
                          onChange={(e) =>
                            handleCorrectOptionChange(qIndex, e.target.value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="px-2 py-1 text-red-500"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        Remove Question
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? "Creating Quiz..." : "Create Quiz"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-1/2 pl-4 col-span-3 bg-white shadow-lg rounded-lg ml-6 mr-6 pl-6 pr-6 h-[calc(90vh-4rem)] overflow-y-auto">
              <h2 className="text-2xl mb-4">Generate Questions</h2>
              <button
                onClick={() => setShowTopicForm(true)}
                className="mb-4 p-2 bg-blue-500 text-white rounded"
              >
                Generate by Topic
              </button>
              <button
                onClick={() => setShowContentForm(true)}
                className="p-2 ml-4 bg-green-500 text-white rounded"
              >
                Generate by Content
              </button>
              <div>
                {/* Display the fetched questions if quizData is available */}
                {generatedQuestions && (
                  <div className="mt-6">
                    {generatedQuestions.map((question, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="font-semibold text-lg">
                          {question.content}
                        </h3>
                        <ul className="list-disc pl-5 mt-2">
                          {question.options.map((option, optionIndex) => (
                            <li
                              key={optionIndex}
                              className={`p-1 ${
                                option === question.correct_option
                                  ? "bg-green-200 font-bold"
                                  : ""
                              }`}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm mt-2">
                          Correct Answer: {question.correct_option}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {showTopicForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 className="text-2xl mb-4">Generate Quiz by Topic</h2>
                    <form onSubmit={handleGenerateByTopic}>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Topic Name
                        </label>
                        <input
                          type="text"
                          name="topic"
                          value={generateDataByTopic.topic}
                          onChange={handleGenerateByTopicChange}
                          className="w-full p-2 mb-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          name="numberOfQuestions"
                          value={generateDataByTopic.numberOfQuestions}
                          onChange={handleGenerateByTopicChange}
                          className="w-full p-2 mb-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={generateDataByTopic.difficulty}
                          onChange={handleGenerateByTopicChange}
                          className="w-full p-2 mb-2 border rounded"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="p-2 bg-blue-600 text-white rounded mr-2"
                          disabled={loading}
                        >
                          {loading ? "Generating Questions..." : "Submit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTopicForm(false)}
                          className="p-2 bg-gray-500 text-white rounded"
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {showContentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 className="text-2xl mb-4">Generate Quiz by Content</h2>
                    <form onSubmit={handleGenerateByContent}>
                      <div className="mb-4">
                        <label className="block text-gray-700">Topic</label>
                        <input
                          type="text"
                          name="topic"
                          value={generateDataByContent.topic}
                          onChange={handleGenerateByContentChange}
                          className="w-full p-2 mb-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Content</label>
                        <textarea
                          name="content"
                          value={generateDataByContent.content}
                          onChange={handleGenerateByContentChange}
                          className="w-full p-2 mb-2 border rounded"
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          name="numberOfQuestions"
                          value={generateDataByContent.numberOfQuestions}
                          onChange={handleGenerateByContentChange}
                          className="w-full p-2 mb-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={generateDataByContent.difficulty}
                          onChange={handleGenerateByContentChange}
                          className="w-full p-2 mb-2 border rounded"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="p-2 bg-green-600 text-white rounded mr-2"
                          disabled={loading}
                        >
                          {loading ? "Generating Questions..." : "Submit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowContentForm(false)}
                          className="p-2 bg-gray-500 text-white rounded"
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizPage;
