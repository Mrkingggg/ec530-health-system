import { useNavigate } from "react-router-dom";
import { logout } from "../services/userService"; 
import React, {useEffect, useState} from "react";
import  { useAuth } from '../components/AuthContext';
import "./PatientHome.css";

function PatientHome() {
    const navig = useNavigate();
    const handleJump = async() =>{
        try {
            await logout();
            navig('/'); 
        } catch (error) {
            console.error('Logout failed:', error);
           
        }

    }

    const { user } = useAuth();
    const [measurements, setMeasurements] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    useEffect(() => {
        const fetchMeasurements = async () => {
            if (user) {
                try {
                    const response = await fetch(`/api/patient/view_measurements/${user.userId}`);
                    const data = await response.json();
                    setMeasurements(data);
                } catch (error) {
                    console.error('Failed to fetch measurements:', error);
                }
            }
        };
        fetchMeasurements();
    }, [user]); 
    const fetchMeasurements = async () => {
        if (user) {
            try {
                const response = await fetch(`/api/patient/view_measurements/${user.userId}`);
                const data = await response.json();
                setMeasurements(data);
            } catch (error) {
                console.error('Failed to fetch measurements:', error);
            }
        }
    };
    const handleRefresh = async () =>{
        fetchMeasurements();
    }
    const handleAppointment = async (event) => {
        event.preventDefault();
        const appointmentData = {
            doctorId: parseInt(doctorId),
            patientId: user.userId, 
            appointment_time: appointmentTime
        };
        try {
            const response = await fetch('/api/patient/makeAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });
            const data = await response.json();
            alert(data.message || 'Appointment Scheduled!');
        } catch (error) {
            console.error('Failure', error);
            alert('Failed! Try again');
        }
    };



    return (
        <div>
            <div>
                <h1>Hi , Patient !</h1>
            </div>
            <div className="container">
                <div className="left-panel">
                    <div className="data-container">
                        <h2>Personal Basic Info.</h2>
                        <div className="data-item">
                            <p>Patient Name: {user && user.fullname}</p>
                            <p>Gender: {user && user.gender}</p>
                            <p>Date of Birth: {user && user["date of birth"]}</p>
                        </div><br/><br/>
                        <h2>Schedule an Appointment</h2>
                    <form onSubmit={handleAppointment}>
                        <label>
                            Doctor ID:<br/><br/>
                            <input
                                type="number"
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                            />
                        </label><br/><br/>
                        <label>
                            Appointment Time:<br/><br/>
                            <input
                                type="datetime-local"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                            />
                        </label><br/><br/>
                        <button type="submit">Make Appointment</button>
                    </form>
                    <button onClick={handleJump}>Logout</button>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="data-container">
                        <h2>Latest Measurement Data</h2>
                            {measurements.map((m, index) => (
                                <div key={index} className="data-item">
                                    <p>Type: <span>{m.measuretype}</span></p>
                                    <p>Value: <span>{m.value} {m.unit}</span></p>
                                    <p>Time: <span>{m.measuretime}</span></p>
                                </div>
                            ))}
                    </div><br/>
                    <button onClick={handleRefresh}>Refresh</button>
                </div>
                
            </div>
        </div>
                    
        


    )


}


export default PatientHome;