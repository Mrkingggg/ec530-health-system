import React, { useState } from "react";
import { add_chat } from "../services/userService";

function AddChatPair(){
    const [MPid, setMPid] = useState('');
    const [patientid, setPatientid] = useState('');

    const handleMPidChange = (e) => setMPid(e.target.value);
    const handlePatientidChange = (e) => setPatientid(e.target.value);



    const handleAddChats = async(e) => {
        e.preventDefault();
        try{
            const data = await add_chat(MPid, patientid);
            console.log('success adding chat',data);
            alert('chat added successfully!');
            setPatientid('');
            setMPid('');
        }catch (error) {
            console.error('Failed to submit data:', error);
            alert('Failed to submit data: ' + error.message);
        }
    }



    return (
        <div>
            <h1>Add Patients to Chat</h1>
            <form onSubmit={handleAddChats}>
                <label>
                    MPid:
                    <input type="text" value={MPid} onChange={handleMPidChange} required/>
                </label>
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