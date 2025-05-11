// src/ui/chatbox.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NavigateNext, ArrowBackIosNew } from '@mui/icons-material';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import './chatbox.css';

export default function MessengerChatBox({ user, onClose, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserId = parseInt(sessionStorage.getItem('userId'));

  // Hàm xử lý avatarUrl
  const getAvatarUrl = (url) => {
    if (!url) return 'http://localhost:8080/images/default-avatar.png';
    return url.startsWith('http') ? url : `http://localhost:8080/images/${url}`;
  };

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (!user?.chatRoomId) return;

    // Connect to WebSocket using the Client's built-in capabilities
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-chat',
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      
      // Subscribe to messages from this chat room
      client.subscribe(`/queue/chat.${user.chatRoomId}`, message => {
        const receivedMessage = JSON.parse(message.body);
        
        // Handle different message types
        if (receivedMessage.type === 'TYPING') {
          // Only show typing indicator if the other user is typing
          if (receivedMessage.senderId !== currentUserId) {
            setIsTyping(true);
            
            // Clear previous timeout if it exists
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            
            // Set a timeout to hide the typing indicator after 2 seconds
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 2000);
          }
        } else if (receivedMessage.type === 'CHAT') {
          setMessages(prev => {
            // Check if message already exists (to prevent duplicates)
            const exists = prev.some(m => m.id === receivedMessage.id);
            if (exists) return prev;
            
            return [...prev, {
              id: receivedMessage.id,
              sender: receivedMessage.senderId === currentUserId ? 'me' : 'other',
              text: receivedMessage.content,
              timestamp: new Date(receivedMessage.timestamp)
            }];
          });
          
          // Hide typing indicator when a message is received
          setIsTyping(false);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    setStompClient(client);

    // Cleanup on unmount
    return () => {
      if (client) {
        client.deactivate();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user?.chatRoomId, currentUserId]);

  // Fetch chat history when component mounts or chatRoomId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.chatRoomId) {
        console.error('No chatRoomId provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/chat/messages/${user.chatRoomId}/history`);
        
        // Transform the messages for display
        const formattedMessages = response.data.map(msg => ({
          id: msg.id,
          sender: msg.senderId === currentUserId ? 'me' : 'other',
          text: msg.content,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [user?.chatRoomId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input changes and send typing status
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Send typing status via WebSocket
    if (stompClient && stompClient.connected && user?.chatRoomId) {
      stompClient.publish({
        destination: `/app/chat.typing/${user.chatRoomId}`,
        body: JSON.stringify({
          chatRoomId: user.chatRoomId,
          senderId: currentUserId,
          receiverId: user.id,
          type: 'TYPING'
        })
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user?.chatRoomId || !stompClient || !stompClient.connected) return;
    
    const messageContent = input.trim();
    setInput('');
    
    // Send message via WebSocket
    stompClient.publish({
      destination: `/app/chat.sendMessage/${user.chatRoomId}`,
      body: JSON.stringify({
        chatRoomId: user.chatRoomId,
        senderId: currentUserId,
        receiverId: user.id,
        content: messageContent,
        timestamp: new Date(),
        type: 'CHAT'
      })
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Format timestamps for display
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle back to conversation list
  const handleBack = () => {
    if (onBack) {
      onBack(); // Use the provided onBack function if available
    } else {
      onClose(); // Fallback to onClose if onBack isn't provided
    }
  };

  return (
    <div className="fixed top-[60px] right-[20px] w-[340px] h-[600px] bg-white shadow-md rounded-lg flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-[#e9e9ff] p-3 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleBack}
            className="mr-2 text-gray-600 hover:text-black"
            title="Quay lại danh sách hội thoại"
          >
            <ArrowBackIosNew fontSize="small" />
          </button>
          <img
            src={getAvatarUrl(user?.Avatar)}
            alt={user?.Name || 'Người dùng'}
            className="w-8 h-8 rounded-full"
            onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
          />
          <div>
            <p className="text-sm font-semibold">{user?.Name || 'Người dùng'}</p>
            <p className="text-xs text-gray-500">
              {isTyping ? 'Đang nhập...' : 'Đang hoạt động'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-2xl font-bold"
          title="Đóng chat"
        >
          ×
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#f2f2f2]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Đang tải tin nhắn...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={msg.id || index}
              className="flex flex-col"
            >
              <div className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                  msg.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black'
                }`}>
                  {msg.text}
                </div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-3 py-2 rounded-xl text-sm">
              <span className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center border-t p-2 bg-white">
        {['😊', '📷'].map((icon, idx) => (
          <button
            key={idx}
            className="text-blue-500 text-xl hover:bg-blue-100 rounded-full p-1"
            title={icon}
          >
            {icon}
          </button>
        ))}
        <input
          type="text"
          placeholder="Aa"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="text-blue-500 font-semibold hover:bg-blue-100 rounded-full p-1"
          title="Gửi"
        >
          <NavigateNext />
        </button>
      </div>
    </div>
  );
}