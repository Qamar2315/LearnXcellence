import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Viva() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto mt-5 p-5">
          <h1 className="text-3xl font-bold mb-4">Viva</h1>
          <p className="text-lg mb-6">
            This is the Viva page. You can add your Viva content here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Viva;
