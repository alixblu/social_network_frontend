import React, { useState } from "react";
import "./leftsidebar.css";
import {
  Home, People, Group, History, Bookmark, VideoLibrary, Storefront,
  Chat, Settings, SportsEsports, ExpandMore, ExpandLess,
  Campaign, ShoppingCart, Event, BusinessCenter, Science, SmartToy
} from "@mui/icons-material";

function LeftSidebar() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMoreShortcuts, setShowMoreShortcuts] = useState(false);

  // Danh sách chính
  const menuItems = [
    { icon: <Home />, label: "Trang chủ" },
    { icon: <People />, label: "Bạn bè" },
    { icon: <Group />, label: "Nhóm" },
    { icon: <History />, label: "Kỷ niệm" },
    { icon: <Bookmark />, label: "Đã lưu" },
    { icon: <VideoLibrary />, label: "Video" },
    { icon: <Storefront />, label: "Marketplace" },
  ];

  // Danh sách mở rộng
  const hiddenItems = [
    { icon: <Chat />, label: "Tin nhắn" },
    { icon: <Settings />, label: "Cài đặt" },
    { icon: <SportsEsports />, label: "Chơi game" },
    { icon: <Campaign />, label: "Chiến dịch gây quỹ" },
    { icon: <ShoppingCart />, label: "Đơn hàng & thanh toán" },
    { icon: <Event />, label: "Sự kiện" },
    { icon: <BusinessCenter />, label: "Trình quản lý quảng cáo" },
    { icon: <Science />, label: "Trung tâm khoa học khí hậu" },
    { icon: <SmartToy />, label: "Video chơi game" },
  ];

  // Lối tắt chính
  const shortcutItems = [
    { label: "Pokemoviet", icon: "🎥" },
    { label: "SGU - HCI - 012025", icon: "🏫" },
    { label: "ĐỀ THI KHOA CNTT SGU", icon: "📄" },
    { label: "Cộng đồng Sinh viên SGU", icon: "👥" },
    { label: "UNO", icon: "🎮" },
  ];

  // Lối tắt mở rộng
  const hiddenShortcuts = [
    { label: "Nhóm học tập", icon: "📚" },
    { label: "Câu lạc bộ lập trình", icon: "💻" },
  ];

  return (
    <div className="leftsidebar">
      {/* Menu chính */}
      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>{item.icon} {item.label}</li>
        ))}

        {showMoreMenu && hiddenItems.map((item, index) => (
          <li key={index + menuItems.length}>{item.icon} {item.label}</li>
        ))}

        <li className="see-more" onClick={() => setShowMoreMenu(!showMoreMenu)}>
          {showMoreMenu ? <ExpandLess /> : <ExpandMore />} {showMoreMenu ? "Ẩn bớt" : "Xem thêm"}
        </li>
      </ul>

      {/* Lối tắt */}
      <div className="shortcuts">
        <h4>Lối tắt của bạn</h4>
        <ul>
          {shortcutItems.map((shortcut, index) => (
            <li key={index}>{shortcut.icon} {shortcut.label}</li>
          ))}

          {showMoreShortcuts &&
            hiddenShortcuts.map((shortcut, index) => (
              <li key={index + shortcutItems.length}>{shortcut.icon} {shortcut.label}</li>
            ))
          }

          <li className="see-more" onClick={() => setShowMoreShortcuts(!showMoreShortcuts)}>
            {showMoreShortcuts ? <ExpandLess /> : <ExpandMore />} {showMoreShortcuts ? "Ẩn bớt" : "Xem thêm"}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
