import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { username } = useParams();
    const currentUser = localStorage.getItem('username');
    const socketRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const roomName = [currentUser, username].sort().join('_');
            console.log(`Attempting to connect to ws://localhost:8000/ws/chat/${roomName}/`);
            socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    
            socketRef.current.onopen = () => {
                console.log('WebSocket Connected');
            };
    
            socketRef.current.onmessage = (e) => {
                console.log('Received message:', e.data);
                const data = JSON.parse(e.data);
                // Only add the message if it's from the other user
                if (data.sender !== currentUser) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            };
    
            socketRef.current.onclose = (event) => {
                console.log('WebSocket Disconnected', event.code, event.reason);
                // Attempt to reconnect after a delay
                setTimeout(connectWebSocket, 3000);
            };
    
            socketRef.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
        };
    
        connectWebSocket();
    
        return () => {
            if (socketRef.current) {
                console.log('Closing WebSocket connection');
                socketRef.current.close();
            }
        };
    }, [username, currentUser]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
    
        const messageData = {
            message: newMessage,
            sender: currentUser,
            receiver: username
        };
    
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(messageData));
            // Immediately add the sent message to the state
            setMessages(prevMessages => [...prevMessages, messageData]);
            setNewMessage('');
        } else {
            console.error('WebSocket is not connected. Unable to send message.');
        }
    };

    return (
        <div className="chat-interface">
            <h2>Chat with {username}</h2>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender === currentUser ? 'sent' : 'received'}`}>
                        <p>{message.message}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatInterface;