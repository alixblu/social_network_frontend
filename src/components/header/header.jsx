
import './header.css';

import { Search, Facebook , Home, OndemandVideo,
Storefront, Groups3, SportsEsports, Apps,
ChatBubble, Notifications, Person, Settings,QuestionMark ,
Nightlight, Report, MeetingRoom, ArrowForwardIos,ArrowBackOutlined } from "@mui/icons-material"
import React, { useState, useEffect, useRef } from 'react';
function Header() {

  const searchRef = useRef(null); // Tham chiếu đến phần tử search-popup
  


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessOpen, setIsMessOpen] = useState(false); 
  const [isNotiOpen, setIsNotiOpen] = useState(false); 
  const [isAccOpen, setIsAccOpen] = useState(false); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMessOpen(false);
    setIsNotiOpen(false);
    setIsAccOpen(false);
  };
  
  const toggleMess = () => {
    setIsMessOpen(!isMessOpen);
    setIsMenuOpen(false);
    setIsNotiOpen(false);
    setIsAccOpen(false);
  };
  
  const toggleNoti = () => {
    setIsNotiOpen(!isNotiOpen);
    setIsMessOpen(false);
    setIsMenuOpen(false);
    setIsAccOpen(false);
  };
  
  const toggleAcc = () => {
    setIsAccOpen(!isAccOpen);
    setIsMessOpen(false);
    setIsMenuOpen(false); 
    setIsNotiOpen(false); 
  };
  
  const toggleSearch = () =>{
    setIsSearchOpen(!isSearchOpen);
    setIsMessOpen(false);
    setIsMenuOpen(false); 
    setIsNotiOpen(false); 
    setIsAccOpen(false);
  }
  
  useEffect(() => {
    function handleClickOutside(event) {
      // Nếu phần tử được click không nằm trong search-popup => đóng popup
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      <div className='header'>
        <div className="left-top-bar">
          <div className="left-fb-icon">
            <a href="">
             <Facebook className="fb_icon" />
            </a>
          </div>
          <div  onClick={toggleSearch} className='search-bar'>
            <label htmlFor="">
              <Search className='search_icon' />
            </label>
            <input  placeholder='Tìm kiếm trên Facebook' type="text" name="" id="" />
          </div>
        </div>
        <div className="middle-top-bar">
          <ul className='list_icon_middle'>
            <li className=''>
              <span>
                <div></div>
                <a title='Trang chủ' aria-label='Trang chủ' href="">
                      <Home/>
                </a>
              </span>
            </li>
            <li className=''>
              <span>
                <div></div>
                <a title='Video' aria-label='Video' href="">
                    <OndemandVideo/>
                </a>
              </span>
            </li>
            <li className=''>
              <span>
                <div></div>
                <a title='MarketPlace' aria-label='MarketPlace' href="">
                    <Storefront/>  
                </a>
              </span>
            </li>
            <li className=''>
              <span>
                <div></div>
                <a title='Mọi người' aria-label='Mọi người' href="">
                    <Groups3/>
                </a>
              </span>
            </li>
            <li className=''>
              <span>
                <div></div>
                <a title='Game' aria-label='Game' href="">
                    <SportsEsports/>
                </a>
              </span>
            </li>
          </ul>
        </div>
        <div className="right-top-bar">
            <div title='Menu' id='menu' onClick={toggleMenu}>
              <Apps/>
            </div>
            <div title='Messenger' onClick={toggleMess}>
              <ChatBubble/>
            </div>
            <div title='Thông báo' onClick={toggleNoti}>
              <Notifications/>
            </div>
            {/* <div></div> */}
            <img onClick={toggleAcc} title='Tài khoản' src="./src/assets/1.png" alt="" />
        </div>

        {isSearchOpen &&(
          <div ref={searchRef} className="search-popup">
            <div className="search-content">
              <label onClick={toggleSearch} htmlFor=""><ArrowBackOutlined/></label>
              <div className='search-bar'>
                <input style={{ display: "block" , width: "250px", borderRadius: "50px", paddingLeft: "20px", }} placeholder='Tìm kiếm trên Facebook' type="text" name="" id="" />
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "center", padding:"10px"}}><label htmlFor="">Không có tìm kiếm nào gần đây</label></div>
          </div>
        )}


        {isMenuOpen && (
          <div className="menu-popup">
            <div className="menu-content">
              <h3>Menu</h3>
              <p>Nội dung menu ở đây</p>
              <button onClick={toggleMenu}>Đóng</button>
            </div>
          </div>
        )}
        {isMessOpen && (
          <div className="mess-popup">
            <div className="mess-content">
              <h3>Messenger</h3>
              <p>Nội dung message đây</p>
              <button onClick={toggleMess}>Đóng</button>
            </div>
          </div>
        )}
        {isNotiOpen && (
          <div className="noti-popup">
            <div className="noti-content">
              <h3>Thông báo</h3>
              <p>Nội dung thông báo</p>
              <button onClick={toggleNoti}>Đóng</button>
            </div>
          </div>
        )}
        {isAccOpen && (
          <div className="acc-popup">
            <div className="acc-content">
              <div className='acc1'>
                <img src="./src/assets/1.png" alt="" />
                <label htmlFor="">Huỳnh Vĩ</label>
              </div>            
              <div className='acc2'></div>
              <div className='acc3'>
                <Person/>
                <label htmlFor="">Xem trang cá nhân</label>
              </div>  
            </div>  
            <div> 
              <div className='acc-contend-1'>
                <div>
                  <label className='acc_lbl' htmlFor="">
                    <Settings/>
                  </label>
                  <label htmlFor="">Cài đặt và quyền riêng tư</label>
                </div>
                <label htmlFor="">
                  <ArrowForwardIos/>
                </label>
              </div>
              <div className='acc-contend-1'>
                <div>
                  <label className='acc_lbl' htmlFor="">
                    <QuestionMark/>
                  </label>
                  <label htmlFor="">Trợ giúp và hỗ trợ</label>
                </div>
                <label htmlFor="">
                  <ArrowForwardIos/>
                </label>
              </div>
              <div className='acc-contend-1'>
                <div>
                  <label className='acc_lbl' htmlFor="">
                    <Nightlight/>
                  </label>
                  <label htmlFor="">Màn hình & trợ năng</label>
                </div>
                <label htmlFor="">
                  <ArrowForwardIos/>
                </label>
              </div>
              <div className='acc-contend-1'>
                <div>
                  <label className='acc_lbl' htmlFor="">
                    <Report/>
                  </label>
                  <label htmlFor="">Đóng góp ý kiến</label>
                </div>
              </div>
              <div className='acc-contend-1'>
                <div>
                  <label className='acc_lbl' htmlFor="">
                    <MeetingRoom/>
                  </label>
                  <label htmlFor="">Đăng xuất</label>
                </div>
              </div>
            </div>
            <div className='acc-footer'>
              <label htmlFor=""><a href="">Quyền riêng tư </a>· </label>
              <label htmlFor=""><a href="">Điều khoản </a>· </label>
              <label htmlFor=""><a href="">Quảng cáo </a>· </label>
              <label htmlFor=""><a href="">Lựa chọn quảng cáo </a>· </label>
              <label htmlFor=""><a href="">Cookie </a>· </label>
              <label htmlFor=""><a href="">Xem thêm </a>· Meta 2025</label>
            </div>
          </div>
        )}



      </div>
    </>
  )
}

export default Header
