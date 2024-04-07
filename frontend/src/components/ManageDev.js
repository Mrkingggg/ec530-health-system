import React from "react";
import { useNavigate } from "react-router-dom";
import DeviceTable from "./DeviceTable";

function ManageDev(){
    const navig = useNavigate();

    const handleReturn = async(event) =>{
        navig("/adminhome");
    }


    return(

        <div>
            <h2>View & Manage Devices</h2>
            <div>
            <h1>Device List</h1>
            <DeviceTable />
        </div><br/>
            <button onClick={handleReturn}>Return</button>
        </div>

    )


}



export default ManageDev;
