import React from "react";
// import AddChatPair from "./AddChatPair";
import ChatList from "./ChatList";
// import { Link } from "react-router-dom";
import "./MPChatSys.css";
import { useNavigate } from "react-router-dom";
import Chatlistpatient from "./Chatlistpatient";
function MPChatSys(){
    const navigate = useNavigate();
    const handleReturn = async () =>{
        navigate('/patienthome')
    }

    return (
        <div>
            <h1>Chatting System</h1>
            <div className="container">
                <div className="chat-list">
                    <Chatlistpatient />
                </div>
                {/* <div className="add-chat-pair">
                    <AddChatPair />
                </div>
                 */}
            </div><br/>
            {/* <Link to="/browsepatients" className="button-jump">Browse All Patients</Link><br/><br/> */}
            <button onClick={handleReturn}>Return to PatientHome</button> 
        </div>
    )


}



export default MPChatSys;