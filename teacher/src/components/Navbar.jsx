import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Success from "./Success";
import axios from "axios";
import { FaBell } from "react-icons/fa"; // FontAwesome icon for notifications

function Navbar() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // Toggle notifications dropdown
  const [notifications, setNotifications] = useState([]); // Store fetched notifications
  const navigate = useNavigate();

  // Fetch student info
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/teacher/${authState.id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((response) => {
        setTeacherInfo(response.data);
      })
      .catch((error) => {
        console.log("Error fetching student info:", error);
      });
  }, [authState.id, flashMessage]);

  // Fetch notifications when the icon is clicked
  const fetchNotifications = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/notifications/get-notifications`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.data);
        setNotificationsOpen(!notificationsOpen); // Toggle the dropdown
      })
      .catch((error) => {
        console.log("Error fetching notifications:", error);
      });
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/notifications/mark-as-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      )
      .then(() => {
        // Mark the notification as read locally
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      })
      .catch((error) => {
        console.log("Error marking notification as read:", error);
      });
  };

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
        <h1 className="text-3xl font-bold text-white">LearnXcellence</h1>
        <Link to={"/teacherDashboard"}>
          <h1 className="text-3xl text-white">Dashboard</h1>
        </Link>
        <div className="relative flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="relative">
            <FaBell
              size={24}
              className="text-white cursor-pointer"
              onClick={fetchNotifications}
            />
            {/* Display number of unread notifications */}
            {notifications.some((notif) => !notif.read) && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
                {notifications.filter((notif) => !notif.read).length}
              </span>
            )}
            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10">
                <h3 className="px-4 py-2 font-bold text-gray-700">
                  Notifications
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => markAsRead(notification._id)}
                        className={`px-4 py-2 cursor-pointer ${
                          notification.read ? "bg-gray-100" : "bg-white"
                        } hover:bg-gray-200`}
                      >
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600">
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-600">
                      No notifications found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {teacherInfo && (
            <div className="relative">
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">
                  {teacherInfo.name}
                </span>
                <img
                  src={`http://localhost:9090/profile_pictures/${teacherInfo.profile_picture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />
              </div>
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                  <Link
                    to={"/userprofile"}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
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
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
