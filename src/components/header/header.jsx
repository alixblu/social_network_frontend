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
import axios from "axios"



function Header() {



  const [isAdmin, setAdmin] = useState(false);

  const [user, setUser] = useState("");

  //Xử lí các Navigate chuyển hướng
  const navigate = useNavigate();
  const BackToHome = () => navigate("/home");
  const GoToProfile = () => navigate("/profile");
  const BackToLogin = () => {
    navigate("/login", { replace: true });
    window.location.reload();
    sessionStorage.removeItem("token");
  };






  // Xử lí phần xuất hiện của Popup
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




  // Popup của Menu
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


  // Thêm các đường link và hàm navigate cho middle icons
  const handleNavigate = (path) => {
    navigate(path);
    // Đóng tất cả popup nếu có
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


  
  //Xử lí phần PopUp của Mess
  const [messList, setMessList] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  useEffect(() => {
    // Fetch conversations when the component mounts
    const fetchConversations = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return;
        
        setIsLoadingConversations(true);
        const response = await axios.get(`http://localhost:8080/chat/messages/conversations/${userId}`);
        
        // Transform the data to match the expected format
        const transformedData = response.data.map(conversation => ({
          id: conversation.partner.id,
          Avatar: conversation.partner.avatarUrl || "4.jpg", // Default image if no avatar
          Name: conversation.partner.username,
          Content: conversation.message.content,
          chatRoomId: conversation.message.chatRoomId
        }));
        
        setMessList(transformedData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // Set fallback data in case of error
        setMessList([
          { Avatar: "4.jpg", Name: "Error loading", Content: "Please try again later" }
        ]);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [activePopup]); // Reload when popup is toggled

  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeMessTab, setActiveMessTab] = useState("inbox"); // Add state for active tab
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // Add state for modal
  const [selectedGroupChat, setSelectedGroupChat] = useState(null); // Add state for selected group chat
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false); // Add state for group info modal
  const [selectedAiBot, setSelectedAiBot] = useState(null); // Add state for selected AI bot
  const [aiBots, setAiBots] = useState([]); // State for AI bots fetched from backend
  const [activeAiProvider, setActiveAiProvider] = useState('openai'); // State for active AI provider (openai or rasa)
  const [aiUserMessages, setAiUserMessages] = useState([]); // User messages for AI chat
  const [aiResponses, setAiResponses] = useState([]); // AI responses
  const [aiChatInput, setAiChatInput] = useState(''); // Input for AI chat
  const [isAiTyping, setIsAiTyping] = useState(false); // AI typing indicator
  
  const filteredMessList = messList.filter((mess) =>
    mess.Name.toLowerCase().includes(searchKeyword.toLowerCase())
  );
 
  //Xử lí phần đăng xuất
  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      toast.success("Đăng xuất thành công!", { autoClose: 2000 });
      setTimeout(() => {
        BackToLogin()
      }, 2000); // đợi toast hiện rồi mới chuyển trang
    }
  };
  
  //Data từ sessionStorage
