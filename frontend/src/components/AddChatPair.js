import React, { useState } from "react";
import { add_chat } from "../services/userService";
import { useAuth } from "./AuthContext";
// import BrowsePatient from "./BrowsePatient";

function AddChatPair(){
    // const [MPid, setMPid] = useState('');
    const [patientid, setPatientid] = useState('');

    // const handleMPidChange = (e) => setMPid(e.target.value);
    const handlePatientidChange = (e) => setPatientid(e.target.value);

    const { user } = useAuth();

    const handleAddChats = async(e) => {
        e.preventDefault();
        try{
            // setMPid(user.userId);
            const data = await add_chat(user.userId, patientid);
            console.log('success adding chat',data);
            alert('chat added successfully!');
            setPatientid('');
            // setMPid('');
        }catch (error) {
            console.error('Failed to submit data:', error);
            alert('Failed to submit data: ' + error.message);
        }
    }



    return (
        <div>

            <h1>Add Patients to Chat</h1>
            {/* <p>{user.userId}</p> */}
            <form onSubmit={handleAddChats}>
                <lable>
                    patientid:
                    <input type="text" value={patientid} onChange={handlePatientidChange} required/>
                </lable>
                <br/>
                <button type="submit">Submit</button>

            </form>
        </div>


    );


}



export default AddChatPair;