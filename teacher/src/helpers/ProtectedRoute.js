// src/components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);

  // Check if the user is logged in based on the presence of the token
  if (!authState.token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
