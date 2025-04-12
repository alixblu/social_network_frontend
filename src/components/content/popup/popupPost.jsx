import React from 'react';
import '../popup/popupPost.css'
import {
  PhotoLibrary,
  Clear,Recommend, FavoriteBorder,ModeComment,Send
} from "@mui/icons-material";

function poupPost({ onClose }) {

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // lớp nền mờ
        zIndex: 9999, // nổi lên trên cùng
      }}
    >
      <div className="popup-container">
        <Clear style={{position: 'absolute',top: '20px',right: '10px',cursor: 'pointer',color: '#555'}} onClick={onClose}/>
        <div style={{width:'100%', textAlign:'center', fontSize:'20px', borderBottom: '1px rgb(202 199 199) solid', marginBottom:'10px', paddingBottom:"10px"}}>Tạo bài viết</div>
        
        <div style={{display:'flex',alignItems:'center'}}>
          <img src="./src/assets/4.jpg" style={{width:'40px', height:'40px', borderRadius:'50%'}}/>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', marginLeft:"10px"}}>
            <div style={{ fontWeight: 'bold' }}>Đàm Khả Di</div>
            <select style={{ padding: '5px', borderRadius: '5px',backgroundColor:"rgb(202 199 199)",border: 'none',outline: 'none' }}>
              <option value="public">Công khai</option>
              <option value="friends">Bạn bè</option>
              <option value="private">Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <div style={{marginTop:'20px'}}>
          <textarea placeholder="Bạn đang nghĩ gì thế?"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '10px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              resize: 'none',          // Không cho resize bằng chuột
              whiteSpace: 'pre-wrap',  // Giữ dấu xuống dòng và tự xuống dòng
              overflowWrap: 'break-word',
            }}>

          </textarea>
        </div>
        
        {/** layout dùng để khi thêm ảnh */}
        <div style={{width:"100%",height:"200px", border:"1px rgb(155, 152, 152) solid"}}>

        </div>
        
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'10px 0', margin:"10px 0"}}>
          <div style={{color:'green', fontSize:'large', marginRight:'5px'}}><PhotoLibrary/></div>
          <span>Ảnh/Video</span>
        </div>

        <button style={{width:"100%", textAlign:"center", backgroundColor:"rgb(13, 113, 233)", fontSize:"18px", padding:"5px 0", borderRadius:"8px"}}>Đăng</button>
      </div>

     
    </div>  
  )
}

export default poupPost