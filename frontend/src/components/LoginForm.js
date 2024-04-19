import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext'; 
// import { loginUser } from '../services/userService';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(3); 
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const RoleList = {
        PATIENT: 1,
        DOCTOR: 2,
        ADMIN: 3
    };
        
    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
    
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({ username, password, role })
            });
            const data = await response.json();
            
            if(!response.ok){
                throw new Error(data.error || data.bad_request || 'Login failed');
            }
            console.log('login storing data...',data)
            login(data)
            setMessage(data.message);
            
            
            switch (data.role) { 
                
                case 3:
                    navigate('/adminhome'); 
                    break;
                case 2:
                    navigate('/mphome'); 
                    break;
                case 1:
                    navigate('/patienthome'); 
                    break;
                default:
                    setError('Unknown role');
                    break;
            }
        } catch (error) {
            setError(error.message);
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label><br/>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label><br/>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value={RoleList.ADMIN}>Admin</option>
                    <option value={RoleList.DOCTOR}>Doctor</option>
                    <option value={RoleList.PATIENT}>Patient</option>
                </select><br/>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {message && <p style={{color: 'green'}}>{message}</p>}
        </div>
    );
}

export default LoginForm;
