import React, { useState } from 'react';
import './rightsidebar.css';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MessengerChatBox from '../ui/chatbox';

function RightSidebar() {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const listContact = [
    { Avatar: '2.jpg', Name: 'VĨ', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Vũ', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Việt', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Thảo', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Loan', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Kiên', time: '2 ngày' },
    { Avatar: '2.jpg', Name: 'Kiệt', time: '2 ngày' },
    
  ];

  const [isOpenMess, setOpenMess] = useState(null);
  const [user, setUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleChatBox = (user) => {
    setOpenMess(!isOpenMess);
    setUser(user);
  };

  const filteredContacts = listContact.filter((item) =>
    item.Name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="right-side-bar">
      {/* Lời mời kết bạn */}
      <div className="add-friend-bar">
        <span>Lời mời kết bạn</span>
        <span onClick={() => navigate("/friends")} className='hover:text-blue-500' style={{ marginRight: '5px', cursor: 'pointer' }}>Xem tất cả</span>
      </div>

      {/* Thông báo lời mời */}
      <div className="thongbao">
        <div className="avarta-add-friend" onClick={handleAvatarClick}>
          <img src="./src/assets/2.jpg" />
        </div>
        <div className="confirm-addFriend">
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 5px 0' }}>
            <span>Trần Lê Phương Yên</span>
            <span>3 ngày</span>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="div-btn-acept">
              <button>Xác nhận</button>
            </div>
            <div className="div-btn-delete">
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách người liên hệ */}
      <div style={{ paddingTop: '10px', paddingBottom: '15px', borderTop: '#babbbc 1px solid', margin: '0 5px' }}>
        {/* Thanh tìm kiếm */}
        <div className="contact-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Người liên hệ</div>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '999px', padding: '0 8px', backgroundColor: 'white' }}>
            <Search style={{ fontSize: '18px', color: '#888' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '5px',
                backgroundColor: 'transparent',
                width: '200px',
              }}
            />
          </div>
        </div>

        {/* Danh sách người dùng đã lọc */}
        <div className='mb-9'>
          {filteredContacts.map((item, index) => (
            <div key={index} className="div-user-chat" onClick={() => handleChatBox(item)}>
              <div>
                <img
                  src={`./src/assets/${item.Avatar}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginRight: '20px',
                  }}
                />
              </div>
              <div style={{ width: '100%' }}>
                <div className="font-semibold text-[16px]">{item.Name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hộp chat */}
        {isOpenMess && (
          <MessengerChatBox user={user} onClose={() => setOpenMess(false)} />
        )}
      </div>
    </div>
  );
}

export default RightSidebar;
