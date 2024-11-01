import React from "react";
import { useNavigate, Link } from "react-router-dom";

function ClassCard(props) {
  return (
    <Link to={`/course/${props.id}/dashboard`}>
      <article className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 transition-transform transform hover:scale-105">
        <span className="inline-block rounded bg-blue-600 p-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        </span>

        <h3 className="mt-0.5 text-lg font-medium text-gray-900">
          {props.className}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500"></p>

        <a className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
          Created By {props.teacher}
        </a>
      </article>
    </Link>
  );
}

export default ClassCard;
