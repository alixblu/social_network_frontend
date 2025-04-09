import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./leftsidebar.css";
import {
  People, Group, History, Bookmark, VideoLibrary, Storefront,
  Chat, Settings, SportsEsports, ExpandMore, ExpandLess,
  Campaign, ShoppingCart, Event, BusinessCenter, Science, SmartToy
} from "@mui/icons-material";

function LeftSidebar() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMoreShortcuts, setShowMoreShortcuts] = useState(false);

  const menuItems = [
    { icon: <People />, label: "Bạn bè", path: "/friends" },
    { icon: <Group />, label: "Nhóm" },
    { icon: <History />, label: "Kỷ niệm" },
    { icon: <Bookmark />, label: "Đã lưu" },
    { icon: <VideoLibrary />, label: "Video" },
    { icon: <Storefront />, label: "Marketplace" },
  ];

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

  const shortcutItems = [
    { label: "Pokemoviet", icon: "🎥" },
    { label: "SGU - HCI - 012025", icon: "🏫" },
    { label: "ĐỀ THI KHOA CNTT SGU", icon: "📄" },
    { label: "Cộng đồng Sinh viên SGU", icon: "👥" },
    { label: "UNO", icon: "🎮" },
  ];

  const hiddenShortcuts = [
    { label: "Nhóm học tập", icon: "📚" },
    { label: "Câu lạc bộ lập trình", icon: "💻" },
  ];

  return (
    <div className="leftsidebar">
      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                {item.icon} {item.label}
              </NavLink>
            ) : (
              <span>{item.icon} {item.label}</span>
            )}
          </li>
        ))}

        {showMoreMenu &&
          hiddenItems.map((item, index) => (
            <li key={index + menuItems.length}>
              <span>{item.icon} {item.label}</span>
            </li>
          ))}

        <li className="see-more" onClick={() => setShowMoreMenu(!showMoreMenu)}>
          {showMoreMenu ? <ExpandLess /> : <ExpandMore />} {showMoreMenu ? "Ẩn bớt" : "Xem thêm"}
        </li>
      </ul>

      <div className="shortcuts">
        <h4>Lối tắt của bạn</h4>
        <ul>
          {shortcutItems.map((shortcut, index) => (
            <li key={index}>{shortcut.icon} {shortcut.label}</li>
          ))}
          {showMoreShortcuts &&
            hiddenShortcuts.map((shortcut, index) => (
              <li key={index + shortcutItems.length}>{shortcut.icon} {shortcut.label}</li>
            ))}
          <li className="see-more" onClick={() => setShowMoreShortcuts(!showMoreShortcuts)}>
            {showMoreShortcuts ? <ExpandLess /> : <ExpandMore />} {showMoreShortcuts ? "Ẩn bớt" : "Xem thêm"}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
