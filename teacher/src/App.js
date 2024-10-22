import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import { FlashContext } from "./helpers/FlashContext";
import ProtectedRoute from "./helpers/ProtectedRoute"; // Import ProtectedRoute

import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";

import JoinClass from "./pages/JoinClass";
import ViewClass from "./pages/ViewClass";

import ViewProject from "./pages/ViewProject";
import EmailVerification from "./pages/EmailVerification";
import ProfilleSettings from "./pages/ProfilleSettings";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoursePage from "./pages/CoursePage";
import Project from "./pages/Project";
import CourseSetting from "./pages/CourseSetting";
import Lectures from "./pages/Lectures";
import ProjectDetails from "./pages/ProjectDetails";
import Quizzes from "./pages/Quizzes";
import Assignments from "./pages/Assignments";
import Viva from "./pages/Viva";

function App() {
  const [authState, setAuthState] = useState({
    name: sessionStorage.getItem("name"),
    id: sessionStorage.getItem("id"),
    status: sessionStorage.getItem("status"),
    token: sessionStorage.getItem("token"),
    isTeacher: sessionStorage.getItem("isTeacher"),
  });

  const [flashMessage, setFlashMessage] = useState({
    status: false,
    message: "",
    heading: "",
    type: "",
  });

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <FlashContext.Provider value={{ flashMessage, setFlashMessage }}>
          <Router>
            <Routes>
              <Route path="login" exact element={<Login />} />
              <Route
                path="emailVerification"
                exact
                element={<EmailVerification />}
              />
              <Route path="register" exact element={<Register />} />

              {/* Protect routes by wrapping them inside ProtectedRoute */}
              <Route
                path="course"
                exact
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="joinClass"
                exact
                element={
                  <ProtectedRoute>
                    <JoinClass />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profileSettings"
                exact
                element={
                  <ProtectedRoute>
                    <ProfilleSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/dashboard"
                exact
                element={
                  <ProtectedRoute>
                    <CoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/project"
                exact
                element={
                  <ProtectedRoute>
                    <Project />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/lectures"
                exact
                element={
                  <ProtectedRoute>
                    <Lectures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/quizzes"
                exact
                element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/viva"
                exact
                element={
                  <ProtectedRoute>
                    <Viva />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/assignments"
                exact
                element={
                  <ProtectedRoute>
                    <Assignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/coursesettings"
                exact
                element={
                  <ProtectedRoute>
                    <CourseSetting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="viewclass/:classId"
                exact
                element={
                  <ProtectedRoute>
                    <ViewClass />
                  </ProtectedRoute>
                }
              />
              <Route
                path="course/:courseId/project/:projectId"
                exact
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="viewclass/:classId/project/:projectId"
                exact
                element={
                  <ProtectedRoute>
                    <ViewProject />
                  </ProtectedRoute>
                }
              />
              <Route
                path="userprofile"
                exact
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="forget-password"
                exact
                element={<ForgetPassword />}
              />
              <Route
                path="reset-password/:id/:token"
                exact
                element={<ResetPassword />}
              />

              <Route
                path="*"
                element={
                  <Error message="We can't find that page." status="404" />
                }
              />
            </Routes>
          </Router>
        </FlashContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
