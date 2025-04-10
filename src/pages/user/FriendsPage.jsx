import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent } from "../../components/ui/card";
import { UserIcon, UsersIcon, GiftIcon, ListIcon, HomeIcon, MoreVertical } from "lucide-react";
import Header from '../../components/header/header';
import './FriendsPage.css';

const friends = [
  {
    name: "Bích Trâm",
    mutual: 1,
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Olivia Bùi",
    mutual: 0,
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Hồ Ngọc Điệp",
    mutual: 24,
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Nguyễn Thị Ngọc Bích",
    mutual: 66,
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Thùy Trung",
    mutual: 16,
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Ánh Trúc",
    mutual: 19,
    avatar: "https://via.placeholder.com/100",
  },
];

const allFriends = [
  { name: "Huy Nguyễn", mutual: 8, avatar: "https://via.placeholder.com/100" },
  { name: "Minh Trần", mutual: 3, avatar: "https://via.placeholder.com/100" },
  { name: "Lan Phạm", mutual: 10, avatar: "https://via.placeholder.com/100" },
  { name: "Tú Anh", mutual: 0, avatar: "https://via.placeholder.com/100" },
  { name: "Duy Khánh", mutual: 5, avatar: "https://via.placeholder.com/100" },
  { name: "Hoài Bảo", mutual: 2, avatar: "https://via.placeholder.com/100" },
  { name: "Thảo Vy", mutual: 1, avatar: "https://via.placeholder.com/100" },
  { name: "Thanh Hằng", mutual: 7, avatar: "https://via.placeholder.com/100" },
  { name: "Bảo Châu", mutual: 4, avatar: "https://via.placeholder.com/100" },
  { name: "Trung Tín", mutual: 9, avatar: "https://via.placeholder.com/100" },
  { name: "Quốc Huy", mutual: 6, avatar: "https://via.placeholder.com/100" },
  { name: "Ngọc Hân", mutual: 0, avatar: "https://via.placeholder.com/100" },
  { name: "Hải Yến", mutual: 3, avatar: "https://via.placeholder.com/100" },
  { name: "Thanh Trúc", mutual: 1, avatar: "https://via.placeholder.com/100" },
  { name: "Khánh Linh", mutual: 11, avatar: "https://via.placeholder.com/100" },
  { name: "Anh Dũng", mutual: 5, avatar: "https://via.placeholder.com/100" },
];

const Sidebar = ({ selected, onSelect }) => {
  const items = [
    { icon: <HomeIcon className="mr-2" />, label: "Trang chủ" },
    { icon: <UserIcon className="mr-2" />, label: "Lời mời kết bạn" },
    { icon: <UsersIcon className="mr-2" />, label: "Tất cả bạn bè" },
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
        {mutual > 0 ? `${mutual} bạn chung` : <span>&nbsp;</span>}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="friend-action confirm">Xác nhận</button>
        <button className="friend-action delete">Xóa</button>
      </div>
    </CardContent>
  </Card>
);

const FriendCardSimple = ({ name, mutual, avatar }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="w-60 relative">
      <CardContent className="p-4 text-center">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-2" />
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500 min-h-[1.25rem]">
          {mutual > 0 ? `${mutual} bạn chung` : <span>&nbsp;</span>}
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <MoreVertical />
        </button>
        {showMenu && (
          <div className="absolute top-10 right-2 bg-white border rounded shadow-lg z-10 text-left text-sm w-48">
            <button className="block w-full px-4 py-2 hover:bg-gray-100">❌ Xóa kết bạn với {name}</button>
            <button className="block w-full px-4 py-2 hover:bg-gray-100">🚫 Hủy theo dõi {name}</button>
            <button className="block w-full px-4 py-2 hover:bg-gray-100">💬 Nhắn tin cho {name}</button>
            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-red-600">⛔ Chặn {name}</button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function FriendsPage() {
  const [tab, setTab] = useState("Trang chủ");
  const [search, setSearch] = useState("");
  const [menuFriend, setMenuFriend] = useState(null);

  return (
    <div className="app-container flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 bg-gray-100 mt-[56px]">
        <Sidebar selected={tab} onSelect={setTab} />
        <div className="flex-1 p-6 overflow-y-auto">
          {tab === "Trang chủ" && <h1 className="text-2xl font-bold">Trang chủ bạn bè</h1>}

          {tab === "Lời mời kết bạn" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Lời mời kết bạn</h1>
              <ScrollArea className="h-[calc(100vh-160px)] pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {friends.map((f) => (
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded mb-4"
              />
              <ScrollArea className="h-[calc(100vh-200px)] pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allFriends
                    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
                    .map((f) => (
                      <FriendCardSimple key={f.name} {...f} />
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {tab !== "Trang chủ" && tab !== "Lời mời kết bạn" && tab !== "Tất cả bạn bè" && (
            <div className="text-lg text-gray-600">Tính năng "{tab}" đang được cập nhật...</div>
          )}
        </div>
      </div>
    </div>
  );
}
