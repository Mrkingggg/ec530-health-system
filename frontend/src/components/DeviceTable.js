import React, { useEffect, useState } from 'react';
import "../components/comp.css"
const DeviceTable = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetch('/api/admin/viewDevice')
            .then(response => response.json())
            .then(data => setDevices(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <table className="table-center"> 
            <thead>
                <tr>
                    <th>Device ID</th>
                    <th>Manufacturer</th>
                    <th>Type</th>
                    <th>Unit</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(device => (
                    <tr key={device.deviceId}>
                        <td>{device.deviceId}</td>
                        <td>{device.manufactor}</td>
                        <td>{device.devType}</td>
                        <td>{device.unit}</td>
                        <td>{device.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
    );
};

export default DeviceTable;
