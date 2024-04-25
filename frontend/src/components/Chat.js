import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // 根据你的服务器地址进行修改

function Chat({ MPid, patientid }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 获取历史消息
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/gen/view_chat_history?MPid=${MPid}&patientid=${patientid}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message_response', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('message_response');
    };
  }, [MPid, patientid]);

  return (
    <div>
      <h1>Chat History</h1>
      {messages.map((msg, index) => (
        <p key={index}>{`${msg.from}: ${msg.message} (${msg.sendtime})`}</p>
      ))}
    </div>
  );
}

export default Chat;
