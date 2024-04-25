import React, { useState, useEffect } from 'react';
import  { useAuth } from '../components/AuthContext';
import "./ChatList.css"
const ChatList = () => {
    const [chatPairs, setChatPairs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const handleChatPairClick = (pair) => {
        
        console.log('Clicked pair:', pair);
        
    };

    useEffect(() => {
        const fetchChatPairs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/gen/view_chat_pairs/${user.userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setChatPairs(data);
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        };

        fetchChatPairs();
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div >
            <h1>Chat Pairs</h1>
            <ul>
                {chatPairs.map((pair, index) => (
                    <li className="chat-pair-item" key={index} onClick={() => handleChatPairClick(pair)}>
                        MP: {pair.MP_username} (ID: {pair.MPid}), Patient: {pair.patient_username} (ID: {pair.patient_id})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
