import React from 'react'
import "./rightsidebar.css";

import {
    Search
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function rightsidebar() {
    const navigate = useNavigate(); // ✅ hook điều hướng

    const handleAvatarClick = () => {
        navigate('/profile'); // ✅ điều hướng tới route
    };

    const listContact = [
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
        {image : "2.jpg" , name : "VĨ" , time : "2 ngày" },
    
    ]
  return (
    <div className='right-side-bar'>
        <div className='add-friend-bar'>
            <span>Lời mời kết bạn</span>
            <span style={{marginRight:'5px', cursor:'pointer'}}>Xem tất cả</span>
        </div>

        <div className="thongbao">
            <div className="avarta-add-friend" onClick={handleAvatarClick}>
                <img src="./src/assets/2.jpg"/>
            </div>
            <div className="confirm-addFriend">

                <div style={{display:'flex', justifyContent:'space-between', margin:'0 0 5px 0'}}>
                    <span>Trần Lê Phương Yên</span>
                    <span>3 ngày</span>
                </div>

                <div style={{display:'flex'}}>
                    <div className='div-btn-acept'>
                        <button>Xác nhận</button>
                    </div>
                    <div className='div-btn-delete'>
                        <button>Xóa</button> 
                    </div>
                        
                </div>
            </div>
        </div>

        <div style={{paddingTop:'10px',paddingBottom:'15px', borderTop:'#babbbc 1px solid', margin:'0 5px'}}> 
            <div class='contact-bar'> 
                <div> Người liên hệ</div>
                <div><Search/></div>
            </div>

            <div>
                {listContact.map((item , index) => (
                <div idx= {item.index} className='div-user-chat'>
                    <div>
                        <img src= {`./src/assets/${item.image}`} style={{width:'40px', height:'40px', objectFit:'cover', 
                            borderRadius:'50%', marginRight:'20px'

                        }}/>
                    </div>

                    <div style={{width:'100%'}}>
                        <div className='font-semibold font-"16px'>{item.name}</div>
                    </div>
                </div>
                ))}
                
            </div>
        </div>
    </div>
  )
}

export default rightsidebar