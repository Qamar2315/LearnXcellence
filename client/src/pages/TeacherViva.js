import React, { useState, useEffect, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../helpers/AuthContext";
import Success from "../components/Success";
import Alert from "../components/Alert";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { FlashContext } from "../helpers/FlashContext"; // Import FlashContext

function TeacherViva() {
  const [vivas, setVivas] = useState([]);
  const [showTodayVivas, setShowTodayVivas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({}); // Store the remark data
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const fetchVivas = async () => {
    try {
      const url = showTodayVivas
        ? `${process.env.REACT_APP_API_URL}/viva/${courseId}/getTodayVivas`
        : `${process.env.REACT_APP_API_URL}/viva/${courseId}/getAllVivas`;
      const res = await axios.get(url, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.data.success) {
        setVivas(res.data.data);
      } else {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Error",
          type: "error",
        });
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: error.response?.data?.message || "Failed to fetch vivas",
        heading: "Error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch vivas when component mounts or when showTodayVivas changes
  useEffect(() => {
    fetchVivas();
  }, [showTodayVivas]);

  const handleVivaClick = (vivaId) => {
    // Navigate to the viva details page
    navigate(`${vivaId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <TeacherNavbar />
      <div className="flex">
        <TeacherSidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Viva Schedule</h1>
          {/* Flash messages */}
          <div className="max-w-2xl mx-auto mb-4">
            {flashMessage.status &&
              (flashMessage.type === "error" ? (
                <Alert
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ) : (
                <Success
                  message={flashMessage.message}
                  heading={flashMessage.heading}
                />
              ))}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showTodayVivas"
              checked={showTodayVivas}
              onChange={() => setShowTodayVivas(!showTodayVivas)}
              className="mr-2"
            />
            <label htmlFor="showTodayVivas" className="text-lg">
              Show Today's Vivas
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(75vh-4rem)] overflow-y-auto">
            {vivas.length > 0 ? (
              vivas.map((viva) => (
                <div
                  key={viva._id}
                  onClick={() => handleVivaClick(viva._id)}
                  className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Viva {viva._id}
                  </h3>
                  <p
                    className={`mb-2 font-semibold ${
                      viva.status === "taken"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    <strong>Status:</strong> {viva.status}
                  </p>

                  <p className="text-gray-600 mb-2">
                    <strong>Date Created:</strong>{" "}
                    {new Date(viva.dateCreated).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Viva Date:</strong>{" "}
                    {new Date(viva.vivaDate).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No vivas available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherViva;
