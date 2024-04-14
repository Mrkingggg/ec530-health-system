import React from "react";
import "./comp.css"
import { useEffect, useState } from "react";
import { browse_patient } from "../services/userService";
function BrowsePatient(){

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const data = await browse_patient(); // 确保已经导入或定义了这个函数
                setPatients(data);
            } catch (error) {
                setError('Failed to load patients: ' + error.message);
            }
            setLoading(false);
        };

        fetchPatients();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    
    return (
        <div>
            <table className="table-center">
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Full Name</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.userId}>
                            <td>{patient.userId}</td>
                            <td>{patient.fullname}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.dob}</td>
                            <td>{patient.username}</td>
                            <td>{patient.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );

};

export default BrowsePatient;



