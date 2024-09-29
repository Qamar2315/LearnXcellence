import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Quizzes() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Assignments</h1>
          <p className="text-lg mb-6">
            This is the Assignments page. You can add your Assignments content
            here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
