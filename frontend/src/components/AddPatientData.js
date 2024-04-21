import React, { useState } from 'react';
import { add_patient_data } from '../services/userService';

function AddPatientData() {
    // 定义state来存储表单数据
    const [userId, setUserId] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [value, setValue] = useState('');
    const [measureTime, setMeasureTime] = useState('');

    // 处理输入字段变化的函数
    const handleUserIdChange = (e) => setUserId(e.target.value);
    const handleDeviceIdChange = (e) => setDeviceId(e.target.value);
    const handleValueChange = (e) => setValue(e.target.value);
    const handleMeasureTimeChange = (e) => setMeasureTime(e.target.value);

    // 处理表单提交的函数
    const handleSubmit = async (e) => {
        e.preventDefault(); // 阻止表单的默认提交行为
        try {
            // 调用add_patient_data函数提交数据
            const data = await add_patient_data(userId, deviceId, value, measureTime);
            console.log('Data submitted successfully:', data);
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Failed to submit data:', error);
            alert('Failed to submit data: ' + error.message);
        }
    };

    // 渲染表单
    return (
        <div>
            <h2>Add patient data</h2>
            <form onSubmit={handleSubmit}>
            <label>
                Patient ID:
                <input type="text" value={userId} onChange={handleUserIdChange} required />
            </label>
            <br />
            <label>
                Device ID:
                <input type="text" value={deviceId} onChange={handleDeviceIdChange} required />
            </label>
            <br />
            <label>
                Value:
                <input type="text" value={value} onChange={handleValueChange} required />
            </label>
            <br />
            <label>
                Measure Time:
                <input type="datetime-local" value={measureTime} onChange={handleMeasureTimeChange} required />
            </label>
            <br />
            <button type="submit">Submit Data</button>
            </form>
        </div>
        
    );
}

export default AddPatientData;
