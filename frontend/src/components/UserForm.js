import React, { useState } from 'react';
import { addUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
const Role = {
    PATIENT: 1,
    DOCTOR: 2,
    ADMIN: 3
};
const Gender = {
    FEMALE: 'female',
    MALE: 'male',
    OTHER: 'other'
};

const UserForm = () => {
    const navig = useNavigate();
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
            navig("/")

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
                    <option value = {Gender.FEMALE}>Female</option>
                    <option value = {Gender.MALE}>Male</option>
                    <option value = {Gender.OTHER}>Other</option>
                </select>
            </label>
            <br/>
            <br/>
            <label>
                Role(s):
            <br/>
            <br/>

                <select multiple={true} onChange={handleChange}>
                    <option value = {Role.ADMIN}>Admin</option>
                    <option value = {Role.DOCTOR}>Doctor</option>
                    <option value = {Role.PATIENT}>Patient</option>
                </select>
            </label>
            <br/>
            <br/>
            <button type="submit">Add User</button>
        </form>
    );
};

export default UserForm;