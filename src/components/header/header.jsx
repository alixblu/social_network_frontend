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
  const messList = [
    { Avatar: "2.jpg", Name: "Thằng Đệ", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "A Hai", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Bin", Content: "Hello You" },
    { Avatar: "2.jpg", Name: "Tuấn", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "Tín", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Phương Anh", Content: "Hello You" },
    { Avatar: "2.jpg", Name: "Vũ", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "Nhật", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Nam", Content: "Hello You" },
  ];

  const [searchKeyword, setSearchKeyword] = useState("");
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
    const token = sessionStorage.getItem("token"); // Lấy chuỗi token trực tiếp
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
                  className="rounded-full px-3 py-1 hover:bg-[#ecedef]"
                />
                <input
                  type="button"
                  value="Cộng đồng"
                  className="rounded-full px-3 py-1 hover:bg-[#ecedef]"
                />
              </div>
              <div className="h-[450px] overflow-y-auto scrollbar-thin">
                {filteredMessList.map((mess, idx) => (
                  <div
                    onClick={() => {
                      setSelectedUser(mess);
                      setActivePopup(null);
                    }}
                    key={idx}
                    className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-[#ecedef] group"
                  >
                    <img
                      className="w-[55px] h-[55px] rounded-full shrink-0"
                      src={`./src/assets/${mess.Avatar}`}
                      alt={mess.Name}
                    />
                    <div className="flex flex-col justify-start w-0 flex-1">
                      <label className="font-semibold text-sm text-left">{mess.Name}</label>
                      <label className="text-gray-500 text-xs text-left">{mess.Content}</label>
                    </div>
                    <label className="absolute right-4 p-1 bg-white rounded-full hidden group-hover:flex">
                      <MoreHoriz />
                    </label>
                  </div>
                ))}
              </div>
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
        />
      )}
    <ToastContainer position="top-right" />

    </div>
  );
}

export default Header;