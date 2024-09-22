// Project.js
import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Project() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Project Page</h1>
          <p className="text-lg mb-6">This is the project page content.</p>
        </div>
      </div>
    </div>
  );
}

export default Project;
