import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import axios from "axios";
import { FlashContext } from "../helpers/FlashContext";
import { useContext } from "react";
import Success from "../components/Success";

function Register() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    pass: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Enter your name"),
    email: Yup.string().required("Enter your email"),
    pass: Yup.string().required("Enter your password"),
  });

  const signIn = () => {
    setFlashMessage({
      status: false,
      message: "",
      heading: "",
      type: "",
    });
  };
  //   const onSubmit = async (data, onSubmitProps) => {
  //     onSubmitProps.resetForm();
  //     await axios
  //       .post(`${process.env.REACT_APP_API_URL}/auth/register`, data)
  //       .then((res) => {
  //         if (res.data.message) {
  //           setFlashMessage({
  //             status: true,
  //             message: res.data.message,
  //             heading: "Something Went Wrong",
  //             type: "error",
  //           });
  //         } else {
  //           navigate("/login");
  //           setFlashMessage({
  //             status: true,
  //             message: `${res.data.name} Your Account Has Been Registered`,
  //             heading: "Registered Successfully",
  //             type: "success",
  //           });
  //         }
  //       });
  //   };

  //   const onSubmit = async (data, onSubmitProps) => {
  //     try {
  //       onSubmitProps.resetForm();
  //       const res = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/auth/register`,
  //         data
  //       );
  //       if (res.data.message) {
  //         setFlashMessage({
  //           status: true,
  //           message: res.data.message,
  //           heading: "Something Went Wrong",
  //           type: "error",
  //         });
  //       } else {
  //         setFlashMessage({
  //           status: true,
  //           message: `${res.data.name}, your account has been registered.`,
  //           heading: "Registered Successfully",
  //           type: "success",
  //         });
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       setFlashMessage({
  //         status: true,
  //         message: res.data.message,
  //         heading: "Something Went Wrong",
  //         type: "error",
  //       });
  //     }
  //   };

  const onSubmit = async (data, onSubmitProps) => {
    try {
      onSubmitProps.resetForm();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
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
        setFlashMessage({
          status: true,
          message: `${res.data.name}, your account has been registered.`,
          heading: "Registered Successfully",
          type: "success",
        });
        navigate("/login");
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

  return (
    <>
      <section className="flex">
        <div
          id="registerPage"
          className="w-2/4 h-screen flex flex-col font-mono text-center justify-center"
        >
          <h1 className="text-6xl text-gray-950">Welcome Back</h1>
          <p className="text-xl p-5">Sign in to your account</p>
          <div className="flex justify-center">
            <Link to={"/login"}>
              <button
                onClick={signIn}
                className="text-2xl inline-block rounded w-52 mt-4 bg-green-600 px-8 py-3 font-medium text-white transition hover:-rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-green-500"
              >
                SIGN IN
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
              {flashMessage.status && flashMessage.type == "error" && (
                <Alert
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              )}
              {flashMessage.status && flashMessage.type == "success" && (
                <Success
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              )}
              <div>
                <h1 className="text-6xl text-blue-950 mb-10">Create Account</h1>
                <div className="mt-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Name{" "}
                  </label>
                  <ErrorMessage
                    className="text-xs text-red-700"
                    name="name"
                    component="span"
                  ></ErrorMessage>
                  <Field
                    className="mt-1 h-8 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    name="name"
                    placeholder="enter your name"
                  />
                </div>

                <div className="mt-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Email{" "}
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
                    Password{" "}
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
                SIGN UP
              </button>
            </Form>
          </Formik>
        </div>
      </section>
    </>
  );
}

export default Register;
