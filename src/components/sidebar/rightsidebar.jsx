// src/components/RightSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessengerChatBox from '../ui/chatbox.jsx';
import './RightSidebar.css';

const RightSidebar = () => {
  const navigate = useNavigate();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isOpenMess, setOpenMess] = useState(null);
  const [user, setUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!currentUserId || !token) {
      console.log('Không có userId hoặc token, chuyển hướng về login');
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const friendRequestsRes = await axios.get(
          `http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const friendRequestsData = friendRequestsRes.data;
        console.log('Friend Requests:', friendRequestsData);
        setFriendRequests(
          Array.isArray(friendRequestsData)
            ? friendRequestsData.map((f) => ({
                id: f.id || 0,
                username:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.username || 'Unknown'
                    : f.user1?.username || 'Unknown',
                avatarUrl:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.avatarUrl || 'https://via.placeholder.com/80'
                    : f.user1?.avatarUrl || 'https://via.placeholder.com/80',
                mutualFriends: f.mutualFriends || 0,
                createdAt: f.createdAt || new Date().toISOString(),
              }))
            : []
        );

        const friendsRes = await axios.get(
          `http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const friendsData = friendsRes.data;
        console.log('Friends:', friendsData);
        setFriends(
          Array.isArray(friendsData)
            ? friendsData.map((f) => ({
                id: f.id || 0,
                username:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.username || 'Unknown'
                    : f.user1?.username || 'Unknown',
                avatarUrl:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.avatarUrl || 'https://via.placeholder.com/80'
                    : f.user1?.avatarUrl || 'https://via.placeholder.com/80',
                isOnline: Math.random() > 0.5,
              }))
            : []
        );
      } catch (err) {
        console.error('Lỗi lấy dữ liệu:', err);
        setError(err.response?.data?.message || 'Không thể tải dữ liệu');
        if (err.response?.status === 401) {
          console.log('Token không hợp lệ, chuyển hướng về login');
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserId, token, navigate]);

  const handleAcceptFriend = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/friendships/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
      const friendsRes = await axios.get(
        `http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(
        Array.isArray(friendsRes.data)
          ? friendsRes.data.map((f) => ({
              id: f.id || 0,
              username:
                f.user1?.id === parseInt(currentUserId)
                  ? f.user2?.username || 'Unknown'
                  : f.user1?.username || 'Unknown',
              avatarUrl:
                f.user1?.id === parseInt(currentUserId)
                  ? f.user2?.avatarUrl || 'https://via.placeholder.com/80'
                  : f.user1?.avatarUrl || 'https://via.placeholder.com/80',
              isOnline: Math.random() > 0.5,
            }))
          : []
      );
    } catch (err) {
      console.error('Lỗi xác nhận lời mời:', err);
      setError('Không thể xác nhận lời mời');
    }
  };

  const handleDeleteFriend = async (requestId) => {
    try {
      await axios.delete(`http://localhost:8080/friendships/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Lỗi xóa lời mời:', err);
      setError('Không thể xóa lời mời');
    }
  };

  const handleChatBox = (friend) => {
    if (friend) {
      setOpenMess(!isOpenMess);
      setUser({
        Name: friend.username,
        Avatar: friend.avatarUrl.replace(/^https?:\/\/[^\/]+\/?(.*)$/, '$1'), // Chỉ lấy phần đường dẫn tương đối
      });
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const formatTimeAgo = (date) => {
    try {
      const now = new Date();
      const diff = now - new Date(date);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} ngày` : 'Hôm nay';
    } catch {
      return 'Hôm nay';
    }
  };

  return (
    <div className="right-side-bar">
      {/* Lời mời kết bạn */}
      <div className="add-friend-bar">
        <span className="text-lg font-semibold">Lời mời kết bạn</span>
        <div className="flex items-center space-x-2">
          <span
            onClick={() => navigate('/friends')}
            className="text-blue-500 hover:underline cursor-pointer text-sm"
          >
            Xem tất cả
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="thongbao">
          {isLoading && <p className="text-center text-gray-500">Đang tải...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {friendRequests.length === 0 && !isLoading && (
            <p className="text-center text-gray-500">Không có lời mời kết bạn</p>
          )}
          {friendRequests.length > 0 && friendRequests[0] && (
            <>
              <div className="avarta-add-friend">
                <img
                  src={friendRequests[0].avatarUrl || 'https://via.placeholder.com/80'}
                  alt={friendRequests[0].username || 'Unknown'}
                  onClick={() => navigate('/profile')}
                />
              </div>
              <div className="confirm-addFriend">
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 5px 0' }}>
                  <span className="font-semibold text-lg">{friendRequests[0].username || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(friendRequests[0].createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 p-2">{friendRequests[0].mutualFriends || 0} bạn chung</p>
                <div style={{ display: 'flex' }}>
                  <div className="div-btn-acept">
                    <button onClick={() => handleAcceptFriend(friendRequests[0].id)}>Xác nhận</button>
                  </div>
                  <div className="div-btn-delete">
                    <button onClick={() => handleDeleteFriend(friendRequests[0].id)}>Xóa</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Danh sách người liên hệ */}
      <div style={{ paddingTop: '10px', borderTop: '#babbbc 1px solid', margin: '0 5px' }}>
        <div className="contact-bar">
          <span className="text-lg font-semibold">Người liên hệ</span>
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

        <div className="space-y-2">
          {filteredFriends.length === 0 && !isLoading && (
            <p className="text-center text-gray-500">Không tìm thấy bạn bè</p>
          )}
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="div-user-chat"
              onClick={() => handleChatBox(friend)}
            >
              <div>
                <div className="relative">
                  <img
                    src={friend.avatarUrl || 'https://via.placeholder.com/80'}
                    alt={friend.username || 'Unknown'}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginRight: '20px',
                    }}
                  />
                  {friend.isOnline && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '20px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#22c55e',
                        borderRadius: '50%',
                        border: '2px solid white',
                      }}
                    />
                  )}
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <span className="font-semibold text-[16px]">{friend.username || 'Unknown'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOpenMess && user && (
        <MessengerChatBox user={user} onClose={() => setOpenMess(false)} />
      )}
    </div>
  );
};

export default RightSidebar;