import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import { FlashContext } from './helpers/FlashContext';

import Error from './pages/Error';
import Register from './pages/Register';
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import JoinClass from './pages/JoinClass';
import ViewClass from './pages/ViewClass';
import AddProject from './pages/AddProject';
import ViewProject from './pages/ViewProject';

function App() {
  const [authState, setAuthState] = useState(
    {
      name: sessionStorage.getItem('name'),
      id: sessionStorage.getItem('id'),
      status: sessionStorage.getItem('status'),
      token: sessionStorage.getItem('token'),
      isTeacher: sessionStorage.getItem('isTeacher')
    });
  const [flashMessage, setFlashMessage] = useState({
    status:false,
    message:"",
    heading:"",
    type:""
  });
  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <FlashContext.Provider value={{flashMessage,setFlashMessage}} >
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
            <Route path='login' exact element={<Login />} />
            <Route path='register' exact element={<Register />} />
            <Route path='studentDashboard' exact element={<StudentDashboard/>}/>
            <Route path='joinClass' exact element={<JoinClass/>}/>
            <Route path='viewclass/:classId' exact element={<ViewClass/>}/>
            <Route path='viewclass/:classId/addProject' exact element={<AddProject/>}/>
            <Route path='viewclass/:classId/project/:projectId' exact element={<ViewProject/>}/>

            <Route path='*' element={<Error message="We can't find that page." status="404" />} />
          </Routes>
        </Router>
      </FlashContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
