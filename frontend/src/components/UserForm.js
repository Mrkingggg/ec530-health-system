import React, { useState } from 'react';
import { addUser } from '../services/userService';
const Role = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin'
};

const UserForm = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        dob: '',
        fullname: '',
        password: '',
        gender:'',
        role_ids: [],
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await addUser(userData);
            console.log('User added:', result);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields for user data */}
            <label>
                Username:
                <input type="text" name="username" value = {userData.username} onChange={handleChange}/>
            </label>
            <br/>
            <label>
                Password:
                <input type="text" name="password" value={userData.password} onChange={handleChange} ></input>
            </label>
            <br/>
            <label>
                Email:
                <input type="email" name="email" value = {userData.email} onChange={handleChange}/>
            </label><br/>
            <label>
                Date of Birth:
                <input type="date" name="dob" value={userData.dob} onChange={handleChange}/>
            </label>
            <br/>
            <label>
                Fullname:
                <input type = "text" name="fullname" value = {userData.fullname} onChange={handleChange}/>
            </label>
            <br/>
            <label>
                Gender:
                <select value={userData.gender} onChange={handleChange}>
                    <option value = {Role.PATIENT}>Patient</option>
                    <option value = {Role.ADMIN}>Admin</option>
                    <option value = {Role.DOCTOR}>Doctor</option>
                </select>
            </label>

            <br/>
            <button type="submit">Add User</button>
        </form>
    );
};

export default UserForm;
