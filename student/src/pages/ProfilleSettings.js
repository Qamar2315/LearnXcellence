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

function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // To control password form visibility
  const [showWebcam, setShowWebcam] = useState(false); // To control webcam visibility
  const [webcamAction, setWebcamAction] = useState(""); // To track whether registering or verifying
  const webcamRef = React.useRef(null); // Webcam reference

  // Webcam settings
  const videoConstraints = {
    width: 1280,
    height: 720,
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
        setLoading(false);
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message:
            error.response?.data?.message || "Failed to load student info",
          heading: "Error",
          type: "error",
        });
      });
  }, [authState, setFlashMessage, studentInfo]);

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

  // Capture image and send to the appropriate API (register or verify face)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot(); // Capture the image as base64
    const blob = dataURLToBlob(imageSrc); // Convert base64 to blob for uploading

    const formData = new FormData();
    formData.append("face_image", blob, "face_image.jpg");

    const url =
      webcamAction === "register"
        ? `${process.env.REACT_APP_API_URL}/auth/student/register-face`
        : `${process.env.REACT_APP_API_URL}/auth/student/verify-face`;

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
        setShowWebcam(false); // Hide webcam after action
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
        setShowWebcam(false); // Hide webcam after action
      });
  }, [authState, webcamAction, setFlashMessage]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
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

          <div className="mt-6">
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
          <div className="mt-6 flex justify-between">
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
            <div className="mt-6">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-auto"
              />
              <button
                onClick={capture}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Capture Image
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;
