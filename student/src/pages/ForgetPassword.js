import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FlashContext } from "../helpers/FlashContext";
import Success from "../components/Success";
import Alert from "../components/Alert";

function ForgetPassword() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forget-password`,
        data
      );

      setFlashMessage({
        status: true,
        message: res.data.message || "Password reset link sent successfully",
        heading: "Success",
        type: "success",
      });
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
            <h1 className="text-3xl mb-6 text-center">Forget Password</h1>
            <div>
              <label>Email</label>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
              <Field
                name="email"
                type="email"
                className="w-full mt-2 px-4 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              Send Reset Link
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ForgetPassword;
