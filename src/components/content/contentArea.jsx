import React, { useEffect, useState } from 'react';
import '../content/contentArea.css';
import PopupPost from '../../components/content/popup/popupPost';
import {
    PhotoLibrary,
    Clear,
    Recommend,
    FavoriteBorder,
    ModeComment,
    Send
} from "@mui/icons-material";
import axios from "axios"



export const posts = [];
export const user = {
    id: 1,
    name: 'Trần Hoài Nam',
    list_post: posts
};

export function getPostItem(post) {
    return (
        <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
            <div className="post-info">
                <div className="info-container">
                    <img src="./src/assets/2.jpg" className="info-compoment-image" alt="User" />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <span className="info-compoment-user">{user.name}</span>
                        <span style={{ fontSize: "12px" }}>{post.time}</span>
                    </div>
                </div>
                <div className="info-compoment-delete"><Clear /></div>
            </div>
            <div className='post-content'>
                {post.content}
            </div>
            <div style={{ display: "flex", boxSizing: "border-box", cursor: 'pointer' }}>
                <div>
                    <img src="./src/assets/1.png" alt="Post" />
                </div>
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: "0 10px", padding: '10px 0', alignItems: 'center', borderBottom: '1px rgb(202, 199, 199) solid' }}>
                    <div>
                        <span><Recommend /></span>
                        <span><FavoriteBorder /></span>
                        <span style={{ marginLeft: '3px' }}>99</span>
                    </div>
                    <div>
                        <span style={{ marginRight: '2px' }}>11</span>
                        <span style={{ marginRight: '10px' }}><ModeComment /></span>
                        <span style={{ marginRight: '2px' }}>2</span>
                        <span><Send /></span>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0', paddingBottom: '10px' }}>
                    <div>
                        <span><Recommend /></span>
                        <span>Thích</span>
                    </div>
                    <div>
                        <span><ModeComment /></span>
                        <span>Bình luận</span>
                    </div>
                    <div>
                        <span><Send /></span>
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContentArea() {
    const [showPopup, setShowPopup] = useState(false);
    const handleTextAreaClick = () => {
        setShowPopup(true);
    };

    const [userInfo, setUser] = useState(null);

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem("token"));
        axios.get("http://localhost:8080/users/getUserByToken", {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error("Lỗi lấy thông tin user:", error);
        });
    }, []);
    

    return (
        <div className="content-area">
            <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                }}>
                    {userInfo && (
                        <div className="container-question">
                            <img src={`http://localhost:8080/images/${userInfo.avatarUrl}`} style={{ width: '45px', borderRadius: '50%' }} alt="User Avatar" />
                            <span className="text-area" onClick={handleTextAreaClick}>
                                {userInfo.username} ơi, bạn đang nghĩ gì thế?
                            </span>
                        </div>
                    )}
                    <div className="div-anh-video" onClick={handleTextAreaClick}>
                        <div style={{ color: 'green', fontSize: 'large', marginRight: '5px' }}><PhotoLibrary /></div>
                        <span>Ảnh/Video</span>
                    </div>
                </div>

                <div className="list-post" style={{ width: '100%' }}>
                    {[...user.list_post]
                        .sort((a, b) => new Date(b.time) - new Date(a.time))
                        .map((post) => getPostItem(post))
                    }
                </div>
            </div>

            {showPopup && (
                <PopupPost onClose={() => setShowPopup(false)} userInfo={userInfo} />
            )}
        </div>
    );
}

export default ContentArea;