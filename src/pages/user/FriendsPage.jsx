import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent } from "../../components/ui/card";
import { UserIcon, UsersIcon, ListIcon, HomeIcon, MoreVertical } from "lucide-react";
import Header from '../../components/header/header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FriendsPage.css';

const Sidebar = ({ selected, onSelect }) => {
  const items = [
    { icon: <HomeIcon className="mr-2" />, label: "Trang chủ" },
    { icon: <UserIcon className="mr-2" />, label: "Lời mời kết bạn" },
    { icon: <UsersIcon className="mr-2" />, label: "Tất cả bạn bè" },
    { icon: <ListIcon className="mr-2" />, label: "Đã chặn" },
  ];
  return (
    <div className="w-64 border-r p-4 space-y-2 bg-white">
      <h2 className="text-xl font-bold mb-4">Bạn bè</h2>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.label)}
          className={`flex items-center px-3 py-2 w-full rounded-lg text-left hover:bg-gray-100 transition ${
            selected === item.label ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

const FriendCard = ({ id, username, mutualFriends, avatarUrl, onAccept, onDelete }) => (
  <Card className="w-60">
    <CardContent className="p-4 text-center">
      <img
        src={avatarUrl}
        alt={username}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
        loading="lazy"
      />
      <div className="font-semibold">{username}</div>
      <div className="text-sm text-gray-500 min-h-[1.25rem]">
        {mutualFriends > 0 ? `${mutualFriends} bạn chung` : <span> </span>}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="friend-action confirm" onClick={() => onAccept(id)}>Xác nhận</button>
        <button className="friend-action delete" onClick={() => onDelete(id)}>Xóa</button>
      </div>
    </CardContent>
  </Card>
);

const FriendCardSimple = ({ id, username, mutualFriends, avatarUrl, isFriend, onAddFriend, onBlock, onUnfriend }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <Card className="w-60 relative">
      <CardContent className="p-4 text-center">
        <img
          src={avatarUrl}
          alt={username}
          className="w-20 h-20 rounded-full mx-auto mb-2"
          onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
          loading="lazy"
        />
        <div className="font-semibold">{username}</div>
        <div className="text-sm text-gray-500 min-h-[1.25rem]">
          {mutualFriends > 0 ? `${mutualFriends} bạn chung` : <span> </span>}
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <MoreVertical />
        </button>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-10 right-2 bg-white border rounded shadow-lg z-10 text-left text-sm w-full"
          >
            {isFriend ? (
              <>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => onUnfriend(id)}
                >
                  ❌ Xóa kết bạn với {username}
                </button>
                <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                  💬 Nhắn tin cho {username}
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-red-600 text-left"
                  onClick={() => onBlock(id)}
                >
                  ⛔ Chặn {username}
                </button>
              </>
            ) : (
              <button
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                onClick={() => onAddFriend(id)}
              >
                ➕ Thêm bạn {username}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BlockedFriendCard = ({ id, username, avatarUrl, onUnblock }) => (
  <Card className="w-60">
    <CardContent className="p-4 text-center">
      <img
        src={avatarUrl}
        alt={username}
        className="w-20 h-20 rounded-full mx-auto mb-2"
        onError={(e) => (e.target.src = 'http://localhost:8080/images/default-avatar.png')}
        loading="lazy"
      />
      <div className="font-semibold">{username}</div>
      <div className="text-sm text-gray-500 mb-2">⛔ Đã bị chặn</div>
      <button
        onClick={() => onUnblock(id)}
        className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
      >
        🔓 Bỏ chặn
      </button>
    </CardContent>
  </Card>
);

export default function FriendsPage() {
  const [tab, setTab] = useState("Trang chủ");
  const [homeSearch, setHomeSearch] = useState("");
  const [friendRequestSearch, setFriendRequestSearch] = useState("");
  const [allFriendsSearch, setAllFriendsSearch] = useState("");
  const [blockedSearch, setBlockedSearch] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [blockedFriends, setBlockedFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUserId = sessionStorage.getItem('userId');

  // Hàm xử lý avatarUrl để thêm prefix nếu cần
  const getAvatarUrl = (url) => {
    if (!url || url === 'default-avatar.png') return 'http://localhost:8080/images/default-avatar.png';
    return url.startsWith('http') ? url : `http://localhost:8080/images/${url}`;
  };

  useEffect(() => {
    if (!currentUserId) {
      setError('Vui lòng đăng nhập để tiếp tục');
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        };

        // Lấy lời mời kết bạn
        const friendRequestsRes = await fetch(`http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`, config);
        if (!friendRequestsRes.ok) throw new Error('Lỗi khi lấy lời mời kết bạn');
        const friendRequestsData = await friendRequestsRes.json();
        console.log('Friend Requests avatarUrl:', friendRequestsData.map(f => ({
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl)
        })));
        setFriendRequests(friendRequestsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        // Lấy danh sách bạn bè
        const friendsRes = await fetch(`http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`, config);
        if (!friendsRes.ok) throw new Error('Lỗi khi lấy danh sách bạn bè');
        const friendsData = await friendsRes.json();
        console.log('Friends avatarUrl:', friendsData.map(f => ({
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl)
        })));
        setFriends(friendsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        // Lấy danh sách chặn
        const blockedRes = await fetch(`http://localhost:8080/friendships/status/BLOCKED?userId=${currentUserId}`, config);
        if (!blockedRes.ok) throw new Error('Lỗi khi lấy danh sách chặn');
        const blockedData = await blockedRes.json();
        console.log('Blocked avatarUrl:', blockedData.map(f => ({
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl)
        })));
        setBlockedFriends(blockedData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        // Lấy gợi ý kết bạn
        const suggestionsRes = await fetch(`http://localhost:8080/friendships/suggestions/${currentUserId}`, config);
        if (!suggestionsRes.ok) throw new Error('Lỗi khi lấy gợi ý kết bạn');
        const suggestionsData = await suggestionsRes.json();
        console.log('Suggestions avatarUrl:', suggestionsData.map(u => ({
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl)
        })));
        setSuggestions(suggestionsData.map(u => ({
          id: u.id,
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl),
          mutualFriends: 0
        })));
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu từ server');
        toast.error(err.message || 'Không thể tải dữ liệu từ server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUserId, navigate]);

  // Gửi lời mời kết bạn
  const handleAddFriend = async (friendId) => {
    try {
      const response = await fetch('http://localhost:8080/friendships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          user1: { id: parseInt(currentUserId) },
          user2: { id: friendId }
        })
      });
      if (response.ok) {
        toast.success('Lời mời kết bạn đã được gửi!');
        const suggestionsRes = await fetch(`http://localhost:8080/friendships/suggestions/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!suggestionsRes.ok) throw new Error('Lỗi khi làm mới gợi ý');
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData.map(u => ({
          id: u.id,
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl),
          mutualFriends: 0
        })));

        const friendRequestsRes = await fetch(`http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendRequestsRes.ok) throw new Error('Lỗi khi làm mới lời mời');
        const friendRequestsData = await friendRequestsRes.json();
        setFriendRequests(friendRequestsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể gửi lời mời kết bạn');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Chấp nhận lời mời
  const handleAccept = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/friendships/${friendshipId}/accept`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        toast.success('Đã chấp nhận lời mời kết bạn!');
        const friendRequestsRes = await fetch(`http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendRequestsRes.ok) throw new Error('Lỗi khi làm mới lời mời');
        const friendRequestsData = await friendRequestsRes.json();
        setFriendRequests(friendRequestsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        const friendsRes = await fetch(`http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendsRes.ok) throw new Error('Lỗi khi làm mới bạn bè');
        const friendsData = await friendsRes.json();
        setFriends(friendsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể chấp nhận lời mời');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Từ chối/Xóa lời mời
  const handleDelete = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/friendships/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        toast.success('Đã xóa lời mời kết bạn!');
        const friendRequestsRes = await fetch(`http://localhost:8080/friendships/status/PENDING?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendRequestsRes.ok) throw new Error('Lỗi khi làm mới lời mời');
        const friendRequestsData = await friendRequestsRes.json();
        setFriendRequests(friendRequestsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        const suggestionsRes = await fetch(`http://localhost:8080/friendships/suggestions/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!suggestionsRes.ok) throw new Error('Lỗi khi làm mới gợi ý');
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData.map(u => ({
          id: u.id,
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl),
          mutualFriends: 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể xóa lời mời');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Hủy kết bạn
  const handleUnfriend = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/friendships/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        toast.success('Đã hủy kết bạn!');
        const friendsRes = await fetch(`http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendsRes.ok) throw new Error('Lỗi khi làm mới bạn bè');
        const friendsData = await friendsRes.json();
        setFriends(friendsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        const suggestionsRes = await fetch(`http://localhost:8080/friendships/suggestions/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!suggestionsRes.ok) throw new Error('Lỗi khi làm mới gợi ý');
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData.map(u => ({
          id: u.id,
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl),
          mutualFriends: 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể hủy kết bạn');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Chặn user
  const handleBlock = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/friendships/${friendshipId}/block`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        toast.success('Đã chặn user!');
        const friendsRes = await fetch(`http://localhost:8080/friendships/status/ACCEPTED?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!friendsRes.ok) throw new Error('Lỗi khi làm mới bạn bè');
        const friendsData = await friendsRes.json();
        setFriends(friendsData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        const blockedRes = await fetch(`http://localhost:8080/friendships/status/BLOCKED?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!blockedRes.ok) throw new Error('Lỗi khi làm mới danh sách chặn');
        const blockedData = await blockedRes.json();
        setBlockedFriends(blockedData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể chặn user');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Bỏ chặn
  const handleUnblock = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/friendships/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        toast.success('Đã bỏ chặn user!');
        const blockedRes = await fetch(`http://localhost:8080/friendships/status/BLOCKED?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!blockedRes.ok) throw new Error('Lỗi khi làm mới danh sách chặn');
        const blockedData = await blockedRes.json();
        setBlockedFriends(blockedData.map(f => ({
          id: f.id,
          username: f.user1.id === parseInt(currentUserId) ? f.user2.username : f.user1.username,
          avatarUrl: getAvatarUrl(f.user1.id === parseInt(currentUserId) ? f.user2.avatarUrl : f.user1.avatarUrl),
          mutualFriends: f.mutualFriends || 0
        })));

        const suggestionsRes = await fetch(`http://localhost:8080/friendships/suggestions/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        if (!suggestionsRes.ok) throw new Error('Lỗi khi làm mới gợi ý');
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData.map(u => ({
          id: u.id,
          username: u.username,
          avatarUrl: getAvatarUrl(u.avatarUrl),
          mutualFriends: 0
        })));
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Không thể bỏ chặn');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // Kết hợp friends và suggestions cho tìm kiếm
  const combinedSearchData = [
    ...friends.map(f => ({ ...f, isFriend: true })),
    ...suggestions.map(s => ({ ...s, isFriend: false }))
  ].filter(f => !blockedFriends.some(b => b.username === f.username));

  const searchResults = combinedSearchData.filter((f) =>
    f.username.toLowerCase().includes(homeSearch.toLowerCase())
  );

  const visibleSuggestions = showMoreSuggestions ? suggestions : suggestions.slice(0, 8);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <ToastContainer />
      {error && <div className="text-red-500 text-center p-2">{error}</div>}
      {isLoading && <div className="text-center p-4">Đang tải...</div>}
      <div className="flex flex-1 pt-[0px] overflow-hidden bg-gray-100">
        <Sidebar selected={tab} onSelect={setTab} />
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "Trang chủ" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {homeSearch ? "Kết quả tìm kiếm" : "Gợi ý kết bạn"}
              </h2>
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded mb-4"
              />
              {homeSearch && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {searchResults.length > 0 ? (
                      searchResults.map((f) => (
                        <FriendCardSimple
                          key={f.id}
                          {...f}
                          onAddFriend={handleAddFriend}
                          onBlock={handleBlock}
                          onUnfriend={handleUnfriend}
                        />
                      ))
                    ) : (
                      <div className="text-gray-500 italic">Không tìm thấy kết quả.</div>
                    )}
                  </div>
                  <div className="w-full h-px bg-gray-300 my-4"></div>
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">Gợi ý kết bạn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleSuggestions.map((f) => (
                  <FriendCardSimple
                    key={f.id}
                    {...f}
                    isFriend={false}
                    onAddFriend={handleAddFriend}
                    onBlock={handleBlock}
                    onUnfriend={handleUnfriend}
                  />
                ))}
              </div>
              {suggestions.length > 8 && (
                <div className="text-center mt-4">
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
                  >
                    {showMoreSuggestions ? "Ẩn bớt" : "Xem tất cả"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "Lời mời kết bạn" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Lời mời kết bạn</h1>
              <input
                type="text"
                placeholder="Tìm kiếm lời mời..."
                value={friendRequestSearch}
                onChange={(e) => setFriendRequestSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded mb-4"
              />
              <ScrollArea className="h-full pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {friendRequests
                    .filter((f) => f.username.toLowerCase().includes(friendRequestSearch.toLowerCase()))
                    .map((f) => (
                      <FriendCard
                        key={f.id}
                        {...f}
                        onAccept={handleAccept}
                        onDelete={handleDelete}
                      />
                    ))}
                  {friendRequests.length === 0 && (
                    <div className="text-gray-500 italic">Không có lời mời kết bạn.</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {tab === "Tất cả bạn bè" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Tất cả bạn bè</h1>
              <input
                type="text"
                placeholder="Tìm kiếm bạn bè..."
                value={allFriendsSearch}
                onChange={(e) => setAllFriendsSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded mb-4"
              />
              <ScrollArea className="h-full pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {friends
                    .filter((f) => f.username.toLowerCase().includes(allFriendsSearch.toLowerCase()))
                    .map((f) => (
                      <FriendCardSimple
                        key={f.id}
                        {...f}
                        isFriend={true}
                        onAddFriend={handleAddFriend}
                        onBlock={handleBlock}
                        onUnfriend={handleUnfriend}
                      />
                    ))}
                  {friends.length === 0 && (
                    <div className="text-gray-500 italic">Không có bạn bè nào.</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {tab === "Đã chặn" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Danh sách chặn</h1>
              <input
                type="text"
                placeholder="Tìm kiếm bạn bị chặn..."
                value={blockedSearch}
                onChange={(e) => setBlockedSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded mb-4"
              />
              <ScrollArea className="h-full pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {blockedFriends
                    .filter((f) => f.username.toLowerCase().includes(blockedSearch.toLowerCase()))
                    .map((f) => (
                      <BlockedFriendCard
                        key={f.id}
                        {...f}
                        onUnblock={handleUnblock}
                      />
                    ))}
                  {blockedFriends.length === 0 && (
                    <div className="text-gray-500 italic">Không có ai trong danh sách chặn.</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}