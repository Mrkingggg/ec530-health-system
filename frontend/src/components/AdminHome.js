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

            <Link to="/changeRoles" style={{ 
                padding: '10px 15px', 
                backgroundColor:'#006DFF', 
                color: 'white', 
                textDecoration: 'none', 
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block'
                }}>Change user's roles</Link><br/><br/><br/>
            <Link to="/addDev" style={{ 
                padding: '10px 15px', 
                backgroundColor: '#006DFF', 
                color: 'white', 
                textDecoration: 'none', 
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block'
                }}>Add a New Device.</Link><br/><br/><br/>
            <Link to="/managedev" style={{ 
                padding: '10px 15px', 
                backgroundColor: '#006DFF', 
                color: 'white', 
                textDecoration: 'none', 
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block'
                }}>View & Manage Devices.</Link><br/><br/><br/>
            <button onClick={handleLogout}>Logout</button>
        </div>


    )



}



export default AdminHome;