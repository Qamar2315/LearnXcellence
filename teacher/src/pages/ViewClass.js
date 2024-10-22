import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FlashContext } from "../helpers/FlashContext";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function ViewClass() {
  let { classId } = useParams();
  const [viewClass, setViewClass] = useState({
    className: "French",
    projectStartDate: "24,12,2024",
    projectEndDate: "24,24,2332",
    vivaStartDate: "24",
    vivaEndDate: "34",
    projects: [
      {
        name: "awais",
        _id: "23",
        status: "active",
      },
    ],
  });
  const { authState } = useContext(AuthContext);
  const { setFlashMessage } = useContext(FlashContext);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!authState.status && !authState.isTeacher) {
  //       navigate("/login");
  //     }
  //     axios
  //       .get(`${process.env.REACT_APP_API_URL}/class/${classId}`, {
  //         headers: {
  //           "Content-type": "application/json",
  //           authorization: `Bearer ${authState.token}`,
  //         },
  //       })
  //       .then((res) => {
  //         if (res.data.message) {
  //           setFlashMessage({
  //             status: true,
  //             message: res.data.message,
  //             heading: "Something went wrong",
  //             type: "error",
  //           });
  //         } else {
  //           //   setViewClass(res.data);
  //         }
  //       });
  //   }, []);

  return (
    <>
      <Navbar />
      <Link to={"/studentDashboard"}>
        <button className="text-blue-500 hover:text-blue-600 text-lg font-semibold px-4">
          back
        </button>
      </Link>
      {viewClass && (
        <div>
          <h1 className="text-2xl font-semibold text-blue-800 px-4 py-1">
            {viewClass.className}
          </h1>
        </div>
      )}

      <div className="flex w-full">
        <div className="w-11/12">
          <div className="flex justify-between pl-4 pr-4">
            <div className="text-left">
              <h5 className="text-gray-700 font-semibold">
                Project start date: "34-43"
              </h5>
              <h5 className="text-gray-700 font-semibold">
                Project end date: "304"
              </h5>
            </div>
            <div className="text-left">
              <h5 className="text-gray-700 font-semibold">
                Viva start date: "viewClass.vivaStartDate"
              </h5>
              <h5 className="text-gray-700 font-semibold">
                Viva end date: "viewClass.vivaEndDate"
              </h5>
            </div>
          </div>
          <div className="text-blue-600 font-semibold text-2xl px-4 pt-3">
            Projects
          </div>

          <div className="h-96 bg-white rounded-lg overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              //{" "}
              {/* <Link to={`/viewclass/${viewClass._id}/project/${project._id}`}> */}
              <div className="bg-white rounded-lg shadow-md p-6 w-full hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    "PROJECT NAEM"
                  </h2>

                  <span className="bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                    "project.status.status"
                  </span>

                  <span className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                    "project.status.status"
                  </span>

                  <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                    " project.status.status"
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm font-semibold">
                    Project Leader:
                  </p>
                  <p className="text-gray-800">"project.projectLeader.name"</p>
                </div>
              </div>
              // {/* </Link> */}
            </div>
          </div>

          <div className="bg-blue-200 p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold text-blue-800">
              No Projects Added Yet
            </p>
            <p className="text-sm text-gray-600">Be the first to add</p>
          </div>

          <div className="w-full flex justify-around pt-8">
            <button class="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <i class="fas fa-plus"></i>
              Viva Menu
            </button>
            <Link to={`/viewClass/${viewClass._id}/addProject`}>
              <button class="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <i class="fas fa-plus"></i>
                Add Project
              </button>
            </Link>
            <button class="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <i class="fas fa-plus"></i>
              View My Project
            </button>
          </div>
        </div>
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Notifications
          </h1>
          <div>
            <div className="mb-4 p-2 border border-gray-200 rounded-lg">
              <h6 className="text-gray-800">Please come to lab</h6>
            </div>
            <div className="mb-4 p-2 border border-gray-200 rounded-lg">
              <h6 className="text-gray-800">I am waiting</h6>
            </div>
            <div className="mb-4 p-2 border border-gray-200 rounded-lg">
              <h6 className="text-gray-800">Students assemble</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewClass;
