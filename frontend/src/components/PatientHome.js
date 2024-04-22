import { useNavigate } from "react-router-dom";
import { logout } from "../services/userService"; 
import React from "react";

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

    return (
        <div>
           <h1>Hi, Patient</h1>
            <br/>
            <br/>
            <div>
                <h2>Persoal Health Data</h2>
            </div>
            <button onClick={handleJump}>Logout to Home Page</button>
        </div>
        


    )


}


export default PatientHome;