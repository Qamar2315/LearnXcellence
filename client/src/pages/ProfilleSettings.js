import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Success from "../components/Success";
import Alert from "../components/Alert";
import Webcam from "react-webcam"; // Importing Webcam
import DotSpinner from "../components/DotSpinner"; // Adjust the path accordingly

// Loading component
const LoadingComponent = () => (
  <div role="status">
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [studentInfo, setStudentInfo] = useState(null);

  const [pageLoading, setPageLoading] = useState(true); // Page loading state
  const [faceActionLoading, setFaceActionLoading] = useState(false); // Face action loading state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamAction, setWebcamAction] = useState("");
  const webcamRef = React.useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // Fetch student info
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/student/${authState.id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        setStudentInfo(res.data);

        setPageLoading(false);
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to load student info",
          heading: "Error",
          type: "error",
        });
        setPageLoading(false);
      });
  }, [authState, setFlashMessage]);

  const handleNameUpdate = (values) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/auth/student/update-name`,
        { newName: values.name },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        setStudentInfo((prev) => ({ ...prev, name: res.data.name }));
        setFlashMessage({
          status: true,
          message: "Name updated successfully",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to update name",
          heading: "Error",
          type: "error",
        });
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/student/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setStudentInfo((prev) => ({
          ...prev,
          profile_picture: res.data.profile_picture,
        }));
        setFlashMessage({
          status: true,
          message: "Profile picture updated successfully",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to update profile picture",
          heading: "Error",
          type: "error",
        });
      });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = dataURLToBlob(imageSrc);

    const formData = new FormData();
    formData.append("face_image", blob, "face_image.jpg");

    const url =
      webcamAction === "register"
        ? `${process.env.REACT_APP_API_URL}/auth/student/register-face`
        : `${process.env.REACT_APP_API_URL}/auth/student/verify-face`;

    setFaceActionLoading(true); // Show loading spinner

    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFlashMessage({
          status: true,
          message: res.data.message || "Face action completed",
          heading: "Success",
          type: "success",
        });
        setShowWebcam(false);
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message ||
            (webcamAction === "register"
              ? "Failed to register face"
              : "Failed to verify face"),
          heading: "Error",
          type: "error",
        });
        setShowWebcam(false);
      })
      .finally(() => {
        setFaceActionLoading(false); // Hide loading spinner
      });
  }, [authState, webcamAction, setFlashMessage]);

  const handlePasswordUpdate = (values) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/auth/student/update-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Success",
          type: "success",
        });
        setShowPasswordForm(false); // Hide the password form after successful update
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to update password",
          heading: "Error",
          type: "error",
        });
      });
  };

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleOpenWebcam = (action) => {
    setWebcamAction(action);
    setShowWebcam(true);
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-2">
        <div className="max-w-2xl mx-auto bg-white p-5 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Profile Settings
          </h1>

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

          <div className="flex items-center justify-center mb-5">
            <img
              src={`http://localhost:9090/profile_pictures/${studentInfo.profile_picture}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </div>

          <Formik
            initialValues={{ name: studentInfo.name }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
            })}
            onSubmit={handleNameUpdate}
          >
            {() => (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <Field
                    name="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Name
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Update Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full py-2"
            />
          </div>

          <div className="mt-2">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {showPasswordForm ? "Cancel Password Reset" : "Reset Password"}
            </button>
          </div>

          {showPasswordForm && (
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
              }}
              validationSchema={Yup.object({
                currentPassword: Yup.string().required(
                  "Current password is required"
                ),
                newPassword: Yup.string().required("New password is required"),
              })}
              onSubmit={handlePasswordUpdate}
            >
              {() => (
                <Form className="mt-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Current Password
                    </label>
                    <Field
                      name="currentPassword"
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      New Password
                    </label>
                    <Field
                      name="newPassword"
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update Password
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Register and Verify Face */}
          <div className="mt-2 flex justify-between">
            <button
              onClick={() => handleOpenWebcam("register")}
              className="w-1/2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Register Face
            </button>
            <button
              onClick={() => handleOpenWebcam("verify")}
              className="w-1/2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify Face
            </button>
          </div>

          {/* Webcam Component */}
          {showWebcam && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  {webcamAction === "register"
                    ? "Register Face"
                    : "Verify Face"}
                </h2>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={capture}
                    className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => setShowWebcam(false)}
                    className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show Loading Component if loading */}
        {faceActionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <LoadingComponent />
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileSettings;
