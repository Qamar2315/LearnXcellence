// libraries
import React, { useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate, Link, useParams } from "react-router-dom";
import Success from "../components/Success";
import Alert from "../components/Alert";
// components
import ChooseMember from "../components/ChooseMember";
import Navbar from "../components/Navbar";
// context
import { FlashContext } from "../helpers/FlashContext";
import { AuthContext } from "../helpers/AuthContext";
import { CreateGroupContext } from "../helpers/CreateGroupContext";
// styles
import "../styles/chatBot.css";

function AddProject() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showChooseMember, setShowChooseMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    scope: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    scope: Yup.string().required("Project scope is required"),
    members: Yup.array()
      .of(Yup.string().required("Member name is required"))
      .min(1, "At least one member is required")
      .max(4, "At max 4 members"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    resetForm();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/project/create`,
        {
          name: values.name,
          scope: values.scope,
          members: selectedMembers,
          courseId: courseId,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      );

      setSelectedMembers([]);
      if (res.data.message) {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Project Created",
          type: "success",
        });
      } else {
        setFlashMessage({
          status: true,
          message: "Project created successfully",
          heading: "Success",
          type: "success",
        });
      }
      navigate(`/course/${courseId}/project`);
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to create project",
        heading: "Error",
        type: "error",
      });
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/project/${courseId}/generate-project-suggestions`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (res.data.success) {
        setAiResponses(res.data.data); // Update AI responses with the received data
      } else {
        setFlashMessage({
          status: true,
          message: "Failed to generate suggestions.",
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message || "Error generating suggestions",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-around mt-4">
        <div className="p-6 w-2/5 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold">Add Project</h1>
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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block font-medium text-gray-700"
                >
                  Project Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="scope"
                  className="block font-medium text-gray-700"
                >
                  Project Scope
                </label>
                <Field
                  as="textarea"
                  id="scope"
                  name="scope"
                  rows="4"
                  placeholder="Enter project scope"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="scope"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="members"
                  className="block font-medium text-gray-700"
                >
                  Project Members
                </label>
                <div className="flex space-x-4">
                  {selectedMembers.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg p-2"
                    >
                      <p className="text-lg font-semibold">{member.name}</p>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowChooseMember(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Choose Members
                  </button>
                </div>
                <ErrorMessage
                  name="members"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
                >
                  Add Project
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className="w-2/5 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Generate Project Suggestions
          </h2>
          <div className="h-64 overflow-y-auto mb-4">
            {aiResponses.map((suggestion, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{suggestion.ideaTitle}</h3>
                <p>{suggestion.ideaDescription}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            {loading && (
              <div className="ai-generating">
                <span className="ai-generating-text">AI is Generating</span>
                <div className="ai-generating-loader"></div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={generateSuggestions} // Call generateSuggestions on click
            >
              Generate Suggestions
            </button>
          </div>
        </div>
      </div>
      {showChooseMember && (
        <CreateGroupContext.Provider
          value={{ selectedMembers, setSelectedMembers }}
        >
          <ChooseMember onClose={() => setShowChooseMember(false)} />
        </CreateGroupContext.Provider>
      )}
    </>
  );
}

export default AddProject;
