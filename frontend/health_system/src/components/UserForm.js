import React, { useState } from 'react';
import { addUser } from '../services/userService';

const UserForm = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        dob: '',
        fullname: '',
        password: '',
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
            <button type="submit">Add User</button>
        </form>
    );
};

export default UserForm;
