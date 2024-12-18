import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Alert from "./Alert";
import Success from "./Success";
import axios from "axios";
import { FaBell } from "react-icons/fa"; // FontAwesome icon for notifications

function Navbar() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // Toggle notifications dropdown
  const [notifications, setNotifications] = useState([]); // Store fetched notifications
  const navigate = useNavigate();
  const location = useLocation(); // Hook to determine current route

  // Refs to detect clicks outside the dropdowns
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

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

    fetchNotifications();
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
        const sortedNotifications = response.data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedNotifications);
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

  // Close dropdown if click happens outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-[#3A6D8C]">
        <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/course" className="text-3xl font-bold text-white">
                  STUDENT
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/course"
                    className={`${
                      location.pathname.startsWith("/course")
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Courses
                  </Link>
                  <Link
                    to="/userprofile"
                    className={`${
                      location.pathname === "/userprofile"
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/profileSettings"
                    className={`${
                      location.pathname === "/profileSettings"
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative flex items-center space-x-4 pr-2">
              {/* Notification Icon */}
              <div className="relative" ref={notificationsDropdownRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <FaBell size={24} className="text-white cursor-pointer" />
                  {notifications.some((notif) => !notif.read) && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
                      {notifications.filter((notif) => !notif.read).length}
                    </span>
                  )}
                </div>
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
                              notification.read ? "bg-white" : "bg-gray-100"
                            } hover:bg-gray-200`}
                          >
                            <h4 className="font-semibold">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                notification.created_at
                              ).toLocaleString()}
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
              {studentInfo && (
                <div className="relative" ref={profileDropdownRef}>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-semibold">
                      {studentInfo.name}
                    </span>
                    <img
                      src={`http://localhost:9090/profile_pictures/${studentInfo.profile_picture}`}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover cursor-pointer"
                      onClick={toggleDropdown}
                    />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                      <Link
                        to="/userprofile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/profileSettings"
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;