useEffect(() => {
    const token = sessionStorage.getItem("token"); // ✅ đúng

    if (!token) {
      BackToLogin();
      return;
    }
    console.log('Token in Header:', token);
    axios.get("http://localhost:8080/users/getUserByToken", {
      headers: {
        Authorization: `Bearer ${token}` // Sử dụng token trực tiếp
      }
    })
    .then(response => {
      setUser(response.data);
      setAdmin(response.data.isAdmin);
      console.log('User data in Header:', response.data);
    })
    .catch(error => {
      console.error("Lỗi lấy thông tin user trong Header:", error);
      BackToLogin(); // Chuyển về login nếu lỗi
    });
  }, []);

  // Fetch AI bots from backend
  useEffect(() => {
    const fetchAiBots = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ai/bots');
        setAiBots(response.data);
      } catch (error) {
        console.error('Error fetching AI bots:', error);
        // Fallback bots if API fails
        setAiBots([
          { id: 'spring-bot', name: 'Spring Bot', avatarUrl: './src/assets/1.png', description: 'Trợ giúp về Spring Boot' },
          { id: 'java-bot', name: 'Java Helper', avatarUrl: './src/assets/2.jpg', description: 'Giải đáp vấn đề Java' },
        ]);
      }
    };
    
    if (activePopup === 'mess' && activeMessTab === 'ai') {
      fetchAiBots();
    }
  }, [activePopup, activeMessTab]);
  
  // Function to send message to AI bot
  const sendMessageToAiBot = async () => {
    if (!aiChatInput.trim() || !selectedAiBot) return;
    
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;
    
    // Add user message to chat
    const newUserMsg = {
      content: aiChatInput,
      timestamp: new Date(),
      isUser: true
    };
    
    setAiUserMessages(prev => [...prev, newUserMsg]);
    setAiChatInput('');
    setIsAiTyping(true);
    
    try {
      // Call the correct endpoint based on active provider
      const endpoint = activeAiProvider === 'rasa' 
        ? 'http://localhost:8080/ai/rasa/chat'
        : 'http://localhost:8080/ai/chat';
      
      const response = await axios.post(endpoint, {
        userId: parseInt(userId),
        botId: selectedAiBot.id,
        message: newUserMsg.content
      });
      
      // Add AI response to chat
      const aiResponse = {
        content: response.data.content,
        timestamp: new Date(),
        isUser: false
      };
      
      setAiResponses(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Add error message
      const errorResponse = {
        content: 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.',
        timestamp: new Date(),
        isUser: false,
        isError: true
      };
      
      setAiResponses(prev => [...prev, errorResponse]);
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
          // src="./src/assets/1.png"
          src={`http://localhost:8080/images/${user.avatarUrl}`}
          alt="Avatar"
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
                  {/* Community tab content */}
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
                    
                    {/* Existing group chats would be mapped here */}
                    <div className="mt-3 space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Nhóm chat của bạn</h3>
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-[#ecedef] group cursor-pointer"
                          onClick={() => {
                            // Select group chat and close popup
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
                  {/* AI Chat section */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Chọn AI để trò chuyện</h3>
                    
                    {/* AI Bot selection - simplified to just OpenAI and Rasa */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* OpenAI */}
                      <div 
                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-[#ecedef] cursor-pointer"
                        onClick={() => {
                          setSelectedAiBot({
                            id: 'openai-bot',
                            name: 'OpenAI',
                            avatar: './src/assets/1.png',
                            provider: 'openai'
                          });
                          // Clear previous messages when switching bots
                          setAiUserMessages([]);
                          setAiResponses([]);
                          setActivePopup(null);
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <img 
                            src='./src/assets/1.png' 
                            alt='OpenAI'
                            className="w-10 h-10"
                            onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                          />
                        </div>
                        <h4 className="text-sm font-semibold">OpenAI</h4>
                        <p className="text-xs text-gray-500 text-center mt-1">Trợ lý thông minh với GPT</p>
                      </div>
                      
                      {/* Rasa */}
                      <div 
                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-[#ecedef] cursor-pointer"
                        onClick={() => {
                          setSelectedAiBot({
                            id: 'rasa-bot',
                            name: 'Rasa',
                            avatar: './src/assets/2.jpg',
                            provider: 'rasa'
                          });
                          // Clear previous messages when switching bots
                          setAiUserMessages([]);
                          setAiResponses([]);
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
                        <h4 className="text-sm font-semibold">Rasa</h4>
                        <p className="text-xs text-gray-500 text-center mt-1">Trợ lý với Rasa NLU</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activePopup === "noti" && (
          <div className="noti-popup">
            <div className="noti-content">
              <h3>Thông báo</h3>
              <p>Nội dung thông báo</p>
              <button onClick={() => setActivePopup(null)}>Đóng</button>
            </div>
          </div>
        )}

        {activePopup === "acc" && (
          <div className="acc-popup">
            <div className="acc-content">
              <div onClick={GoToProfile} className="acc1">
                <img src={`http://localhost:8080/images/${user.avatarUrl}`} alt="Avatar" />
                <label className="text-black font-semibold text-[17px]">
                  {user?.username|| "Người dùng"}
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
      
      {/* Create Group Chat Modal */}
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
            {/* Sample messages */}
            {[1, 2, 3, 4, 5].map((idx) => {
              const isMe = idx % 2 === 0;
              const sender = isMe ? "Bạn" : `User ${idx % 4 + 1}`;
              const messages = [
                "Xin chào mọi người!",
                "Chúng ta họp lúc mấy giờ nhỉ?",
                "2h chiều nay nhé!",
                "Ok, tôi sẽ có mặt",
                "Tôi xin phép đến trễ 15 phút nhé"
              ];
              
              return (
                <div key={idx} className="flex flex-col">
                  {!isMe && (
                    <div className="flex items-center gap-1 mb-1">
                      <img 
                        src={`./src/assets/${idx % 4 + 1}.jpg`}
                        alt={sender}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {e.target.src = './src/assets/4.jpg'}}
                      />
                      <span className="text-xs font-medium">{sender}</span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                      isMe ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    }`}>
                      {messages[idx - 1]}
                    </div>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
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
                  
                  {/* Other members */}
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
              
              {/* Leave group button */}
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
                <p className="text-xs text-gray-500 truncate">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {selectedAiBot.provider === 'rasa' ? 'Rasa' : 'OpenAI'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAiBot(null)}
              className="text-gray-500 hover:text-black text-2xl font-bold"
              title="Đóng chat"
            >
              ×
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#f2f2f2]">
            {/* AI welcome message */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <img 
                    src={selectedAiBot.avatar}
                    alt={selectedAiBot.name}
                    className="w-4 h-4"
                    onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                  />
                </div>
                <span className="text-xs font-medium">{selectedAiBot.name}</span>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[70%] px-3 py-2 rounded-xl text-sm break-words bg-white text-black">
                  Xin chào! Tôi là {selectedAiBot.name}. Tôi có thể giúp gì cho bạn hôm nay?
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-left">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {/* User messages */}
            {aiUserMessages.map((msg, idx) => (
              <div key={`user-${idx}`} className="flex flex-col">
                <div className="flex justify-end">
                  <div className="max-w-[70%] px-3 py-2 rounded-xl text-sm break-words bg-blue-500 text-white">
                    {msg.content}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {/* AI responses */}
            {aiResponses.map((msg, idx) => (
              <div key={`ai-${idx}`} className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <img 
                      src={selectedAiBot.avatar}
                      alt={selectedAiBot.name}
                      className="w-4 h-4"
                      onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                    />
                  </div>
                  <span className="text-xs font-medium">{selectedAiBot.name}</span>
                </div>
                <div className="flex justify-start">
                  <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                    msg.isError ? 'bg-red-100 text-red-800' : 'bg-white text-black'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-left">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isAiTyping && (
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <img 
                    src={selectedAiBot.avatar}
                    alt={selectedAiBot.name}
                    className="w-4 h-4"
                    onError={(e) => {e.target.src = 'http://localhost:8080/images/default-avatar.png'}}
                  />
                </div>
                <div className="bg-white px-3 py-2 rounded-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
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
            {selectedAiBot.id === 'spring-bot' ? (
              <>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Spring Boot
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Spring Security
                </span>
              </>
            ) : selectedAiBot.id === 'java-bot' ? (
              <>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Java Collections
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Java Streams
                </span>
              </>
            ) : (
              <>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Giúp đỡ chung
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Gợi ý code
                </span>
              </>
            )}
          </div>
        </div>
      )}
      
    <ToastContainer position="top-right" />

    </div>
  );
}

export default Header;