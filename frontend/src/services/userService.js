export const addUser = async (userData) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('problem:', error);
        throw error;
    }
};

export const changeRole = async (userId, newRoles) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/users/changeRole', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newRoles }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('problem:', error);
        throw error;
    }
};

export const loginUser = async(username, password, role) =>{
    try{
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        
        if(!response.ok){
            throw new Error(data.error || data.bad_request || 'Login failed');
        }
        return data;
    }catch(error){
        throw error;
    }
};

export const logout = async() =>{
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return true; // 登出成功
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const regis_device = async(manufactor, devType, status, unit) =>{

    try{
        const response = await fetch('/api/admin/RegisDevice', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({manufactor, devType, status, unit})
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error || data.bad_request || 'Register failed');
        }
        return data;
    }catch(error){
        throw error;
    }
};

export const change_dev_status = async(devId, new_status) =>{

    try{
        const response = await fetch('/api/admin/viewDevice', {
            method:'PUT',
            headers:{
                'Contect-Type': 'application/json',
            },
            body: JSON.stringify({devId, new_status})
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error || data.bad_request || 'Device Status change failed');
        }
        return data;

    }catch(error){
        throw error;
    }

};

export const browse_patient = async() => {
    try{
        const response = await fetch('/api/MP/browsePatient', {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
            },
           
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error || data.bad_request || 'Device Status change failed');
        }
        return data;
    }catch(error){
        throw error
    }
}

export const add_patient_data = async(userId, deviceId, value, measuretime, measuretype) => {
    try{
        const response = await fetch('/api/MP/addMeasureData', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId, deviceId, value, measuretime, measuretype})
        });
        const data = response.json()

        if(!response.ok){
            throw new Error(data.error || data.bad_request || 'Add patient data failed');
        }
        return data;

    }catch(error){
        throw error;
    }
}