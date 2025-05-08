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




export function getPostItem(post) {
    const postUser = post.user;

    return (
        <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
            {/* Post Header */}
            <div className="post-info">
                <div className="info-container">
                    <img src={`http://localhost:8080/images/${postUser.avatarUrl}`} className="info-compoment-image" alt="User" />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <span className="info-compoment-user">{postUser.username}</span>
                        <span style={{ fontSize: "12px" }}>{post.time}</span>
                    </div>
                </div>
                <div className="info-compoment-delete"><Clear /></div>
            </div>

            {/* Post Content */}
            <div className='post-content'>{post.content}</div>

            {/* Post Image */}
            {post.imageUrl && (
                <div style={{ display: "flex", boxSizing: "border-box", cursor: 'pointer' }}>
                    <img src={`http://localhost:8080/images/${post.imageUrl}`} alt="Post" />
                </div>
            )}

            {/* Reactions */}
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

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0', paddingBottom: '10px' }}>
                    <div><span><Recommend /></span><span>Thích</span></div>
                    <div><span><ModeComment /></span><span>Bình luận</span></div>
                    <div><span><Send /></span><span>Chia sẻ</span></div>
                </div>
            </div>

            {/* Bình luận */}
            <div className="post-comments" style={{ padding: '10px 15px' }}>
                {post.comments && post.comments.map((cmt, index) => (
                    <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                        <div style={{ fontWeight: 'bold' }}>{cmt.username}</div>
                        <div style={{ fontSize: '14px' }}>{cmt.text}</div>
                    </div>
                ))}

                {/* Nhập bình luận */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            borderRadius: '20px',
                            border: '1px solid #ccc',
                            outline: 'none'
                        }}
                    />
                    <Send style={{ marginLeft: '8px', cursor: 'pointer', color: '#1976d2' }} />
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
    

    const p = [
        {
            id: 1,
            content: "Hôm nay trời đẹp quá, đi dạo thôi!",
            time: "2025-05-08T09:30:00",
            imageUrl: "default-avatar.png",
            user: {
                id: 101,
                username: "Trần Hoài Nam",
                avatarUrl: "default-avatar.png"
            },
            comments: [
                { username: "Nguyễn Văn A", text: "Bài viết hay quá!" },
                { username: "Lê Thị B", text: "Đồng ý với bạn!" }
            ]
            
        },
        {
            id: 2,
            content: "Đã hoàn thành xong dự án lớn 💪",
            time: "2025-05-07T14:10:00",
            imageUrl: "default-avatar.png",
            user: {
                id: 102,
                username: "Lê Thị Minh",
                avatarUrl: "default-avatar.png"
            },
            comments: [
                { username: "Nguyễn Văn A", text: "Bài viết hay quá!" },
                { username: "Lê Thị B", text: "Đồng ý với bạn!" }
            ]
        },
        {
            id: 3,
            content: "Mọi người có quán cà phê nào yên tĩnh để học không?",
            time: "2025-05-06T17:45:00",
            imageUrl: "default-avatar.png",
            user: {
                id: 103,
                username: "Nguyễn Văn Hùng",
                avatarUrl: "default-avatar.png"
            },
            comments: [
                { username: "Nguyễn Văn A", text: "Bài viết hay quá!" },
                { username: "Lê Thị B", text: "Đồng ý với bạn!" }
            ]
        }
        
    ];
    
    // const [posts, setPosts] = useState([]);

    // useEffect(() => {
    //     axios.get("http://localhost:8080/posts") // endpoint giả định
    //         .then(res => {
    //             setPosts(res.data); // danh sách post, mỗi post có post.user
    //         })
    //         .catch(err => console.error("Lỗi lấy bài viết:", err));
    // }, []);


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
                            <img src={`http://localhost:8080/images/${userInfo.avatarUrl}`}className='w-[45px] h-[45px] rounded-full' alt="User Avatar" />
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


                {/* Chỗ này là lấy danh sách bào post từ backend để hiển thị lên màn hình */}
                <div className="list-post" style={{ width: '100%' }}>
                    {[...p]
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