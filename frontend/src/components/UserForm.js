// import React, { useState } from 'react';
// import { addUser } from '../services/userService';
// import { useNavigate } from 'react-router-dom';

// const Role = {
//     PATIENT: 1,
//     DOCTOR: 2,
//     ADMIN: 3
// };
// const Gender = {
//     FEMALE: 'female',
//     MALE: 'male',
//     OTHER: 'other'
// };

// const UserForm = () => {
//     const navig = useNavigate();
//     const [userData, setUserData] = useState({
//         username: '',
//         email: '',
//         dob: '',
//         fullname: '',
//         password: '',
//         gender:'',
//         role_ids: [],
//     });

//     const handleChange = (e) => {
//         setUserData({ ...userData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const result = await addUser(userData);
//             console.log('User added:', result);
//             navig("/")

//         } catch (error) {
//             console.error('Error adding user:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             {/* Form fields for user data */}
//             <label>
//                 Username:
//                 <input type="text" name="username" value = {userData.username} onChange={handleChange}/>
//             </label>
//             <br/>
//             <label>
//                 Password:
//                 <input type="text" name="password" value={userData.password} onChange={handleChange} ></input>
//             </label>
//             <br/>
//             <label>
//                 Email:
//                 <input type="email" name="email" value = {userData.email} onChange={handleChange}/>
//             </label><br/>
//             <label>
//                 Date of Birth:
//                 <input type="date" name="dob" value={userData.dob} onChange={handleChange}/>
//             </label>
//             <br/>
//             <label>
//                 Fullname:
//                 <input type = "text" name="fullname" value = {userData.fullname} onChange={handleChange}/>
//             </label>
//             <br/>
//             <label>
//                 Gender:
//                 <select value={userData.gender} onChange={handleChange}>
//                     <option value = {Gender.FEMALE}>Female</option>
//                     <option value = {Gender.MALE}>Male</option>
//                     <option value = {Gender.OTHER}>Other</option>
//                 </select>
//             </label>
//             <br/>
//             <br/>
//             <label>
//                 Role(s):
//             <br/>
//             <br/>

//                 <select multiple={true} onChange={handleChange}>
//                     <option value = {Role.ADMIN}>Admin</option>
//                     <option value = {Role.DOCTOR}>Doctor</option>
//                     <option value = {Role.PATIENT}>Patient</option>
//                 </select>
//             </label>
//             <br/>
//             <br/>
//             <button type="submit">Add User</button>
//         </form>
//     );
// };

// export default UserForm;
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
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        dob: '',
        fullname: '',
        password: '',
        gender: '',
        role_ids: []
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        if (type === 'checkbox') {
            // 对于复选框，我们需要特殊处理
            const newRoles = [...userData.role_ids];
            const val = parseInt(value, 10);
            if (checked) {
                // 添加角色到数组
                if (!newRoles.includes(val)) {
                    newRoles.push(val);
                }
            } else {
                // 从数组移除角色
                const index = newRoles.indexOf(val);
                if (index > -1) {
                    newRoles.splice(index, 1);
                }
            }
            setUserData({ ...userData, role_ids: newRoles });
        } else {
            // 对于其他类型的输入，正常处理
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await addUser(userData);
            console.log('User added:', result);
            navigate("/");
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields for user data */}
            {/* ... 其他表单元素 */}
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
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="role_ids"
                            value={Role.ADMIN}
                            checked={userData.role_ids.includes(Role.ADMIN)}
                            onChange={handleChange}
                        />
                        Admin
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="role_ids"
                            value={Role.DOCTOR}
                            checked={userData.role_ids.includes(Role.DOCTOR)}
                            onChange={handleChange}
                        />
                        Doctor
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="role_ids"
                            value={Role.PATIENT}
                            checked={userData.role_ids.includes(Role.PATIENT)}
                            onChange={handleChange}
                        />
                        Patient
                    </label>
                </div>
            </label>
            <button type="submit">Add User</button>
        </form>
    );
};

export default UserForm;
