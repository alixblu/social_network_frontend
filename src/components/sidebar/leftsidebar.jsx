import React from "react";
import "./leftsidebar.css";
import { Home, Group, Storefront, Chat, Settings, VideoLibrary, Bookmark, People, History, SportsEsports } from "@mui/icons-material";

function LeftSidebar() {
  return (
    <div className="leftsidebar">
      <ul className="menu">
        <li><Home /> Trang chủ</li>
        <li><People /> Bạn bè</li>
        <li><Group /> Nhóm</li>
        <li><History /> Kỷ niệm</li>
        <li><Bookmark /> Đã lưu</li>
        <li><VideoLibrary /> Video</li>
        <li><Storefront /> Marketplace</li>
        <li><Chat /> Tin nhắn</li>
        <li><Settings /> Cài đặt</li>
        <li><SportsEsports /> Chơi game</li>
      </ul>
    </div>
  );
}

export default LeftSidebar;
