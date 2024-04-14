import React from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link
import { logout } from "../services/userService"; 
import "./comp.css"

function MPHome() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // 登出成功后跳转到主页
        } catch (error) {
            console.error('Logout failed:', error);
            // 处理错误情况（例如显示错误消息）
        }
    };

    return (
        <div>
            <h1>Doctor/Nurse Home</h1><br/> 
            <br/><br/>
            <Link to="/browsepatients" className="button-jump">Browse Patients.</Link><br/><br/><br/>
            <button onClick={handleLogout}>Logout</button> {/* 登出按钮 */}
        </div>
    );
}

export default MPHome;
