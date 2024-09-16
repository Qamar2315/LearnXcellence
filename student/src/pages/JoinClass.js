import React from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

function JoinClass() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [classCode, setClasscode] = useState("");
  const navigate = useNavigate();

  const joinClass = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/course/join?courseCode=${classCode}`,
        {},
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then((res) => {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Class Joined",
          type: "success",
        });
        navigate("/studentDashboard");
      })
      .catch((error) => {
        setFlashMessage({
          status: true,
          message: error.response?.data?.message || "Failed to join class",
          heading: "Error",
          type: "error",
        });

        navigate("/studentDashboard");
      });
  };
  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <section className="rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 sm:p-12 w-4/5 mt-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Enter Code To Join The Course
          </p>
          <h2 className="mt-6 text-3xl font-bold border-black">
            <input
              type="text"
              className="w-full py-2 px-4 rounded-lg border focus:outline-none focus:border-blue-500"
              placeholder="Enter code..."
              onChange={(e) => {
                setClasscode(e.target.value);
              }}
            />
          </h2>
          <button
            className="mt-8 inline-block w-full rounded-full bg-blue-600 hover:bg-blue-800 py-4 text-sm font-bold text-white shadow-xl text-center transition duration-300"
            onClick={joinClass}
          >
            Join Class
          </button>
        </section>
      </div>
    </div>
  );
}

export default JoinClass;
