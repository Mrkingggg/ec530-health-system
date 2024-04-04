import React from 'react';
import UserForm from './components/UserForm';
import ChgRForm from './components/ChgRForm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserHomeForm from './components/UserHomeForm';
// import { Navigate, Outlet } from 'react-router-dom';
import "./App.css"


// Make sure users have logged in before other operations.
// Block Users haven't logged in to reach any web pages but home
// const isAuthenticated = () => {
//     return !!localStorage.getItem('user');
// };

// const ProtectedRoute = () => {
//     return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
// };
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
                    <Route path="/userhome" element={<UserHomeForm />} />
                    <Route path="/changeRoles" element={<ChgRForm />} />
                    
                </Routes>
            </div>
        </Router>
    );
}
export default App;