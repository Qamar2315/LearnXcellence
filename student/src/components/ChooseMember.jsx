import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FlashContext } from "../helpers/FlashContext";
import { AuthContext } from "../helpers/AuthContext";
import { CreateGroupContext } from "../helpers/CreateGroupContext";

function ChooseMember({ onClose }) {
  const { authState } = useContext(AuthContext);
  const { setFlashMessage } = useContext(FlashContext);
  let { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedMembers, setSelectedMembers } =
    useContext(CreateGroupContext);

  useEffect(() => {
    // Fetch members and exclude selected members from the list
    axios
      .get(`${process.env.REACT_APP_API_URL}/course/${courseId}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authState.token}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          setFlashMessage({
            status: true,
            message: res.data.message,
            heading: "Something went wrong",
            type: "error",
          });
        } else {
          const availableMembers = res.data.data.students.filter(
            (student) =>
              !selectedMembers.some((selected) => selected._id === student._id)
          );
          setMembers(availableMembers);
        }
        setLoading(false);
      })
      .catch(() => {
        setFlashMessage({
          status: true,
          message: "Failed to load members",
          heading: "Error",
          type: "error",
        });
        setLoading(false);
      });
  }, [courseId, authState.token, setFlashMessage, selectedMembers]);

  const addMember = (member) => {
    if (selectedMembers.length < 4) {
      setSelectedMembers([...selectedMembers, member]);
      setMembers((prevMembers) =>
        prevMembers.filter((m) => m._id !== member._id)
      );
    } else {
      setFlashMessage({
        status: true,
        message: "A group can have a maximum of four members",
        heading: "Limit Reached",
        type: "warning",
      });
    }
  };

  const removeMember = (member) => {
    if (selectedMembers.length > 1) {
      setSelectedMembers((prevSelectedMembers) =>
        prevSelectedMembers.filter((m) => m._id !== member._id)
      );
      setMembers((prevMembers) => [...prevMembers, member]);
    } else {
      setFlashMessage({
        status: true,
        message: "A group must have at least 1 member",
        heading: "Minimum Requirement",
        type: "warning",
      });
    }
  };

  const handleSaveChanges = () => {
    onClose(); // Close modal after saving changes
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-1/2 h-3/4 p-4 rounded-lg shadow-lg overflow-y-scroll">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chosen Members</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &#x2715;
          </button>
        </div>

        {/* Render selected members */}
        <div className="max-h-64 border border-gray-300 rounded-lg p-4">
          {selectedMembers.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-100">
              {selectedMembers.map((student) => (
                <li
                  key={student._id}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      src={`http://localhost:9090/profile_pictures/${student.account.profile_picture}`}
                      alt={student.name}
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {student.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {student.account.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMember(student)}
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No students in this course</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-6">Choose Members</h2>
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="max-h-64 border border-gray-300 rounded-lg p-4">
            {members.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
                {members.map((student) => (
                  <li
                    key={student._id}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={`http://localhost:9090/profile_pictures/${student.account.profile_picture}`}
                        alt={student.name}
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {student.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {student.account.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addMember(student)}
                      className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students to choose from</p>
            )}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseMember;
