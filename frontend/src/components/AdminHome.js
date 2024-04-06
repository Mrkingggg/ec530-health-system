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
            <Link to="/addDev">Add New Device.</Link><br/>
            <button onClick={handleLogout}>Logout</button>
        </div>


    )



}



export default AdminHome;