//libraries
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
//components
import ChooseMember from "../components/ChooseMember";
import Navbar from "../components/Navbar";
//context
import { FlashContext } from "../helpers/FlashContext";
import { AuthContext } from "../helpers/AuthContext";
import { CreateGroupContext } from "../helpers/CreateGroupContext";
//styles
import "../styles/chatBot.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

function AddProject() {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyC6wl3hgmcMH8oKoBKpY4mCGajPonSqMK8"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let { classId } = useParams();
  const [value, setValue] = useState("");
  const [viewClass, setViewClass] = useState();
  const [loading, setLoading] = useState(false);
  const [showChooseMember, setShowChooseMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [aiResponses, setAiResponses] = useState([
  ]);
  const { authState, setAuthState } = useContext(AuthContext);
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

  const handleSubmit = (values, { resetForm }) => {
    // Handle form submission here, e.g., send data to the server
    // setSelectedMembers([])
    resetForm();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/project/create`,
        {
          name: values.name,
          scope: values.scope,
          members: selectedMembers,
          classId: classId,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        setSelectedMembers([]);
        if (res.data.message) {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Something went wrong",
            type: "error",
          });
          navigate(`/viewclass/${classId}`);
        } else {
          setFlashMessage({
            status: true,
            message: "Joined Class Successfully",
            heading: "Class Joined",
            type: "success",
          });
          navigate(`/viewclass/${classId}`);
        }
      });
  };
  
  const generateResponse = async () => {
    setLoading(true);
    const prompt = `give project ideas related to following keywords ${value} one line ideas for semester project only idea no description. output should be like : ["idea1","idea2","idea3","idea4","idea5"]`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    setAiResponses(JSON.parse(text));
    setLoading(false);
  };
  useEffect(() => {
    if (!authState.status && !authState.isTeacher) {
      navigate("/login");
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/class/${classId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Something went wrong",
            type: "error",
          });
        } else {
          setViewClass(res.data);
        }
      });
  }, []);
  return (
    <>
      <Navbar />
      {viewClass && (
        <Link to={`/viewClass/${viewClass._id}`}>
          <button className="text-blue-500 hover:text-blue-600 text-lg font-semibold px-4">
            back
          </button>
        </Link>
      )}
      {viewClass && (
        <div>
          <h1 className="text-2xl font-semibold text-blue-800 px-4 py-1">
            {viewClass.className}
          </h1>
        </div>
      )}
      {showChooseMember && (
        <CreateGroupContext.Provider
          value={{ selectedMembers, setSelectedMembers }}
        >
          <ChooseMember onClose={() => setShowChooseMember(false)} />
        </CreateGroupContext.Provider>
      )}
      <div className="flex justify-around mt-4">
        <div className="p-6 w-2/5 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold">Add Project</h1>
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
                      <div className="">
                        <p className="text-lg font-semibold">{member.name}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setShowChooseMember(true);
                    }}
                    className="bg-green-500 hover:bg-green-600  text-white font-bold py-2 px-4 rounded"
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
            Chat with the Project Ideas Bot
          </h2>
          <div className="h-64 overflow-y-auto">
            {aiResponses.map((message, index) => (
              <div key={index}>
                <div className="inline-block p-2 rounded-lg mb-2 bg-gray-200">
                  {message}
                </div>
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
            <input
              value={value}
              type="text"
              placeholder="Type your keywords..."
              className="flex-grow p-2 border rounded-l-lg"
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              onClick={generateResponse}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProject;
