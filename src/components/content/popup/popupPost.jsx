import React, { useState } from 'react';
import {
  PhotoLibrary,
  Clear
} from "@mui/icons-material";

function PopupPost({ onClose, userInfo }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('1');
  const [content, setContent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
    }
  };

  function eventPost() {
    if (!content.trim() && !selectedFile) {
      alert("Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài.");
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[533px] bg-white rounded-lg shadow-lg p-5 relative">
        <Clear className="absolute top-5 right-2 cursor-pointer text-gray-500" onClick={onClose} />
        <div className="text-center text-lg border-b border-gray-300 mb-2 pb-2">Tạo bài viết</div>

        <div className="flex items-center">
          <img src={`http://localhost:8080/images/${userInfo.avatarUrl}`} className="w-10 h-10 rounded-full" alt="User Avatar" />
          <div className="flex flex-col ml-2">
            <div className="font-bold">{userInfo.username}</div>
            <select className="p-1 rounded bg-gray-300 border-none outline-none" onChange={(e) => { setStatus(e.target.value) }}>
              <option value="1">Công khai</option>
              <option value="0">Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <textarea placeholder="Bạn đang nghĩ gì thế?"
            className="w-full min-h-[60px] p-2 border-none outline-none text-sm resize-none"
            onChange={(e) => { setContent(e.target.value) }}>
          </textarea>
        </div>

        {/* Ảnh xem trước */}
        <div className="w-full h-48 border border-gray-400 flex items-center justify-center">
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-gray-400">Chưa chọn ảnh</span>
          )}
        </div>

        {/* Nút chọn ảnh */}
        <div className="flex justify-center items-center py-2 mt-2">
          <label htmlFor="upload-photo" className="flex items-center cursor-pointer">
            <div className="text-green-600 text-xl mr-1"><PhotoLibrary /></div>
            <span>Ảnh/Video</span>
          </label>
          <input id="upload-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <button className="w-full text-center bg-blue-600 text-white text-lg py-2 rounded-md" onClick={eventPost}>Đăng</button>
      </div>
    </div>
  );
}

export default PopupPost;