import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ChatHistory() {
    const { mpId, patientId } = useParams(); 
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`/api/gen/view_chat_history?MPid=${mpId}&patientid=${patientId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setChatHistory(data);
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        };

        fetchChatHistory();
    }, [mpId, patientId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Chat History for MP ID: {mpId} and Patient ID: {patientId}</h2>
            <ul>
                {chatHistory.map((msg, index) => (
                    <li key={index}>
                        {msg.content} {/* Assuming 'content' is part of the formatted message */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatHistory;
