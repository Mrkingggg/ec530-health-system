import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { regis_device } from "../services/userService";

function AddDevForm() {
    const [manufactor, setManufactor] = useState('');
    const [devType, setDevType] = useState('');
    const [status, setStatus] = useState(0); // status: int (0 / 1)
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navig = useNavigate();

    const returnBack = async(event) => {
        navig('/adminhome');
    }
    const handleAddDev = async(event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        try{
            const data = regis_device(manufactor, devType, status, unit);
            setMessage(data.message);
            navig('/adminhome');

        }catch(e){
            setError(e.message);
        }
    };

    return (
        <div>
            <h2>Add a Device:</h2>
            <form onSubmit={handleAddDev}>
                <label>
                    Manufactor: 
                    <input type="text" 
                           name="manufactor" 
                           value={manufactor} 
                           onChange={(e) => setManufactor(e.target.value)} />
                </label>
                <label>
                    DevType:
                    <input type="text"
                           name="devType"
                           value={devType}
                           onChange={(e) => setDevType(e.target.value)} />
                </label><br/>
                <label>
                    Unit:
                    <input type="text"
                            name="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)} />
                </label><br/><br/>
                <div>
                    Status:<br/><br/>
                    <label>
                        <input type="radio"
                               name="status"
                               value="0"
                               checked={status === 0}
                               onChange={(e) => setStatus(parseInt(e.target.value, 10))} />
                        Disable Device
                    </label>
                    <label>
                        <input type="radio"
                               name="status"
                               value="1"
                               checked={status === 1}
                               onChange={(e) => setStatus(parseInt(e.target.value, 10))}/>
                        Enable Device
                    </label><br/><br/>
                    <button type="submit">Add</button><br/>
                    <button onClick={returnBack}>Return to My Page</button>
                </div>
            </form>
            <br/><br/>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {message && <p style={{color: 'green'}}>{message}</p>}
        </div>
    );
}

export default AddDevForm;
