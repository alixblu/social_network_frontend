import React, { useState } from 'react';
import { PhotoLibrary, Clear } from "@mui/icons-material";
import axios from 'axios'; 

function PopupPost({ onClose, userInfo }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState('1');
  const [content, setContent] = useState("");

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  const currentTypes = selectedFiles.map(f => f.type);

  const newFiles = [];

  files.forEach(file => {
    const previewUrl = URL.createObjectURL(file);
    let type = null;
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("video/")) type = "video";
    else if (file.type.startsWith("audio/")) type = "audio";

    // Kiểm tra nếu đã tồn tại file loại đó thì không thêm
    if (!currentTypes.includes(type)) {
      newFiles.push({ file, previewUrl, type });
    }
    if (currentTypes.includes(type)) {
      alert(`Chỉ được chọn một ${type === 'image' ? 'ảnh' : type === 'video' ? 'video' : 'âm thanh'}!`);
    }

  });

  setSelectedFiles(prev => [...prev, ...newFiles]);
};


  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };


  const eventPost = async () => {
    if (!content.trim() && selectedFiles.length === 0) {
      alert("Vui lòng nhập nội dung hoặc chọn tệp để đăng bài.");
      return;
    }

    const formData = new FormData();
    
    console.log(selectedFiles)
    selectedFiles.forEach((item) => {
      formData.append("media", item.file);
    });
    formData.append("content", content);
    formData.append("userId", userInfo.id);
    console.log("Dữ liệu sẽ gửi:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post("http://localhost:8080/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(response.data.message || "Đăng bài thành công!");
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi đăng bài.";
      alert(errorMsg);
    }

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
            <select className="p-1 rounded bg-gray-300 border-none outline-none" onChange={(e) => setStatus(e.target.value)} value={status}>
              <option value="1">Công khai</option>
              <option value="0">Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <textarea
            placeholder="Bạn đang nghĩ gì thế?"
            className="w-full min-h-[60px] p-2 border-none outline-none text-sm resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Xem trước tất cả file */}
        <div className="grid grid-cols-2 gap-3 mt-3 max-h-60 overflow-y-auto">
          {selectedFiles.map((item, index) => (
            <div key={index} className="relative border rounded-md p-2 flex justify-center items-center">
              {item.type === "image" && (
                <img src={item.previewUrl} alt="preview" className="max-h-32 max-w-full object-contain" />
              )}
              {item.type === "video" && (
                <video controls className="max-h-32 max-w-full object-contain">
                  <source src={item.previewUrl} type="video/mp4" />
                </video>
              )}
              {item.type === "audio" && (
                <audio controls className="w-full">
                  <source src={item.previewUrl} type="audio/mp3" />
                </audio>
              )}
              <button
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                onClick={() => removeFile(index)}
              >
                Xoá
              </button>
            </div>
          ))}
        </div>

        {/* Nút chọn file */}
        <div className="flex justify-center items-center py-2 mt-3">
          <label htmlFor="upload-files" className="flex items-center cursor-pointer">
            <div className="text-green-600 text-xl mr-1"><PhotoLibrary /></div>
            <span>Chọn ảnh / video / âm thanh</span>
          </label>
          <input
            id="upload-files"
            type="file"
            accept="image/*,video/mp4,audio/mp3"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button className="w-full text-center bg-blue-600 text-white text-lg py-2 rounded-md mt-2" onClick={eventPost}>
          Đăng
        </button>
      </div>
    </div>
  );
}

export default PopupPost;
