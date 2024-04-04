import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from '../services/userService'; 


function Logout(){

    const navig = useNavigate();

    React.useEffect(() => {
        const handleLogout = async () => {
            try {
                await logout();
                navig('/');
            }catch(error){
                alert('logout failed'+error.message);
            }
        };

        handleLogout();

    },[navig]);

    return (
        <h2>Log out</h2>
    );


}


export default Logout;