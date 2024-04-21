import React from "react";
import "./comp.css"
import { useEffect, useState } from "react";
import { browse_patient } from "../services/userService";
import { useNavigate } from "react-router-dom";
function BrowsePatient(){
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = patients.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(patients.length / itemsPerPage);

    const handleReturn = async () =>{
        navigate('/mphome')
    }
    function formatDateTime(dateTimeString) {
        return dateTimeString.replace('T', ' ');
      }
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
        <div className="browse-body">
            <h1>Browse All Patients</h1><br/>
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
                    {currentItems.map(patient => (
                        <tr key={patient.userId}>
                            <td>{patient.userId}</td>
                            <td>{patient.fullname}</td>
                            <td>{patient.gender}</td>
                            <td>{formatDateTime(patient.dob)}</td>
                            <td>{patient.username}</td>
                            <td>{patient.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table><br/>
            <div>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
            </div><br/>
            <button onClick={handleReturn}>Return to MPHome</button> 
        </div>
        

    );

};

export default BrowsePatient;



