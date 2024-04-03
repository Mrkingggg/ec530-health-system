import { useState } from "react";
import React from "react";
import { changeRole } from "../services/userService";

const Role = {
    PATIENT: 1,
    DOCTOR: 2,
    ADMIN: 3
};

const ChgRForm = () =>{

    const [userId, setUserId] = useState('');
    const [newRoles, setNewRoles] = useState([]);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const result = await changeRole(userId, newRoles)
            console.log('Roles change',result);

        }catch(error){
            console.error('erroring change roles',error);
        }
    };

    const handleRoleChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setNewRoles(value);
    };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                User ID:
                <input type="text" value={userId} onChange={e => setUserId(e.target.value)} />
            </label>
            <br />
            <label>
                New Roles:<br/>
                <select multiple={true} onChange={handleRoleChange}>
                    <option value = {Role.ADMIN}>Admin</option>
                    <option value = {Role.DOCTOR}>Doctor</option>
                    <option value = {Role.PATIENT}>Patient</option>
                </select>
            </label>
            <br />
            <button type="submit">Change Role</button>
        </form>
    );
};

export default ChgRForm;