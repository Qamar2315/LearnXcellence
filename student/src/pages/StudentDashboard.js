import React from "react";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import ClassCard from "../components/ClassCard";
import axios from "axios";
import Navbar from "../components/Navbar";
import ClassNotJoinedMessage from "../components/ClassNotJoinedMessage";

function StudentDashboard() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!authState.status && !authState.isTeacher) {
  //     navigate('/login');
  //   }
  //   axios.get(`${process.env.REACT_APP_API_URL}/class/getAll`,
  //     {
  //       headers: {
  //         "Content-type": "application/json",
  //         authorization: `Bearer ${authState.token}`
  //       }
  //     }
  //   ).then((res) => {
  //     if (res.data.message) {
  //       setFlashMessage(
  //         {
  //           status: true,
  //           message: res.data.message,
  //           heading: "Something went wrong",
  //           type: "error"
  //         }
  //       )
  //     } else {
  //       setClasses(res.data.classes);
  //     }
  //   })
  // }, [])
  return (
    <div>
      <Navbar />
      {classes.length == 0 ? (
        <ClassNotJoinedMessage />
      ) : (
        <div className="overflow-y-auto h-96 m-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 m-10">
            {classes.map((classItem) => {
              return (
                <ClassCard
                  id={classItem._id}
                  className={classItem.className}
                  teacher={classItem.teacher.name}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <Link
          to={"/joinClass"}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          Join New Class
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
