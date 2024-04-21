import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../services/userService";
import "./comp.css";
import { useAuth } from "./AuthContext";
import AddPatientData from "./AddPatientData";

function MPHome() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        if (user && user.role === 2) {
            fetch(`/api/MP/view_appointment?doctorId=${user.userId}`)
                .then(response => response.json())
                .then(data => setAppointments(data))
                .catch(error => console.error('获取数据出错: ', error));
        }
    }, [user]);

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = appointments.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    function formatDateTime(dateTimeString) {
        return dateTimeString.replace('T', ' ');
    }

    return (
        <div className="layout">
            <h1>Doctor/Nurse HomePage</h1><br/>
            <div className="main-container">
                <div className="left-section">
                    <div className="personal-info">
                        <h2>MP Personal Info.</h2>
                        <p><strong>Welcome! </strong>{user && user.fullname}</p>
                        <p><strong>Email:</strong> {user && user.email}</p>
                        <p><strong>Date of Birth:</strong> {user && user["date of birth"]}</p><br/><br/>
                    </div>
                    <div className="appointments-section">
                        <h2>Your Appointments</h2><br/>
                        <table className="table-center">
                            <thead>
                                <tr>
                                    <th>patientID</th>
                                    <th>appointment_time</th>
                                    <th>status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(appt => (
                                    <tr key={appt.appointmentId}>
                                        <td>{appt.patientId}</td>
                                        <td>{formatDateTime(appt.appointmentTime)}</td>
                                        <td>{appt.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
                            <span> Page {currentPage} of {totalPages} </span>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
                        </div><br/>
                    </div>
                </div>
                <div className="right-section">
                    <AddPatientData />
                </div>
            </div>
            <Link to="/browsepatients" className="button-jump">Browse All Patients</Link><br/><br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default MPHome;
