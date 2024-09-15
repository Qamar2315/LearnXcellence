import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import Success from "../components/Success";
import { FlashContext } from "../helpers/FlashContext";
import { AuthContext } from "../helpers/AuthContext";
import Alert from "../components/Alert";
import axios from "axios";

function Login() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    pass: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Enter your email"),
    pass: Yup.string().required("Enter your password"),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        data
      );

      if (res.data.message) {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Something Went Wrong",
          type: "error",
        });
      } else {
        sessionStorage.setItem("name", res.data.name);
        sessionStorage.setItem("id", res.data._id);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("isTeacher", false);
        sessionStorage.setItem("status", true);

        setAuthState({
          name: res.data.name,
          id: res.data._id,
          token: res.data.token,
          status: true,
          isTeacher: false,
        });

        setFlashMessage({
          status: true,
          message: `You Are Logged In, ${res.data.name}`,
          heading: "Logged In Successfully",
          type: "success",
        });

        // Check if the user's email is verified
        if (res.data.is_email_verified) {
          navigate("/studentDashboard");
        } else {
          navigate("/emailVerification");
        }
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        heading: "Something Went Wrong",
        type: "error",
      });
    }
  };

  const signUp = () => {
    setFlashMessage({
      status: false,
      message: "",
      heading: "",
      type: "",
    });
  };

  return (
    <>
      <section className="flex">
        <img
          id="logo"
          src="https://res-console.cloudinary.com/dmiqkr7ja/media_explorer_thumbnails/42f5d327adf6b87ab492e751a204d53e/detailed"
          alt=""
        />
        <div
          id="registerPage"
          className="w-2/4 h-screen flex flex-col font-mono text-center justify-center"
        >
          <h1 className="text-6xl text-gray-950">Get Register</h1>
          <p className="text-xl mt-5">Sign up create your account</p>
          <div className="flex justify-center">
            <Link to={"/register"}>
              <button
                onClick={signUp}
                className="text-2xl inline-block rounded w-52 mt-5 bg-green-600 px-8 py-3 font-medium text-white transition hover:-rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-green-500"
              >
                SIGN UP
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center w-full items-center">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="w-9/12">
              <div>
                <div className="mb-10">
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
                </div>
                <h1 className="text-6xl text-blue-950 mb-10">Login</h1>

                <div className="mt-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Email
                  </label>
                  <ErrorMessage
                    className="text-xs text-red-700"
                    name="email"
                    component="span"
                  ></ErrorMessage>
                  <Field
                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    name="email"
                    placeholder="enter email"
                    type="email"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Password
                  </label>
                  <ErrorMessage
                    className="text-xs text-red-700"
                    name="pass"
                    component="span"
                  ></ErrorMessage>
                  <Field
                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    name="pass"
                    placeholder="enter password"
                    type="password"
                  />
                </div>
              </div>
              <button
                className="mt-10 inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
                type="submit"
              >
                SIGN IN
              </button>
              <div className="mt-4">
                <Link
                  to="/forget-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </section>
    </>
  );
}

export default Login;
