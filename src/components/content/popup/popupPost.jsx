import React, { useState } from 'react';
import '../popup/popupPost.css';
import {
  PhotoLibrary,
  Clear, Recommend, FavoriteBorder, ModeComment, Send
} from "@mui/icons-material";

import {posts} from '../contentArea'
import {user} from '../contentArea'

function PopupPost({ onClose }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('1')
  const [content, setcontent] = useState("")

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
    
    const count_post = posts.length + 1;
    const post = {
      id_post:count_post,
      id_user:user.id,
      content: content,
      img: selectedFile?.name || "",
      time: new Date().toLocaleString(),
      state: status,
    };
  
    posts.push(post);
    console.log(posts);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
    >
      <div className="popup-container">
        <Clear style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer', color: '#555' }} onClick={onClose} />
        <div style={{ width: '100%', textAlign: 'center', fontSize: '20px', borderBottom: '1px rgb(202 199 199) solid', marginBottom: '10px', paddingBottom: "10px" }}>Tạo bài viết</div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="./src/assets/2.jpg" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: "10px" }}>
            <div style={{ fontWeight: 'bold' }}>Đàm Khả Di</div>
            <select style={{ padding: '5px', borderRadius: '5px', backgroundColor: "rgb(202 199 199)", border: 'none', outline: 'none' }}
              onChange={(e)=>{setStatus(e.target.value)}}
            >
              <option value="1">Công khai</option>
              <option value="0">Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <textarea placeholder="Bạn đang nghĩ gì thế?"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '10px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              resize: 'none',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
            }} onChange={(e)=>{setcontent(e.target.value)}}>
          </textarea>
        </div>

        {/* Ảnh xem trước */}
        <div style={{ width: "100%", height: "200px", border: "1px rgb(155, 152, 152) solid", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {imagePreview ? (
            <img src={imagePreview} alt="preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ color: '#999' }}>Chưa chọn ảnh</span>
          )}
        </div>

        {/* Nút chọn ảnh */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', margin: "10px 0" }}>
          <label htmlFor="upload-photo" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ color: 'green', fontSize: 'large', marginRight: '5px' }}><PhotoLibrary /></div>
            <span>Ảnh/Video</span>
          </label>
          <input id="upload-photo" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        <button style={{ width: "100%", textAlign: "center", backgroundColor: "rgb(13, 113, 233)", fontSize: "18px", padding: "5px 0", borderRadius: "8px", color: 'white', border: 'none' }} onClick={eventPost}>Đăng</button>
      </div>
    </div>
  )
}
export default PopupPost;
