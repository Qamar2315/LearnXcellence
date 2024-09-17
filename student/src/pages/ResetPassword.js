import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const initialValues = {
    newPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("New password is required"),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      setFlashMessage({
        status: true,
        message: res.data.message || "Password reset successfully",
        heading: "Success",
        type: "success",
      });

      navigate("/login");
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        heading: "Error",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-full max-w-md">
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
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <h1 className="text-3xl mb-6 text-center">Reset Password</h1>
            <div>
              <label>New Password</label>
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
              <Field
                name="newPassword"
                type="password"
                className="w-full mt-2 px-4 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              Reset Password
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ResetPassword;
