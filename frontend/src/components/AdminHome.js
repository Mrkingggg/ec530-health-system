import React from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link
import { logout } from "../services/userService"; 

function AdminHome() {

    const navig = useNavigate();
    const handleLogout = async() =>{
        try{
            await logout();
            navig('/');
        }catch(error){
            console.error("error in logout",error);
        }

        
    }
    return(
        <div>
            <h1>Hi, Admin</h1><br/>

            <Link to="/changeRoles">Change user's roles</Link><br/>

            <button onClick={handleLogout}>Logout to Home Page.</button>
        </div>


    )



}



export default AdminHome;