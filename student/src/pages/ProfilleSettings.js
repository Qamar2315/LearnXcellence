import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Success from "../components/Success";
import Alert from "../components/Alert";

function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [studentInfo, setStudentInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // To control password form visibility

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
            {({ setFieldValue }) => (
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
              className="w-full"
            />
          </div>

          {/* Reset Password Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {showPasswordForm ? "Cancel Reset Password" : "Reset Password"}
            </button>
          </div>

          {/* Password Reset Form */}
          {showPasswordForm && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Reset Password</h2>
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                }}
                validationSchema={Yup.object({
                  currentPassword: Yup.string().required(
                    "Current password is required"
                  ),
                  newPassword: Yup.string().required(
                    "New password is required"
                  ),
                })}
                onSubmit={handlePasswordUpdate}
              >
                {() => (
                  <Form>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;
