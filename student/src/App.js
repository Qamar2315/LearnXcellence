import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import { FlashContext } from "./helpers/FlashContext";

import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import JoinClass from "./pages/JoinClass";
import ViewClass from "./pages/ViewClass";
import AddProject from "./pages/AddProject";
import ViewProject from "./pages/ViewProject";
import EmailVerification from "./pages/EmailVerification";
import ProfilleSettings from "./pages/ProfilleSettings";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import CoursePage from "./pages/CoursePage";
import Project from "./pages/Project";
import StudentLectures from "./pages/StudentLectures";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import Viva from "./pages/Viva";
import CourseSettings from "./pages/CourseSettings";
import ProjectDetail from "./pages/ProjectDetail";

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
              {/* <Route path='/teacher'>
              <Route path='login' exact element={<LoginTeacher />} />
              <Route path='register' exact element={<RegisterTeacher />} />
              <Route path='teacherDashboard' exact element={<TeacherDashboard />}>
                <Route path='/:classId' exact element={<Dashboard />} />
              </Route>
              <Route path='profile' exact element={<TeacherProfile />} />
            </Route>
            <Route path='/' exact element={<Navbar />}>
              <Route path='home' exact element={<Home />} />
            </Route> */}
              <Route path="login" exact element={<Login />} />
              <Route
                path="emailVerification"
                exact
                element={<EmailVerification />}
              />
              <Route path="register" exact element={<Register />} />
              <Route path="course" exact element={<StudentDashboard />} />
              <Route path="joinClass" exact element={<JoinClass />} />
              <Route
                path="profileSettings"
                exact
                element={<ProfilleSettings />}
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
                path="course/:courseId/dashboard"
                exact
                element={<CoursePage />}
              />

              <Route path="viewclass/:courseId" exact element={<ViewClass />} />
              <Route
                path="course/:courseId/addProject"
                exact
                element={<AddProject />}
              />
              <Route
                path="viewclass/:classId/project/:projectId"
                exact
                element={<ViewProject />}
              />

              <Route
                path="course/:courseId/project"
                exact
                element={<Project />}
              />

              <Route
                path="course/:courseId/project/:projectId"
                exact
                element={<ProjectDetail />}
              />
              <Route
                path="course/:courseId/lectures"
                exact
                element={<StudentLectures />}
              />

              <Route
                path="course/:courseId/assignments"
                exact
                element={<Assignments />}
              />

              <Route
                path="course/:courseId/quizzes"
                exact
                element={<Quizzes />}
              />

              <Route path="course/:courseId/viva" exact element={<Viva />} />

              <Route
                path="course/:courseId/coursesettings"
                exact
                element={<CourseSettings />}
              />

              <Route path="userprofile" exact element={<UserProfile />} />

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
