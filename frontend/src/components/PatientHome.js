import { useNavigate } from "react-router-dom"; // 导入 Link
import { logout } from "../services/userService"; 
import React from "react";

function PatientHome() {
    const navig = useNavigate();
    const handleJump = async() =>{
        try {
            await logout();
            navig('/'); // 登出成功后跳转到主页
        } catch (error) {
            console.error('Logout failed:', error);
            // 处理错误情况（例如显示错误消息）
        }

    }

    return (
        <div>
            <label>
            Hi, Patient.
            </label>
            <br/>
            <br/>
            <button onClick={handleJump}>Logout to Home Page</button>
        </div>
        


    )


}


export default PatientHome;