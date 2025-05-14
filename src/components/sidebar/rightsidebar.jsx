import React, { useState, useEffect } from 'react';
import { Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessengerChatBox from '../ui/chatbox.jsx';
import UserChatBox from '../ui/UserChatBox';
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
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUserId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  // Hàm xử lý avatarUrl để thêm prefix nếu cần
  const getAvatarUrl = (url) => {
    if (!url || url === 'default-avatar.png') return 'http://localhost:8080/images/default-avatar.png';
    return url.startsWith('http') ? url : `http://localhost:8080/images/${url}`;
  };

  useEffect(() => {
    if (!currentUserId || !token) {
      console.log('Không có userId hoặc token, chuyển hướng về login');
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Lấy lời mời kết bạn
        const friendRequestsRes = await axios.get(
          `http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const friendRequestsData = friendRequestsRes.data;
        setFriendRequests(
          Array.isArray(friendRequestsData)
            ? friendRequestsData.map((f) => ({
                id: f.id || 0,
                username:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.username || 'Unknown'
                    : f.user1?.username || 'Unknown',
                avatarUrl: getAvatarUrl(
                  f.user1?.id === parseInt(currentUserId) ? f.user2?.avatarUrl : f.user1?.avatarUrl
                ),
                mutualFriends: f.mutualFriends || 0,
                createdAt: f.createdAt || new Date().toISOString(),
              }))
            : []
        );

        // Lấy danh sách bạn bè
        const friendsRes = await axios.get(
          `http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const friendsData = friendsRes.data;
        console.log('Friends:', friendsData);
        setFriends(
          Array.isArray(friendsData)
            ? friendsData.map((f) => ({
                id: f.user1?.id === parseInt(currentUserId) ? f.user2?.id : f.user1?.id,
                username:
                  f.user1?.id === parseInt(currentUserId)
                    ? f.user2?.username || 'Unknown'
                    : f.user1?.username || 'Unknown',
                avatarUrl: getAvatarUrl(
                  f.user1?.id === parseInt(currentUserId) ? f.user2?.avatarUrl : f.user1?.avatarUrl
                ),
                isOnline: Math.random() > 0.5, // Giả lập trạng thái online
                user1: f.user1,
                user2: f.user2
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
              id: f.user1?.id === parseInt(currentUserId) ? f.user2?.id : f.user1?.id,
              username:
                f.user1?.id === parseInt(currentUserId)
                  ? f.user2?.username || 'Unknown'
                  : f.user1?.username || 'Unknown',
              avatarUrl: getAvatarUrl(
                f.user1?.id === parseInt(currentUserId) ? f.user2?.avatarUrl : f.user1?.avatarUrl
              ),
              isOnline: Math.random() > 0.5,
              user1: f.user1,
              user2: f.user2
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

  const handleChatBox = async (friend) => {
    try {
      console.log('Opening chat with friend:', friend);
      const userId1 = parseInt(sessionStorage.getItem('userId'));
      // Get the friend's user ID from the friendship data
      const userId2 = friend.user1?.id === userId1 ? friend.user2?.id : friend.user1?.id;
      
      if (!userId2) {
        console.error('Could not determine friend user ID');
        setError('Invalid friend data');
        return;
      }
      
      // Prevent self-chatting
      if (userId1 === userId2) {
        setError('Cannot start chat with yourself');
        return;
      }
      
      console.log('Requesting chat room with users:', { userId1, userId2 });
      
      // First check friendship status
      const friendshipResponse = await axios.get('http://localhost:8080/friendships/between', {
        params: {
          userId1,
          userId2
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Friendship status:', friendshipResponse.data);
      
      if (!friendshipResponse.data || friendshipResponse.data.status !== 'ACCEPTED') {
        throw new Error('Friendship not accepted');
      }
      
      // Get or create chat room
      const response = await axios.get('http://localhost:8080/chat/rooms/find', {
        params: {
          userId1,
          userId2
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Chat room response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      if (response.data.message === 'friendship not available') {
        throw new Error('Friendship not available for chatting');
      }
      
      if (!response.data.id) {
        throw new Error('Invalid chat room response: missing room ID');
      }
      
      setSelectedUser({
        ...friend,
        id: userId2, // Set the correct user ID
        chatRoomId: response.data.id
      });
    } catch (error) {
      console.error('Error creating chat room:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show more specific error message to user
      if (error.message === 'Friendship not accepted') {
        setError('Cannot start chat: Friendship not accepted');
      } else if (error.response?.data?.message === 'friendship not available') {
        setError('Cannot start chat: Friendship not available');
      } else if (error.response?.status === 404) {
        setError('Cannot start chat: Friendship not found');
      } else {
        setError('Failed to open chat. Please try again.');
      }
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
                  src={friendRequests[0].avatarUrl}
                  alt={friendRequests[0].username || 'Unknown'}
                  onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
                  onClick={() => navigate('/profile')}
                  loading="lazy"
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
                    src={friend.avatarUrl}
                    alt={friend.username || 'Unknown'}
                    onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginRight: '20px',
                    }}
                    loading="lazy"
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

      {selectedUser && (
        <div className="fixed top-[60px] right-[20px] z-50">
          <UserChatBox 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;  