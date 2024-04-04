import React, { useState } from 'react';
import { login } from "../services/userService";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navig_login = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
           const data = await login(username, password);
            setMessage(data.message);
            navig_login('/userhome')
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {message && <p style={{color: 'green'}}>{message}</p>}
        </div>
    );
}

export default LoginForm;
