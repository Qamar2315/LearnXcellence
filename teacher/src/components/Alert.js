import React, { useEffect, useState } from "react";
import { FlashContext } from "../helpers/FlashContext";
import { useContext } from "react";

function Alert(props) {
  const { setFlashMessage } = useContext(FlashContext);
  const clicked = () => {
    setFlashMessage({
      status: false,
      message: "",
      heading: "",
      type: "",
    });
  };
  return (
    <div
      role="alert"
      className={
        "rounded border-s-4 border-red-500 bg-red-50 p-4 flex justify-between"
      }
    >
      <div>
        <div className="flex items-center gap-2 text-red-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>

          <strong className="block font-medium"> {props.heading} </strong>
        </div>

        <p className="mt-2 text-sm text-red-700">{props.message}</p>
      </div>
      <button className="text-red-800 p-4" onClick={clicked}>
        {/* <span aria-hidden="true">X</span> */}
        <span className="sr-only">Dismiss popup</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default Alert;
