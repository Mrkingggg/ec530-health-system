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

