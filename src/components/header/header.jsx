
import './header.css';

import { Search, Facebook , Home, OndemandVideo,
Storefront, Groups3, SportsEsports, Apps,
ChatBubble, Notifications, Person, Settings,QuestionMark ,
Nightlight, Report, MeetingRoom, ArrowForwardIos,ArrowBackOutlined
,MoreHoriz, Fullscreen, Create  } from "@mui/icons-material"
import { Avatar } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
function Header() {


  const [activePopup, setActivePopup] = useState(null); // Quản lý trạng thái popup mở
  const popupRef = useRef(null); // Tham chiếu đến popup


  const togglePopup = (popupName) => {
    if (activePopup === popupName) {
      setActivePopup(null); // Nếu đang mở cùng popup, thì đóng nó
    } else {
      setActivePopup(popupName); // Nếu không, mở popup mới
    }
  };
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    }

    if (activePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopup]);

  const messList = [
    {
      Avatar: "2.jpg",
      Name: "Thằng Đệ",
      Content: "Con gà mạnh"
    },
    {
      Avatar: "3.jpg",
      Name: "A Hai",
      Content: "Hôm nay đi đá banh không?"
    },
    {
      Avatar: "4.jpg",
      Name: "Bin",
      Content: "Hello You"
    },
    {
      Avatar: "2.jpg",
      Name: "Thằng Đệ",
      Content: "Con gà mạnh"
    },
    {
      Avatar: "3.jpg",
      Name: "A Hai",
      Content: "Hôm nay đi đá banh không?"
    },
    {
      Avatar: "4.jpg",
      Name: "Bin",
      Content: "Hello You"
    },
    {
      Avatar: "2.jpg",
      Name: "Thằng Đệ",
      Content: "Con gà mạnh"
    },
    {
      Avatar: "3.jpg",
      Name: "A Hai",
      Content: "Hôm nay đi đá banh không?"
    },
    {
      Avatar: "4.jpg",
      Name: "Bin",
      Content: "Hello You"
    },
   
   
  ];
  

  return (
    <>
      <div className='header'>
        <div className="left-top-bar">
          <div className="left-fb-icon">
            <a href="">
             <Facebook className="fb_icon" />
            </a>
          </div>
          <div onClick={() => togglePopup('search')}  className='search-bar'>
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
                <a title='Trang chủ' aria-label='Trang chủ' href="home">
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
            <div onClick={() => togglePopup('menu')} title='Menu' id='menu' >
              <Apps/>
            </div>
            <div onClick={() => togglePopup('mess')} title='Messenger' >
              <ChatBubble/>
            </div>
            <div onClick={() => togglePopup('noti')} title='Thông báo'>
              <Notifications/>
            </div>
            {/* <div></div> */}
            <img onClick={() => togglePopup('acc')} title='Tài khoản' src="./src/assets/1.png" alt="" />
        </div>
        <div ref={popupRef}>
          {activePopup === 'search' && (
            <div className="search-popup">
              <div className="search-content">
                <label onClick={() => setActivePopup(null)}><ArrowBackOutlined/></label>
                <div className='search-bar'>
                  <input placeholder='Tìm kiếm trên Facebook' type="text" style={{ width: "250px", borderRadius: "50px", paddingLeft: "20px" }} />
                </div>
              </div>
              <div style={{display: "flex", justifyContent: "center", padding:"10px"}}>
                <label>Không có tìm kiếm nào gần đây</label>
              </div>
            </div>
          )}

          {activePopup === 'menu' && (
            <div className="menu-popup">
              <div className="menu-content">
                <h3>Menu</h3>
                <p>Nội dung menu ở đây</p>
                <button onClick={() => setActivePopup(null)}>Đóng</button>
              </div>
            </div>
          )}

          {activePopup === 'mess' && (
            <div className="mess-popup">
              <div className="mess-content space-y-4">
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-2xl font-bold' htmlFor="">Đoạn chat</label>
                  </div>
                  <div className='space-x-3'>
                    <MoreHoriz/>
                    <Fullscreen/>
                    <Create/>
                  </div>
                </div>
                <div className='flex items-center group'>
                  <label className='rounded-tl-full rounded-bl-full w-[px] pl-[8px] h-[35px] flex items-center bg-[#f0f2f5] ' htmlFor="">
                    <Search/>
                  </label>
                  <input className='w-[300px] h-[35px] outline-none bg-[#f0f2f5] rounded-tr-full rounded-br-full' placeholder='Tìm kiếm trên messenger' type="text" />
                </div>
                <div className='flex items-center justify-start gap-1'>
                  <input className='px-[12px] py-[4px] font-semibold rounded-full hover:bg-[#ecedef]' type="button" name="" id="" value="Hộp thư"/>
                  <input className='px-[12px] py-[4px] font-semibold rounded-full hover:bg-[#ecedef]' type="button" name="" id="" value="Cộng đồng" />
                </div>
                <div className='h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb  -gray-400 scrollbar-track-gray-100'>
                  {messList.map((mess, index) => (
                    <div key={index} className="relative flex items-center rounded-lg p-2 group gap-x-3 hover:bg-[#ecedef] ">
                      <img className="w-[55px] h-[55px] rounded-full" src={`./src/assets/${mess.Avatar}`} alt={mess.Name} />
                      <div className="flex flex-col items-start">
                        <label className="font-semibold text-[15px]">{mess.Name}</label>
                        <label className="text-gray-500 text-[12px]">{mess.Content}</label>
                      </div>
                      <label className="absolute right-4 p-1 rounded-full  bg-white hidden group-hover:flex">
                        <MoreHoriz />
                      </label>
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
                <div className='acc1'>
                  <img src="./src/assets/1.png" alt="" />
                  <label className='text-black font-semibold text-[17px]' htmlFor="">Huỳnh Vĩ</label>
                </div>            
                <div className='acc2'></div>
                <div className='acc3'>
                  <Person/>
                  <label className='font-semibold font-family-inherit text-[14px]' htmlFor="">Xem trang cá nhân</label>
                </div>  
              </div>  
              <div> 
                <div className='acc-contend-1'>
                  <div>
                    <label className='acc_lbl' htmlFor="">
                      <Settings/>
                    </label>
                    <label className='font-semibold' htmlFor="">Cài đặt và quyền riêng tư</label>
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
                    <label className='font-semibold' htmlFor="">Trợ giúp và hỗ trợ</label>
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
                    <label className='font-semibold' htmlFor="">Màn hình & trợ năng</label>
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
                    <label className='font-semibold' htmlFor="">Đóng góp ý kiến</label>
                  </div>
                </div>
                <div className='acc-contend-1'>
                  <div>
                    <label className='acc_lbl' htmlFor="">
                      <MeetingRoom/>
                    </label>
                    <label className='font-semibold' htmlFor="">Đăng xuất</label>
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
      </div>
    </>
  )
}

export default Header
