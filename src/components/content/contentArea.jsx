import React, { useEffect, useState } from 'react';
import '../content/contentArea.css';
import PopupPost from '../../components/content/popup/popupPost';
import {
    PhotoLibrary,
    Clear,
    Recommend,
    ModeComment,
    Send
} from "@mui/icons-material";
import axios from "axios";
import SharePostItem from './SharePostItem';
import PostItem from '../content/PostItem';


function ContentArea() {
    const [showPopup, setShowPopup] = useState(false);
    const [userInfo, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sharePosts, setSharePosts] = useState([]);

    const handleTextAreaClick = () => setShowPopup(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        axios.get("http://localhost:8080/users/getUserByToken", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUser(response.data))
            .catch(error => console.error("Lỗi lấy thông tin user:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/posts")
            .then(res => setPosts(res.data.map(post => ({ ...post, time: post.createdAt, mediaUrls: post.mediaUrls || [], comments: post.comments || [] }))))
            .catch(err => console.error("Lỗi lấy bài viết:", err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/shares")
            .then(res =>{
                    setSharePosts(res.data.map(shared => ({ ...shared, time: shared.sharedAt })))
                    console.log(res.data)
                }
            )
            .catch(err => console.error("Lỗi lấy shared posts:", err));
    }, []);

    const allPosts = [...posts.map(p => ({ type: "post", data: p })), ...sharePosts.map(sp => ({ type: "share", data: sp }))];

    allPosts.sort((a, b) => new Date(b.data.time) - new Date(a.data.time));



    const handleDeleteSuccess = (idToDelete, type) => {
        if (type === "post") {
            // Xóa bài gốc
            console.log(idToDelete)
            setPosts(prev => prev.filter(p => p.id !== idToDelete));
            console.log("trước khi xóa post có share")
            console.log(sharePosts)
            setSharePosts(prev => prev.filter(sp => sp.post.id !== idToDelete));
            console.log("sau khi xóa post có share")
            console.log(sharePosts)

        } else if (type === "share") {
            // Chỉ xóa bản chia sẻ
            setSharePosts(prev => prev.filter(sp => sp.post.id !== idToDelete));
        }
    };





    return (
        <div className="content-area">
            <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className='bg-white p-2 rounded-xl'>
                    {userInfo && (
                        <div className="container-question">
                            <img src={`http://localhost:8080/images/${userInfo.avatarUrl}`} className='w-[45px] h-[45px] rounded-full' alt="User Avatar" />
                            <span className="text-area" onClick={handleTextAreaClick}>{userInfo.username} ơi, bạn đang nghĩ gì thế?</span>
                        </div>
                    )}

                    <div className="div-anh-video" onClick={handleTextAreaClick}>
                        <div style={{ color: 'green', fontSize: 'large', marginRight: '5px' }}><PhotoLibrary /></div>
                        <span>Ảnh/Video</span>
                    </div>
                </div>
                

                {userInfo && (
                    <div className="list-post" style={{ width: '100%' }}>
                        {allPosts.map(item => 
                            item.type === "share" ? (
                                <SharePostItem
                                    // key={item.data.id}
                                    currentId={userInfo.id}
                                    post={item.data}
                                    onDeleteSuccess={() => handleDeleteSuccess(item.data.post.id, "share")}
                                    type="share"
                                />
                            ) : (
                                <PostItem
                                    key={item.data.id}
                                    currentId={userInfo.id}
                                    post={item.data}
                                    onDeleteSuccess={() => handleDeleteSuccess(item.data.id, "post")}
                                    type="post"
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {showPopup && <PopupPost userInfo={userInfo} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default ContentArea;
