import { ArrowRight, ArrowRightAltOutlined, NavigateNext } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";

export default function MessengerChatBox({ user, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "me", text: "sao định đi thực tập à" },
    { sender: "other", text: "Tại bạn tui đi" },
    { sender: "other", text: "Bị áp lực" },
    { sender: "me", text: "sao định đi thực tập à" },
    { sender: "other", text: "Tại bạn tui đi" },
    { sender: "other", text: "Bị áp lực" },
    { sender: "me", text: "sao định đi thực tập à" },
    { sender: "other", text: "Tại bạn tui đi" },
    { sender: "other", text: "Bị áp lực" },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "me", text: input }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-4 right-10 w-[350px] h-[500px] bg-white border rounded-lg flex flex-col shadow-md overflow-hidden z-40">
      {/* Header */}
      <div className="bg-[#e9e9ff] p-3 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <img
            src={`./src/assets/${user.Avatar}`}
            alt={user.Name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{user.Name}</p>
            <p className="text-xs text-gray-500">Hoạt động 5 phút trước</p>
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-fit px-3 py-2 rounded-xl text-sm break-words ${
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white text-black self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center border-t p-2 bg-white">
        {["😊", "📷", "GIF"].map((icon, idx) => (
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSend}
          className="text-blue-500 font-semibold hover:bg-blue-100 rounded-full p-1"
          title="Gửi"
        >
          {/* <NavigateNext/> */}
          Send
        </button>
      </div>
    </div>
  );
}
