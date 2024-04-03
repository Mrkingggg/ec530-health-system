import React from 'react';
import UserForm from './components/UserForm';
import ChgRForm from './components/ChgRForm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home = () =>(
    <div>
        <h1>Health App -- Home Page</h1>
        <nav>
            <ul>
                <li><Link to="/adduser">New User Create an Account.</Link></li>
                <li><Link to="/changeRoles">Change Roles of Users</Link></li>
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
                    <Route path="adduser" element={<UserForm />}/>
                    <Route path="changeRoles" element={<ChgRForm />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;
