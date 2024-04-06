import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDevForm() {
    const [manufactor, setManufactor] = useState('');
    const [devType, setDevType] = useState('');
    const [status, setStatus] = useState(0); // 保持为整数类型
    const navig = useNavigate();

    const handleAddDev = (e) => {
        // 你的添加设备逻辑
    };

    return (
        <div>
            <h2>Add a Device:</h2>
            <form>
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
                </label>
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
                    </label>
                </div>
            </form>
        </div>
    );
}

export default AddDevForm;
