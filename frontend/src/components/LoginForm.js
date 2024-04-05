import React, { useState } from 'react';
import { login } from "../services/userService";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient'); // 默认角色为patient
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            const data = await login(username, password, role);
            setMessage(data.message);
            // 假设登录成功后，后端返回的data中包含角色信息
            switch (data.role) { // 使用返回的角色信息来决定跳转目标
                case 'admin':
                    navigate('/adminhome'); // 跳转到管理员主页
                    break;
                case 'doctor/nurse':
                    navigate('/mphome'); // 跳转到医生/护士主页
                    break;
                case 'patient':
                    navigate('/patienthome'); // 跳转到患者主页
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
                    <option value={RoleList.DOCTOR}>Doctor/Nurse</option>
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
