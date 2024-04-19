import React, { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link
import { logout } from "../services/userService"; 
import "./comp.css"
import { useAuth } from "./AuthContext";

function MPHome() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        console.log(user);
        if(!user){
            console.log("user is null");
        }

        if (user && user.role === 2) { 
            fetch(`/api/MP/view_appointment?doctorId=${user.userId}`)
                .then(response => response.json())
                .then(data => setAppointments(data))
                .catch(error => console.error('获取数据出错: ', error));
        }
    }, [user]);
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
            <h1>Appointments</h1><br/> <br/> 
            <ul>
                {appointments.map(appt => (
                    <li key={appt.appointmentId}>
                        patientID: {appt.patientId}, appointment_time: {appt.appointmentTime}, status: {appt.status}
                    </li>
                ))}
            </ul>
            <br/><br/>
            <Link to="/browsepatients" className="button-jump">Browse Patients.</Link><br/><br/><br/>
            <button onClick={handleLogout}>Logout</button> 
        </div>
    );
}

export default MPHome;
