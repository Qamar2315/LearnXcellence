import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Success from "./Success";
import axios from "axios";

function Navbar() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch student info
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/student/${authState.id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((response) => {
        setStudentInfo(response.data);
      })
      .catch((error) => {
        console.log("Error fetching student info:", error);
      });
  }, [authState.id, flashMessage]);

  const logout = () => {
    sessionStorage.clear();
    setAuthState({
      name: "",
      id: "",
      status: false,
      isTeacher: false,
    });
    setFlashMessage({
      status: true,
      message: "You are logged out of your account",
      heading: "Logged Out",
      type: "success",
    });
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="bg-blue-600 p-4 shadow-lg flex justify-between items-center">
        <Link to={"/studentDashboard"}>
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        </Link>
        <div className="relative">
          {studentInfo && (
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">
                {studentInfo.name}
              </span>
              <img
                src={`http://localhost:9090/profile_pictures/${studentInfo.profile_picture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
            </div>
          )}
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
              <Link
                to={"/profileSettings"}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* {flashMessage.status && (
        <div className="flex justify-center mt-10">
          <div className="w-2/3">
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
        </div>
      )} */}
    </>
  );
}

export default Navbar;
