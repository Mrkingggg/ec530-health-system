import React from 'react';
import UserForm from './components/UserForm';
import ChgRForm from './components/ChgRForm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import MPHome from './components/MPHome';
import PatientHome from './components/PatientHome';
import AdminHome from './components/AdminHome';
// import { Navigate, Outlet } from 'react-router-dom';w
import "./App.css"
import AddDevForm from './components/AddDevForm';
import ManageDev from './components/ManageDev';
import BrowsePatient from './components/BrowsePatient';

const Home = () =>(
    <div>
        <h1>Health App -- Home Page</h1>
        < LoginForm />
        <nav>
            <ul>
                <li><Link to="/adduser">New User Create an Account.</Link></li>
                {/* <li><Link to="/changeRoles">Change Roles of Users</Link></li> */}
            </ul>
        </nav>
    </div>
);
function App(){
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/adduser" element={<UserForm />} />
                    <Route path="/patienthome" element={<PatientHome />} />
                    <Route path="/mphome" element={<MPHome />} />
                    <Route path="/adminhome" element={<AdminHome />} />
                    <Route path="/addDev" element={<AddDevForm />} />
                    <Route path="/changeRoles" element={<ChgRForm />} />
                    <Route path="/managedev" element={<ManageDev />} />
                    <Route path="/browsepatients" element={<BrowsePatient />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;
