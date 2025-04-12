import React, { useState } from 'react';
import '../content/contentArea.css'
import PopupPost from '../../components/content/popup/popupPost'
import {
    PhotoLibrary,
    Clear,Recommend, FavoriteBorder,ModeComment,Send
} from "@mui/icons-material";

export const posts = [];
export const user = {
  
  id:1,
  name:'Trần Hoài Nam',
  list_post: posts

}

export function getPostItem (post){
  return(
      <div style={{backgroundColor:'white', borderRadius:'10px', marginBottom:'20px'}}>
          <div className="post-info">
            <div className="info-container">
              <img src="./src/assets/4.jpg" className="info-compoment-image"/>
              <div style={{display:'flex', flexDirection:'column', marginLeft:'10px'}}>
                <span className="info-compoment-user">{user.name}</span>
                <span style={{fontSize:"12px"}}>{post.time}</span>
              </div>
            </div>
            <div className="info-compoment-delete"><Clear/></div>
          </div>

          <div className='post-content'>
            {post.content}
          </div>

  

          <div style={{display:"flex", boxSizing:"border-box", cursor:'pointer'}}>
            <div style={{border:"4px white solid", boxSizing:"border-box", borderLeft:'0px'}}>
              <img src="./src/assets/1.png"/>
            </div>
            {/*
            <div style={{display:"flex", alignItems:"center", flexDirection:'column', boxSizing:"border-box"}}>
              <div style={{borderBottom:"4px white solid", borderTop:"4px white solid"}}><img src="./src/assets/2.jpg" alt="" /></div>
              <div style={{borderBottom:"4px white solid"}}><img src="./src/assets/3.jpg" alt="" /></div>
              <div class="image-wrapper">
                <img src="./src/assets/4.jpg" alt="" />
                <div class="overlay">
                  <span class="overlay-text">+9</span>
                </div>
              </div>
            </div>*/}
          </div>


          <div>
            <div style={{display:'flex', justifyContent:'space-between', margin:"0 10px",padding:'10px 0', alignItems:'center', borderBottom:'1px rgb(202 199 199) solid'}}>
              <div>
                <span><Recommend/></span>
                <span><FavoriteBorder/></span>
                <span style={{marginLeft:'3px'}}>99</span>
              </div>

              <div>
                <span style={{marginRight:'2px'}}>11</span>
                <span style={{marginRight:'10px'}}><ModeComment/></span>
                <span style={{marginRight:'2px'}}>2</span>
                <span><Send/></span>
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'space-around', margin:'10px 0', paddingBottom:'10px'}}>
              <div>
                <span><Recommend/></span>
                <span>Thích</span>
              </div>

              <div>
                <span><ModeComment/></span>
                <span>Bình luận</span>
              </div>

              <div>
                <span><Send/></span>
                <span>Chia sẻ</span>
              </div>
            </div>
          </div>
      </div>
  )
}


function contentArea (){

  const [showPopup, setShowPopup] = useState(false);
  const handleTextAreaClick = () => {
      setShowPopup(true)
  };


    return (
        <div className="content-area">
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{width:'100%'}}>

                <div style={{width:'100%', backgroundColor:'white', borderRadius:'10px'}}>
                <div  className="container-question">
                    <img src="./src/assets/4.jpg" style={{width:'45px', height:'45px', borderRadius:'50%'}}/>
                    <span className="text-area" onClick={handleTextAreaClick}>
                        Hoài Nam ơi, bạn đang nghĩ gì thế?
                    </span>
                </div>
                
                <div className="div-anh-video" onClick={handleTextAreaClick}> 
                    <div style={{color:'green', fontSize:'large', marginRight:'5px'}}><PhotoLibrary/></div>
                    <span>Ảnh/Video</span>
                </div>
                </div>
            </div>

            <div className="list-post" style={{width:'100%'}}>
              {[...user.list_post]
                .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sắp xếp mới nhất lên đầu
                .map((post) => getPostItem(post))
              }
            </div>

          </div>
          
          {showPopup && (
              <div>
                <PopupPost onClose={() => setShowPopup(false)}/>
              </div>
          )}
        </div>

    )
}
export default contentArea