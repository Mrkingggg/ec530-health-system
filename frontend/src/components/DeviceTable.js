import React, { useEffect, useState } from 'react';
import "./comp.css"
const DevicesTable = () => {
    const [devices, setDevices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetch('/api/admin/viewDevice')
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = devices.slice(firstItemIndex, lastItemIndex);

    const totalPages = Math.ceil(devices.length / itemsPerPage);

    const changeStatus = (device) => {
        const newStatus = device.status === 0 ? 1 : 0;
        fetch(`/api/admin/${device.deviceId}/chgstatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status:newStatus}),
        })
        .then(response => response.json())
        .then(() => {
            
            fetch('/api/admin/viewDevice')
                .then(response => response.json())
                .then(data => setDevices(data))
                .catch(error => console.error('Error fetching data:', error));
        })
        .catch(error => console.error('Error updating status:', error));
    };

    const deleteDevice = (deviceId) => {
       
        fetch(`/api/admin/deldev/${deviceId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            
            setDevices(devices.filter(device => device.deviceId !== deviceId));
        })
        .catch(error => console.error('Error deleting device:', error));
    };

    return (
        <div>
            <table className='table-center'>
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Manufacturer</th>
                        <th>Type</th>
                        <th>Unit</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(device => (
                        <tr key={device.deviceId}>
                            <td>{device.deviceId}</td>
                            <td>{device.manufactor}</td>
                            <td>{device.devType}</td>
                            <td>{device.unit}</td>
                            <td>{device.status}</td>
                            <td>
                            <button onClick={() => changeStatus(device)}>Change Status</button>
                                <button onClick={() => deleteDevice(device.deviceId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
            </div>
        </div>
    );
};

export default DevicesTable;
