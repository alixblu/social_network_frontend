import './header.css';
import {
  Search, Facebook, Home, OndemandVideo, Storefront, Groups3, SportsEsports, Apps,
  ChatBubble, Notifications, Person, Settings, QuestionMark, Nightlight, Report,
  MeetingRoom, ArrowForwardIos, ArrowBackOutlined, MoreHoriz, Fullscreen, Create
} from "@mui/icons-material";
import { Avatar } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  const messList = [
    { Avatar: "2.jpg", Name: "Thằng Đệ", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "A Hai", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Bin", Content: "Hello You" },
    { Avatar: "2.jpg", Name: "Thằng Đệ", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "A Hai", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Bin", Content: "Hello You" },
    { Avatar: "2.jpg", Name: "Thằng Đệ", Content: "Con gà mạnh" },
    { Avatar: "3.jpg", Name: "A Hai", Content: "Hôm nay đi đá banh không?" },
    { Avatar: "4.jpg", Name: "Bin", Content: "Hello You" }
  ];

  const BackToHome = () => navigate("/home");
  const GoToProfile = () => navigate("/profile");

  const renderMiddleIcons = () => [
    { icon: <Home />, title: 'Trang chủ' },
    { icon: <OndemandVideo />, title: 'Video' },
    { icon: <Storefront />, title: 'MarketPlace' },
    { icon: <Groups3 />, title: 'Mọi người' },
    { icon: <SportsEsports />, title: 'Game' }
  ].map(({ icon, title }, idx) => (
    <li key={idx}>
      <span><div></div><a title={title} aria-label={title} href="">{icon}</a></span>
    </li>
  ));

  return (
    <div className='header'>
      <div className="left-top-bar">
        <div onClick={BackToHome} className="left-fb-icon">
          <Facebook className="fb_icon" />
        </div>
        <div onClick={() => togglePopup('search')} className='search-bar'>
          <label><Search className='search_icon' /></label>
          <input placeholder='Tìm kiếm trên Facebook' type="text" />
        </div>
      </div>

      <div className="middle-top-bar">
        <ul className='list_icon_middle'>
          {renderMiddleIcons()}
        </ul>
      </div>

      <div className="right-top-bar">
        <div onClick={() => togglePopup('menu')} title='Menu'><Apps /></div>
        <div onClick={() => togglePopup('mess')} title='Messenger'><ChatBubble /></div>
        <div onClick={() => togglePopup('noti')} title='Thông báo'><Notifications /></div>
        <img onClick={() => togglePopup('acc')} title='Tài khoản' src="./src/assets/1.png" alt="Avatar" />
      </div>

      <div ref={popupRef}>
        {activePopup === 'search' && (
          <div className="search-popup">
            <div className="search-content">
              <label onClick={() => setActivePopup(null)}><ArrowBackOutlined /></label>
              <input placeholder='Tìm kiếm trên Facebook' style={{ width: "250px", borderRadius: "50px", paddingLeft: "20px" }} />
            </div>
            <div className="center"><label>Không có tìm kiếm nào gần đây</label></div>
          </div>
        )}

        {activePopup === 'menu' && (
          <div className="menu-popup">
            <div className="menu-content">
              <h3>Menu</h3><p>Nội dung menu ở đây</p>
              <button onClick={() => setActivePopup(null)}>Đóng</button>
            </div>
          </div>
        )}

        {activePopup === 'mess' && (
          <div className="mess-popup">
            <div className="mess-content space-y-4">
              <div className='flex justify-between items-center'>
                <label className='text-2xl font-bold'>Đoạn chat</label>
                <div className='space-x-3'><MoreHoriz /><Fullscreen /><Create /></div>
              </div>
              <div className='flex items-center group'>
                <label className='rounded-l-full px-2 h-[35px] flex items-center bg-[#f0f2f5]'><Search /></label>
                <input className='w-[300px] h-[35px] outline-none bg-[#f0f2f5] rounded-r-full' placeholder='Tìm kiếm trên messenger' />
              </div>
              <div className='flex gap-1'><input type="button" value="Hộp thư" className='rounded-full px-3 py-1 hover:bg-[#ecedef]' /><input type="button" value="Cộng đồng" className='rounded-full px-3 py-1 hover:bg-[#ecedef]' /></div>
              <div className='h-[450px] overflow-y-auto scrollbar-thin'>
                {messList.map((mess, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#ecedef] group">
                    <img className="w-[55px] h-[55px] rounded-full" src={`./src/assets/${mess.Avatar}`} alt={mess.Name} />
                    <div><label className="font-semibold text-sm">{mess.Name}</label><br /><label className="text-gray-500 text-xs">{mess.Content}</label></div>
                    <label className="absolute right-4 p-1 bg-white rounded-full hidden group-hover:flex"><MoreHoriz /></label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePopup === 'noti' && (
          <div className="noti-popup">
            <div className="noti-content">
              <h3>Thông báo</h3>
              <p>Nội dung thông báo</p>
              <button onClick={() => setActivePopup(null)}>Đóng</button>
            </div>
          </div>
        )}

        {activePopup === 'acc' && (
          <div className="acc-popup">
            <div className="acc-content">
              <div onClick={GoToProfile} className='acc1'>
                <img src="./src/assets/1.png" alt="Avatar" />
                <label className='text-black font-semibold text-[17px]'>Huỳnh Vĩ</label>
              </div>
              <div className='acc2'></div>
              <div className='acc3'><Person /><label className='font-semibold text-[14px]'>Xem trang cá nhân</label></div>
            </div>
            <div>
              {[{ icon: <Settings />, text: "Cài đặt và quyền riêng tư" },
                { icon: <QuestionMark />, text: "Trợ giúp và hỗ trợ" },
                { icon: <Nightlight />, text: "Màn hình & trợ năng" },
                { icon: <Report />, text: "Đóng góp ý kiến" },
                { icon: <MeetingRoom />, text: "Đăng xuất" }].map((item, idx) => (
                <div key={idx} className='acc-contend-1'>
                  <div><label className='acc_lbl'>{item.icon}</label><label className='font-semibold'>{item.text}</label></div>
                  {idx < 3 && <label><ArrowForwardIos /></label>}
                </div>
              ))}
            </div>
            <div className='acc-footer'>
              {["Quyền riêng tư", "Điều khoản", "Quảng cáo", "Lựa chọn quảng cáo", "Cookie", "Xem thêm"]
                .map((text, idx) => <label key={idx}><a href="">{text} </a>· </label>)}
              <label>Meta 2025</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;