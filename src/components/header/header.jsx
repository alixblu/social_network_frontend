
import './header.css';

import { Search, Facebook , Home, OndemandVideo, Storefront, Groups3, SportsEsports, Apps, ChatBubble, Notifications } from "@mui/icons-material"
import React, { useState } from 'react';
function Header() {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessOpen, setIsMessOpen] = useState(false); 
  const [isNotiOpen, setIsNotiOpen] = useState(false); 
  const [isAccOpen, setIsAccOpen] = useState(false); 

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
  


  return (
    <>
      <div className='header'>
        <div className="left-top-bar">
          <div className="left-fb-icon">
            <a href="">
             <Facebook className="fb_icon" />
            </a>
          </div>
          <div className='search-bar'>
            <label htmlFor="">
              <Search className='search_icon' />
            </label>
            <input placeholder='Tìm kiếm trên Facebook' type="text" name="" id="" />
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
              <h3>Tài khoản</h3>
              <p>Nội dung thông báo</p>
            </div>
          </div>
        )}



      </div>
    </>
  )
}

export default Header
