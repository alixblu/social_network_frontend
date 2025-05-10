import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent } from "../../components/ui/card";
import { UserIcon, UsersIcon, ListIcon, HomeIcon, MoreVertical } from "lucide-react";
import Header from '../../components/header/header';
import './FriendsPage.css';

const friends = [
  { name: "Bích Trâm", mutual: 1, avatar: "../../../public/images/2.jpg" },
  { name: "Olivia Bùi", mutual: 0, avatar: "../../../public/images/3.jpg" },
  { name: "Hồ Ngọc Điệp", mutual: 24, avatar: "../../../public/images/1.jpg" },
  { name: "Nguyễn Thị Ngọc Bích", mutual: 66, avatar: "../../../public/images/7.jpg" },
  { name: "Thùy Trung", mutual: 16, avatar: "../../../public/images/8.jpg" },
  { name: "Ánh Trúc", mutual: 19, avatar: "../../../public/images/9.jpg" },
];

const allFriendsData = [
  { name: "Huy Nguyễn", mutual: 8, avatar: "/images/4.jpg" },
  { name: "Minh Trần", mutual: 3, avatar: "/images/2.jpg" },
  { name: "Lan Phạm", mutual: 10, avatar: "/images/3.jpg" },
  { name: "Tú Anh", mutual: 0, avatar: "/images/4.jpg" },
  { name: "Nguyễn Dương Duy Khánh", mutual: 5, avatar: "/images/5.jpg" },
  { name: "Hoài Bảo", mutual: 2, avatar: "/images/6.jpg" },
  { name: "Thảo Vy", mutual: 1, avatar: "/images/7.jpg" },
  { name: "Thanh Hằng", mutual: 7, avatar: "/images/8.jpg" },
  { name: "Bảo Châu", mutual: 4, avatar: "/images/9.jpg" },
  { name: "Trung Tín", mutual: 9, avatar: "/images/10.jpg" },
  { name: "Quốc Huy", mutual: 6, avatar: "/images/1.jpg" },
  { name: "Ngọc Hân", mutual: 0, avatar: "/images/2.jpg" },
  { name: "Hải Yến", mutual: 3, avatar: "/images/3.jpg" },
  { name: "Thanh Trúc", mutual: 1, avatar: "/images/2.jpg" },
  { name: "Khánh Linh", mutual: 11, avatar: "/images/9.jpg" },
  { name: "Anh Dũng", mutual: 5, avatar: "/images/4.jpg" },
];

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

const FriendCard = ({ name, mutual, avatar }) => (
  <Card className="w-60">
    <CardContent className="p-4 text-center">
      <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-2" />
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-500 min-h-[1.25rem]">
        {mutual > 0 ? `${mutual} bạn chung` : <span> </span>}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="friend-action confirm">Xác nhận</button>
        <button className="friend-action delete">Xóa</button>
      </div>
    </CardContent>
  </Card>
);

const FriendCardSimple = ({ name, mutual, avatar, onBlock }) => {
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
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-2" />
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500 min-h-[1.25rem]">
          {mutual > 0 ? `${mutual} bạn chung` : <span> </span>}
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
            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">❌ Xóa kết bạn với {name}</button>
            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">🚫 Hủy theo dõi {name}</button>
            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">💬 Nhắn tin cho {name}</button>
            <button
              onClick={() => onBlock({ name, avatar })}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-red-600 text-left"
            >⛔ Chặn {name}</button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BlockedFriendCard = ({ name, avatar, onUnblock }) => (
  <Card className="w-60">
    <CardContent className="p-4 text-center">
      <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-2" />
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-500 mb-2">⛔ Đã bị chặn</div>
      <button
        onClick={() => onUnblock(name)}
        className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
      >
        🔓 Bỏ chặn
      </button>
    </CardContent>
  </Card>
);

const NonfriendCard = ({ name, mutual, avatar, onAddFriend }) => (
  <Card className="w-60">
    <CardContent className="p-4 text-center">
      <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-2" />
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-500 min-h-[1.25rem]">
        {mutual > 0 ? `${mutual} bạn chung` : <span> </span>}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button onClick={onAddFriend} className="friend-action confirm">Thêm bạn</button>
      </div>
    </CardContent>
  </Card>
);

export default function FriendsPage() {
  const [tab, setTab] = useState("Trang chủ");
  const [homeSearch, setHomeSearch] = useState("");
  const [friendRequestSearch, setFriendRequestSearch] = useState("");
  const [allFriendsSearch, setAllFriendsSearch] = useState("");
  const [blockedSearch, setBlockedSearch] = useState("");
  const [blockedFriends, setBlockedFriends] = useState([]);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);

  const handleBlock = (friend) => {
    setBlockedFriends((prev) => [...prev, friend]);
  };

  const handleUnblock = (name) => {
    setBlockedFriends((prev) => prev.filter((f) => f.name !== name));
  };

  const handleAddFriend = (friend) => {
    console.log(`Thêm bạn: ${friend.name}`);
  };

  const visibleFriends = allFriendsData.filter(
    (f) => !blockedFriends.some((b) => b.name === f.name)
  );

  const filteredBlockedFriends = blockedFriends.filter((f) =>
    f.name.toLowerCase().includes(blockedSearch.toLowerCase())
  );

  const suggestions = allFriendsData.filter(
    (f) =>
      !blockedFriends.some((b) => b.name === f.name) &&
      !friends.some((fr) => fr.name === f.name)
  );

  const visibleSuggestions = showMoreSuggestions
    ? suggestions
    : suggestions.slice(0, 8);

  const searchResults = allFriendsData.filter((f) =>
    f.name.toLowerCase().includes(homeSearch.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
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
                        <NonfriendCard
                          key={f.name}
                          {...f}
                          onAddFriend={() => handleAddFriend(f)}
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
                  <NonfriendCard
                    key={f.name}
                    {...f}
                    onAddFriend={() => handleAddFriend(f)}
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
                  {friends
                    .filter((f) => f.name.toLowerCase().includes(friendRequestSearch.toLowerCase()))
                    .map((f) => (
                      <FriendCard key={f.name} {...f} />
                    ))}
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
                  {visibleFriends
                    .filter((f) => f.name.toLowerCase().includes(allFriendsSearch.toLowerCase()))
                    .map((f) => (
                      <FriendCardSimple key={f.name} {...f} onBlock={handleBlock} />
                    ))}
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
                  {filteredBlockedFriends.map((f) => (
                    <BlockedFriendCard key={f.name} {...f} onUnblock={handleUnblock} />
                  ))}
                  {filteredBlockedFriends.length === 0 && (
                    <div className="text-gray-500 italic">Không tìm thấy kết quả.</div>
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