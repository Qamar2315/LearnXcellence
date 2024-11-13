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
import TeacherLogin from "./pages/TeacherLogin";
import TeacherRegister from "./pages/TeacherRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherCoursePage from "./pages/TeacherCoursePage";
import TeacherProjects from "./pages/TeacherProject";
import TeacherProjectDetail from "./pages/TeacherProjectDetail";
import TeacherLectures from "./pages/TeacherLectures";
import TeacherCourseSetting from "./pages/TeacherCourseSetting";
import TeacherProfileSettings from "./pages/TeacherProfileSettings";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherViva from "./pages/TeacherViva";
import TeacherVivaDetails from "./pages/TeacherVivaDetails";
import TeacherAssignment from "./pages/TeacherAssignment";
import TeacherAssignmentDetails from "./pages/TeacherAssignmentDetails";
import StudentAssignmentDetails from "./pages/StudentAssignmentsDetails";
import TeacherAssignmentRemarks from "./pages/TeacherAssignmentRemarks";
import StudentAssignmentRemarks from "./pages/StudentAssignmentRemarks";
import TeacherPolls from "./pages/TeacherPolls";
import StudentPolls from "./pages/StudentPolls";

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
              <Route path="teacher/login" exact element={<TeacherLogin />} />
              <Route
                path="emailVerification"
                exact
                element={<EmailVerification />}
              />
              <Route path="register" exact element={<Register />} />
              <Route
                path="teacher/register"
                exact
                element={<TeacherRegister />}
              />
              <Route path="course" exact element={<StudentDashboard />} />
              <Route
                path="course/teacher"
                exact
                element={<TeacherDashboard />}
              />
              <Route path="joinClass" exact element={<JoinClass />} />
              <Route
                path="profileSettings"
                exact
                element={<ProfilleSettings />}
              />

              <Route
                path="teacherProfileSettings"
                exact
                element={<TeacherProfileSettings />}
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
              <Route
                path="course/:courseId/dashboard/teacher"
                exact
                element={<TeacherCoursePage />}
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
                path="course/:courseId/project/teacher"
                exact
                element={<TeacherProjects />}
              />

              <Route
                path="course/:courseId/project/:projectId"
                exact
                element={<ProjectDetail />}
              />

              <Route
                path="course/:courseId/project/teacher/:projectId"
                exact
                element={<TeacherProjectDetail />}
              />
              <Route
                path="course/:courseId/lectures"
                exact
                element={<StudentLectures />}
              />
              <Route
                path="course/:courseId/lectures/teacher"
                exact
                element={<TeacherLectures />}
              />

              <Route
                path="course/:courseId/assignments"
                exact
                element={<Assignments />}
              />
              <Route
                path="course/:courseId/assignments/:assignmentId"
                exact
                element={<StudentAssignmentDetails />}
              />

              <Route
                path="course/:courseId/assignments/:assignmentId/:submissionId/remarks"
                exact
                element={<StudentAssignmentRemarks />}
              />

              <Route
                path="course/:courseId/assignments/teacher"
                exact
                element={<TeacherAssignment />}
              />

              <Route
                path="course/:courseId/polls"
                exact
                element={<StudentPolls />}
              />

              <Route
                path="course/:courseId/polls/teacher"
                exact
                element={<TeacherPolls />}
              />

              <Route
                path="course/:courseId/quizzes"
                exact
                element={<Quizzes />}
              />

              <Route
                path="course/:courseId/project/:projectId/:vivaId"
                exact
                element={<Viva />}
              />
              <Route
                path="course/:courseId/viva/teacher"
                exact
                element={<TeacherViva />}
              />

              <Route
                path="course/:courseId/viva/teacher/:vivaId"
                exact
                element={<TeacherVivaDetails />}
              />

              <Route
                path="course/:courseId/assignments/teacher/:assignmentId"
                exact
                element={<TeacherAssignmentDetails />}
              />

              <Route
                path="course/:courseId/assignments/teacher/:assignmentId/submission/:submissionId"
                exact
                element={<TeacherAssignmentRemarks />}
              />

              <Route
                path="course/:courseId/coursesettings"
                exact
                element={<CourseSettings />}
              />

              <Route
                path="course/:courseId/coursesettings/teacher"
                exact
                element={<TeacherCourseSetting />}
              />

              <Route path="userprofile" exact element={<UserProfile />} />
              <Route path="teacherProfile" exact element={<TeacherProfile />} />

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
