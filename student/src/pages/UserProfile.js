import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Navbar from "../components/Navbar";

function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profile_picture: "",
  });
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the user information from the API
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/student/66e1f33d2f94d27ee5c3c3df`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>

        <div className="flex flex-col items-center">
          <img
            className="w-32 h-32 rounded-full object-cover mb-4"
            src={`http://localhost:9090/profile_pictures/${userInfo.profile_picture}`}
            alt="Profile"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold">{userInfo.name}</h2>
            <p className="text-gray-600">{userInfo.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
