import React from 'react'
import { AuthContext } from '../helpers/AuthContext';
import { FlashContext } from '../helpers/FlashContext';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Alert from './Alert';
import Success from './Success';

function Navbar() {
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const { authState, setAuthState } = useContext(AuthContext);
  const logout = () => {
    sessionStorage.setItem("name", "");
    sessionStorage.setItem("id", "");
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("isTeacher", false);
    sessionStorage.setItem("status", false);
    setAuthState({
      name: "",
      id: "",
      status: false,
      isTeacher: false
    });
    setFlashMessage(
      {
        status: true,
        message: "You are logged out of your account",
        heading: "Logged Out",
        type: "success"
      }
    )
  }
  return (
    <>
      <div className="bg-white p-2 rounded-lg shadow-md flex justify-between">
        <Link to={'/studentDashboard'}>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
        </Link>
        <Link
          to={'/login'}
          onClick={logout}
          className="text-grey hover:text-gray-500 font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Logout {authState.name}
        </Link>
      </div>
      {
        flashMessage.status &&
        <div className='flex justify-center mt-10'>
          <div className='w-2/3'>
            {flashMessage.status && flashMessage.type == "error" && <Alert message={flashMessage.message} heading={flashMessage.heading} />}
            {flashMessage.status && flashMessage.type == "success" && <Success message={flashMessage.message} heading={flashMessage.heading} />}
          </div>
        </div>
      }
    </>
  )
}

export default Navbar