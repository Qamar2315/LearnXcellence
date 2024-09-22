// Sidebar.js
import React from "react";
import { NavLink, useParams } from "react-router-dom";

function Sidebar() {
  const { courseId } = useParams(); // Get courseId from the URL

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-5 text-2xl font-semibold bg-blue-900">Menu</div>
      <ul className="flex-grow">
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}`}
            activeClassName="bg-blue-700"
            exact
          >
            Course Home Page
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/lectures`}
            activeClassName="bg-blue-700"
            exact
          >
            Lectures
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/project`}
            activeClassName="bg-blue-700"
          >
            Projects
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/viva`}
            activeClassName="bg-blue-700"
          >
            Viva
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/assignments`}
            activeClassName="bg-blue-700"
          >
            Assignments
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/quizzes`}
            activeClassName="bg-blue-700"
          >
            Quizzes
          </NavLink>
        </li>
        <li className="p-4 hover:bg-blue-700 cursor-pointer">
          <NavLink
            to={`/course/${courseId}/coursesettings`}
            activeClassName="bg-blue-700"
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
