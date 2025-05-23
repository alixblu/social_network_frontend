import "./header.css";
import {
  Search,
  Facebook,
  Home,
  OndemandVideo,
  Storefront,
  Groups3,
  SportsEsports,
  Apps,
  ChatBubble,
  Notifications,
  Person,
  Settings,
  QuestionMark,
  Nightlight,
  Report,
  MeetingRoom,
  ArrowForwardIos,
  ArrowBackOutlined,
  MoreHoriz,
  Fullscreen,
  Create,
  AdminPanelSettings,
  ArrowBackIosNew,
  Info,
  NavigateNext,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MessengerChatBox from "../ui/chatbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NotificationPopup from "./NotificationPopup";

function Header() {
  const [isAdmin, setAdmin] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const BackToHome = () => navigate("/home");
  const GoToProfile = () => navigate("/profile");
  const BackToLogin = () => {
    navigate("/login", { replace: true });
    window.location.reload();
    sessionStorage.removeItem("token");
  };

  const [activePopup, setActivePopup] = useState(null);
  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const popupRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      const isOutsidePopup =
        popupRef.current && !popupRef.current.contains(event.target);
      const isOutsideTopBar = !event.target.closest(".right-top-bar");
      if (isOutsidePopup && isOutsideTopBar) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  const menuItems = [
    { icon: <Settings />, text: "Cài đặt và quyền riêng tư" },
    { icon: <QuestionMark />, text: "Trợ giúp và hỗ trợ" },
    { icon: <Nightlight />, text: "Màn hình & trợ năng" },
    { icon: <Report />, text: "Đóng góp ý kiến" },
    ...(isAdmin
      ? [{ icon: <AdminPanelSettings />, text: "Admin", link: "/Admin" }]
      : []),
    { icon: <MeetingRoom />, text: "Đăng xuất", link: "/login" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setActivePopup(null);
  };

  const renderMiddleIcons = () =>
    [
      { icon: <Home />, title: "Trang chủ", path: "/home" },
      { icon: <OndemandVideo />, title: "Video", path: "/video" },
      { icon: <Storefront />, title: "MarketPlace", path: "/marketplace" },
      { icon: <Groups3 />, title: "Mọi người", path: "/people" },
      { icon: <SportsEsports />, title: "Game", path: "/game" },
    ].map(({ icon, title, path }, idx) => (
      <li className={idx === 0 ? "border-b-[4px] border-blue-500" : ""} key={idx}>
        <span onClick={() => handleNavigate(path)}>
          <div></div>
          <a title={title} aria-label={title} href="#" onClick={(e) => e.preventDefault()}>
            {icon}
          </a>
        </span>
      </li>
    ));

  const [selectedUser, setSelectedUser] = useState(null);
  const [messList, setMessList] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId || !token) return;
        setIsLoadingConversations(true);
        const response = await axios.get(`http://localhost:8080/chat/messages/conversations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Conversations response:', response.data);
        
        const transformedData = response.data.map(conversation => {
          if (!conversation.partner || !conversation.message) {
            console.warn('Invalid conversation data:', conversation);
            return null;
          }
          return {
          id: conversation.partner.id,
            Avatar: conversation.partner.avatarUrl || "default-avatar.png",
          Name: conversation.partner.username,
          Content: conversation.message.content,
          chatRoomId: conversation.message.chatRoomId
          };
        }).filter(Boolean); // Remove any null entries
        
        setMessList(transformedData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setMessList([]);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    fetchConversations();
  }, [activePopup, token]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeMessTab, setActiveMessTab] = useState("inbox");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [selectedAiBot, setSelectedAiBot] = useState(null);
  const [aiBots, setAiBots] = useState([]);
  const [activeAiProvider, setActiveAiProvider] = useState('rasa');
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([]);

  const filteredMessList = messList.filter((mess) =>
    mess.Name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      toast.success("Đăng xuất thành công!", { autoClose: 2000 });
      setTimeout(() => {
        BackToLogin();
      }, 2000);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      BackToLogin();
      return;
    }
    axios.get("http://localhost:8080/users/getUserByToken", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data) {
      setUser(response.data);
        setAdmin(response.data.isAdmin || false);
      } else {
        console.error("No user data received");
        BackToLogin();
      }
    })
    .catch(error => {
      console.error("Lỗi lấy thông tin user trong Header:", error);
      BackToLogin();
    });
  }, []);

  useEffect(() => {
    const fetchAiBots = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ai/bots');
        setAiBots(response.data);
      } catch (error) {
        console.error('Error fetching AI bots:', error);
        setAiBots([
          { id: 'rasa-bot', name: 'Rasa with Phi', avatarUrl: './src/assets/2.jpg', description: 'Trợ lý với Phi Model' },
        ]);
      }
    };
    if (activePopup === 'mess' && activeMessTab === 'ai') {
      fetchAiBots();
    }
  }, [activePopup, activeMessTab]);

  const sendMessageToAiBot = async () => {
    if (!aiChatInput.trim() || !selectedAiBot) return;
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;
    const newUserMsg = {
      content: aiChatInput,
      timestamp: new Date(),
      role: "user"
    };
    setAiChatHistory(prev => [...prev, newUserMsg]);
    setAiChatInput('');
    setIsAiTyping(true);
    try {
      const endpoint = 'http://localhost:8080/ai/rasa/chat';
      const response = await axios.post(endpoint, {
        userId: parseInt(userId),
        botId: selectedAiBot.id,
        message: aiChatInput.trim()
      });
      const aiResponse = {
        content: response.data.content,
        timestamp: new Date(),
        role: "ai"
      };
      setAiChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        content: 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.',
        timestamp: new Date(),
        role: "ai",
        isError: true
      };
      setAiChatHistory(prev => [...prev, errorResponse]);
    }
    setIsAiTyping(false);
  };

  return (
    <div className="header">
      <div className="left-top-bar">
        <div onClick={BackToHome} className="left-fb-icon">
          <Facebook className="fb_icon" />
        </div>
        <div onClick={() => togglePopup("search")} className="search-bar">
          <label>
            <Search className="search_icon" />
          </label>
          <input placeholder="Tìm kiếm trên Facebook" type="text" />
        </div>
      </div>

      <div className="middle-top-bar">
        <ul className="list_icon_middle">{renderMiddleIcons()}</ul>
      </div>

      <div className="right-top-bar">
        <div onClick={() => togglePopup("menu")} title="Menu">
          <Apps />
        </div>
        <div onClick={() => togglePopup("mess")} title="Messenger">
          <ChatBubble />
        </div>
        <div onClick={() => togglePopup("noti")} title="Thông báo">
          <Notifications />
        </div>
        <img
          onClick={() => togglePopup("acc")}
          title="Tài khoản"
          src={user?.avatarUrl ? `http://localhost:8080/images/${user.avatarUrl}` : 'http://localhost:8080/images/default-avatar.png'}
          alt="Avatar"
          onError={(e) => {
            e.target.src = 'http://localhost:8080/images/default-avatar.png';
          }}
        />
      </div>

      <div ref={popupRef}>
        {activePopup === "search" && (
          <div className="search-popup">
            <div className="search-content">
              <label onClick={() => setActivePopup(null)}>
                <ArrowBackOutlined />
              </label>
              <input className="w-[250px] bg-gray-200 rounded-3xl pl-5 outline-none"
                placeholder="Tìm kiếm trên Facebook"
              />
            </div>
            <div className="center">
              <label>Không có tìm kiếm nào gần đây</label>
            </div>
          </div>
        )}

        {activePopup === "menu" && (
          <div className="menu-popup">
            <div className="menu-content">
              <h3>Menu</h3>
              <p>Nội dung menu ở đây</p>
              <button onClick={() => setActivePopup(null)}>Đóng</button>
            </div>
          </div>
        )}

        {activePopup === "mess" && (
          <div className="mess-popup">
            <div className="mess-content space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-2xl font-bold">Đoạn chat</label>
                <div className="space-x-3">
                  <MoreHoriz />
                  <Fullscreen />
                  <Create />
                </div>
              </div>
              <div className="flex items-center group">
                <label className="rounded-l-full px-2 h-[35px] flex items-center bg-[#f0f2f5]">
                  <Search />
                </label>
                <input
                  className="w-[300px] h-[35px] outline-none bg-[#f0f2f5] rounded-r-full"
                  placeholder="Tìm kiếm trên messenger"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <input
                  type="button"
                  value="Hộp thư"
                  className={`rounded-full px-3 py-1 ${activeMessTab === 'inbox' 
                    ? 'bg-[#e7f3ff] text-blue-500 font-semibold' 
                    : 'hover:bg-[#ecedef]'}`}
                  onClick={() => setActiveMessTab('inbox')}
                />
                <input
                  type="button"
                  value="Cộng đồng"
                  className={`rounded-full px-3 py-1 ${activeMessTab === 'community' 
                    ? 'bg-[#e7f3ff] text-blue-500 font-semibold' 
                    : 'hover:bg-[#ecedef]'}`}
                  onClick={() => setActiveMessTab('community')}
                />
                <input
                  type="button"
                  value="AI Chat"
                  className={`rounded-full px-3 py-1 ${activeMessTab === 'ai' 
                    ? 'bg-[#e7f3ff] text-blue-500 font-semibold' 
                    : 'hover:bg-[#ecedef]'}`}
                  onClick={() => setActiveMessTab('ai')}
                />
              </div>
              {activeMessTab === 'inbox' ? (
                <div className="h-[450px] overflow-y-auto scrollbar-thin">
                  {isLoadingConversations ? (
                    <div className="flex justify-center items-center h-full">
                      <p>Đang tải...</p>
                    </div>
                  ) : filteredMessList.length > 0 ? (
                    filteredMessList.map((mess, idx) => (
                      <div
                        onClick={() => {
                          setSelectedUser({...mess, chatRoomId: mess.chatRoomId});
                          setActivePopup(null);
                        }}
                        key={idx}
                        className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-[#ecedef] group"
                      >
                        <img
                          className="w-[55px] h-[55px] rounded-full shrink-0"
                          src={mess.Avatar.startsWith('http') ? mess.Avatar : `http://localhost:8080/images/${mess.Avatar}`}
                          alt={mess.Name}
                          onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                        />
                        <div className="flex flex-col justify-start w-0 flex-1">
                          <label className="font-semibold text-sm text-left">{mess.Name}</label>
                          <label className="text-gray-500 text-xs text-left">{mess.Content}</label>
                        </div>
                        <label className="absolute right-4 p-1 bg-white rounded-full hidden group-hover:flex">
                          <MoreHoriz />
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>Không có cuộc trò chuyện nào</p>
                    </div>
                  )}
                </div>
              ) : activeMessTab === 'community' ? (
                <div className="h-[450px] overflow-y-auto scrollbar-thin">
                  <div className="p-3">
                    <div 
                      className="flex items-center gap-3 p-3 mb-4 rounded-lg hover:bg-[#ecedef] cursor-pointer border border-dashed border-gray-300"
                      onClick={() => setShowCreateGroupModal(true)}
                    >
                      <div className="w-[55px] h-[55px] rounded-full bg-[#e7f3ff] flex items-center justify-center">
                        <div className="text-blue-500 font-bold text-3xl">+</div>
                      </div>
                      <div className="flex flex-col justify-start flex-1">
                        <label className="font-semibold text-sm text-left">Tạo nhóm chat mới</label>
                        <label className="text-gray-500 text-xs text-left">Tạo nhóm chat với bạn bè</label>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Nhóm chat của bạn</h3>
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-[#ecedef] group cursor-pointer"
                          onClick={() => {
                            setSelectedGroupChat({
                              id: idx,
                              name: `Nhóm chat ${idx}`,
                              avatar: './src/assets/group.png',
                              members: [1, 2, 3, 4].map(id => ({
                                id,
                                name: `User ${id}`,
                                avatar: `./src/assets/${id}.jpg`
                              }))
                            });
                            setActivePopup(null);
                          }}
                        >
                          <div className="w-[55px] h-[55px] rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <img 
                              src="./src/assets/group.png" 
                              alt="Group chat"
                              className="w-[40px] h-[40px] rounded-full"
                              onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                            />
                          </div>
                          <div className="flex flex-col justify-start w-0 flex-1">
                            <label className="font-semibold text-sm text-left">Nhóm chat {idx}</label>
                            <label className="text-gray-500 text-xs text-left">
                              {idx % 2 === 0 ? "Bạn: " : "User1: "}
                              {idx === 1 ? "Xin chào mọi người!" : idx === 2 ? "Hôm nay ai đi cafe không?" : "Dự án mới nhé các bạn"}
                            </label>
                          </div>
                          <label className="absolute right-4 p-1 bg-white rounded-full hidden group-hover:flex">
                            <MoreHoriz />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[450px] overflow-y-auto scrollbar-thin">
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Chọn AI để trò chuyện</h3>
                    <div className="flex justify-center mb-4">
                      <div 
                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-[#ecedef] cursor-pointer w-full"
                        onClick={() => {
                          setSelectedAiBot({
                            id: 'rasa-bot',
                            name: 'Rasa (Phi via Ollama)',
                            avatar: './src/assets/2.jpg',
                            provider: 'rasa',
                            model: 'phi'
                          });
                          setAiChatHistory([{
                            content: "Hello! I'm your AI assistant powered by Rasa and Phi Model. How can I assist you today?",
                            timestamp: new Date(),
                            role: "ai"
                          }]);
                          setActivePopup(null);
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <img 
                            src='./src/assets/2.jpg' 
                            alt='Rasa'
                            className="w-10 h-10"
                            onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                          />
                        </div>
                        <h4 className="text-sm font-semibold">Rasa + Ollama</h4>
                        <p className="text-xs text-gray-500 text-center mt-1">Trợ lý với Phi Model</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activePopup === "noti" && (
          <NotificationPopup onClose={() => setActivePopup(null)} />
        )}

        {activePopup === "acc" && (
          <div className="acc-popup">
            <div className="acc-content">
              <div onClick={GoToProfile} className="acc1">
                <img src={`http://localhost:8080/images/${user.avatarUrl}`} alt="Avatar" />
                <label className="text-black font-semibold text-[17px]">
                  {user?.username || "Người dùng"}
                </label>
              </div>
              <div className="acc2"></div>
              <div className="acc3">
                <Person />
                <label className="font-semibold text-[14px]">
                  Xem trang cá nhân
                </label>
              </div>
            </div>
            <div>
              {menuItems.map((item, idx) => (
                <div key={idx} className="acc-contend-1"
                  onClick={() => {
                    if (item.text === "Đăng xuất") {
                      handleLogout();
                    } else if (item.link) {
                      navigate(item.link);
                    }
                  }}
                >
                  <div>
                    <label className="acc_lbl">{item.icon}</label>
                    <label className="font-semibold">{item.text}</label>
                  </div>
                  {idx < 3 && (
                    <label>
                      <ArrowForwardIos />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="acc-footer">
              {[
                "Quyền riêng tư",
                "Điều khoản",
                "Quảng cáo",
                "Lựa chọn quảng cáo",
                "Cookie",
                "Xem thêm",
              ].map((text, idx) => (
                <label key={idx}>
                  <a href="">{text} </a>·{" "}
                </label>
              ))}
              <label>Meta 2025</label>
            </div>
          </div>
        )}
      </div>
      {selectedUser && (
        <MessengerChatBox
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBack={() => {
            setSelectedUser(null);
            togglePopup("mess");
          }}
        />
      )}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Tạo nhóm chat mới</h3>
              <button 
                onClick={() => setShowCreateGroupModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="mb-4">
                <label className="block mb-2 font-medium">Tên nhóm</label>
                <input 
                  type="text"
                  placeholder="Nhập tên nhóm"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Thêm thành viên</label>
                <div className="flex items-center mb-2">
                  <input 
                    type="text"
                    placeholder="Tìm kiếm bạn bè"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Bạn bè</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ecedef]">
                        <div className="flex items-center gap-2">
                          <img 
                            src={`./src/assets/${idx}.jpg`}
                            alt={`User ${idx}`}
                            className="w-[40px] h-[40px] rounded-full"
                            onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                          />
                          <span className="font-medium">User {idx}</span>
                        </div>
                        <input 
                          type="checkbox"
                          className="w-5 h-5 accent-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="p-1 bg-gray-100 rounded-lg">
                  <img 
                    src="./src/assets/1.jpg"
                    alt="Selected user"
                    className="w-[30px] h-[30px] rounded-full"
                  />
                </div>
                <div className="p-1 bg-gray-100 rounded-lg">
                  <img 
                    src="./src/assets/2.jpg"
                    alt="Selected user"
                    className="w-[30px] h-[30px] rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-500">+2 người khác</span>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={() => setShowCreateGroupModal(false)}
                className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Group Chat View */}
      {selectedGroupChat && (
        <div className="fixed top-[60px] right-[20px] w-[340px] h-[600px] bg-white shadow-md rounded-lg flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-[#e9e9ff] p-3 flex justify-between items-center border-b">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setSelectedGroupChat(null);
                  togglePopup("mess");
                }}
                className="mr-2 text-gray-600 hover:text-black"
                title="Quay lại danh sách hội thoại"
              >
                <ArrowBackIosNew fontSize="small" />
              </button>
              <img
                src={selectedGroupChat.avatar}
                alt={selectedGroupChat.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => (e.target.src = './src/assets/4.jpg')}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{selectedGroupChat.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {selectedGroupChat.members.length} thành viên
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                title="Thông tin nhóm"
                className="text-gray-600 hover:text-black"
                onClick={() => setShowGroupInfoModal(true)}
              >
                <Info fontSize="small" />
              </button>
              <button
                onClick={() => setSelectedGroupChat(null)}
                className="text-gray-500 hover:text-black text-2xl font-bold"
                title="Đóng chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#f2f2f2]">
            {aiChatHistory.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-center gap-1 mb-1`}>
                  {msg.role === "ai" && (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <img
                        src={selectedAiBot.avatar}
                        alt={selectedAiBot.name}
                        className="w-4 h-4"
                        onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                      />
                    </div>
                  )}
                  <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                    msg.role === "user" ? "bg-blue-500 text-white" : (msg.isError ? "bg-red-100 text-red-800" : "bg-white text-black")
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center border-t p-2 bg-white">
            <button
              className="text-blue-500 text-xl hover:bg-blue-100 rounded-full p-1"
              title="Biểu tượng cảm xúc"
            >
              😊
            </button>
            <button
              className="text-blue-500 text-xl hover:bg-blue-100 rounded-full p-1 mr-1"
              title="Đính kèm"
            >
              📷
            </button>
            <input
              type="text"
              placeholder="Aa"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <button
              className="text-blue-500 font-semibold hover:bg-blue-100 rounded-full p-1 ml-1"
              title="Gửi"
            >
              <NavigateNext />
            </button>
          </div>
        </div>
      )}
      
      {/* Group Info Modal */}
      {showGroupInfoModal && selectedGroupChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Thông tin nhóm</h3>
              <button 
                onClick={() => setShowGroupInfoModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Group info */}
              <div className="flex items-center justify-center flex-col mb-6">
                <div className="w-[80px] h-[80px] bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <img 
                    src={selectedGroupChat.avatar}
                    alt={selectedGroupChat.name}
                    className="w-[60px] h-[60px] rounded-full"
                    onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                  />
                </div>
                <h3 className="text-lg font-bold">{selectedGroupChat.name}</h3>
                <p className="text-sm text-gray-500">{selectedGroupChat.members.length} thành viên</p>
                <div className="mt-4 flex space-x-4">
                  <button className="flex flex-col items-center text-gray-600">
                    <div className="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <Report fontSize="small" />
                    </div>
                    <span className="text-xs">Báo cáo</span>
                  </button>
                  <button className="flex flex-col items-center text-gray-600">
                    <div className="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <Notifications fontSize="small" />
                    </div>
                    <span className="text-xs">Tắt thông báo</span>
                  </button>
                  <button className="flex flex-col items-center text-gray-600">
                    <div className="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <Search fontSize="small" />
                    </div>
                    <span className="text-xs">Tìm kiếm</span>
                  </button>
                </div>
              </div>
              
              {/* Group description */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Mô tả nhóm</h4>
                <p className="text-sm text-gray-600">
                  Đây là nhóm chat để thảo luận về dự án Spring Boot. 
                  Mọi người hãy tích cực đóng góp ý kiến để dự án hoàn thành sớm nhé!
                </p>
              </div>
              
              {/* Group members */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Thành viên nhóm</h4>
                  <button className="text-blue-500 text-sm">+ Thêm thành viên</button>
                </div>
                <div className="space-y-3">
                  {/* Admin */}
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img 
                        src="./src/assets/1.jpg"
                        alt="Group admin"
                        className="w-[40px] h-[40px] rounded-full"
                        onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                      />
                      <div>
                        <span className="font-medium text-sm">User 1</span>
                        <span className="text-xs text-blue-500 ml-2">Quản trị viên</span>
                      </div>
                    </div>
                  </div>
                  {selectedGroupChat.members.slice(1).map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar}
                          alt={member.name}
                          className="w-[40px] h-[40px] rounded-full"
                          onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                        />
                        <span className="font-medium text-sm">{member.name}</span>
                      </div>
                      <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
                        <MoreHoriz fontSize="small" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="text-red-500 font-medium py-2 px-4 rounded-lg hover:bg-red-50">
                  Rời khỏi nhóm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Chat View */}
      {selectedAiBot && (
        <div className="fixed top-[60px] right-[20px] w-[340px] h-[600px] bg-white shadow-md rounded-lg flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-[#e9e9ff] p-3 flex justify-between items-center border-b">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setSelectedAiBot(null);
                  togglePopup("mess");
                }}
                className="mr-2 text-gray-600 hover:text-black"
                title="Quay lại danh sách hội thoại"
              >
                <ArrowBackIosNew fontSize="small" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src={selectedAiBot.avatar}
                  alt={selectedAiBot.name}
                  className="w-6 h-6"
                  onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{selectedAiBot.name}</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Rasa
                  </span>
                  {selectedAiBot.model && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Model: {selectedAiBot.model}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedAiBot(null)}
              className="text-gray-500 hover:text-black text-2xl font-bold"
              title="Đóng chat"
            >
              ×/×</button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#f2f2f2]">
            {aiChatHistory.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-center gap-1 mb-1`}>
                  {msg.role === "ai" && (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <img
                        src={selectedAiBot.avatar}
                        alt={selectedAiBot.name}
                        className="w-4 h-4"
                        onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                      />
                    </div>
                  )}
                  <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                    msg.role === "user" ? "bg-blue-500 text-white" : (msg.isError ? "bg-red-100 text-red-800" : "bg-white text-black")
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center border-t p-2 bg-white">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessageToAiBot();
                }
              }}
            />
            <button
              className="text-blue-500 font-semibold hover:bg-blue-100 rounded-full p-2 ml-1"
              title="Gửi"
              onClick={sendMessageToAiBot}
            >
              <NavigateNext />
            </button>
          </div>
          
          {/* Feature pills based on bot type */}
          <div className="bg-white p-2 border-t flex gap-2 overflow-x-auto scrollbar-thin">
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Trợ lý thông minh
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Phi Model
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Chạy cục bộ
            </span>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Header;