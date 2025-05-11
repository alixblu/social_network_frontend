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
import PopupComments from './popup/PopupComments';
// Hàm hiển thị một post
function PostItem({ post , id }) {
    
    const postUser = post.user;
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    const mediaUrls = post.mediaUrls || [];
    const images = mediaUrls.filter(url => url.match(/\.(jpeg|jpg|png|gif)$/i));
    const videos = mediaUrls.filter(url => url.match(/\.mp4$/i));
    const audios = mediaUrls.filter(url => url.match(/\.mp3$/i));
    
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // Gọi API để lấy số lượng bình luận cho bài viết
        axios.get(`http://localhost:8080/comments/post/${post.id}`)
            .then(response => {
                // Kiểm tra nếu có dữ liệu và cập nhật số lượng bình luận
                setCommentCount(response.data ? response.data.length : 0);
            })
            .catch(error => {
                console.error("Lỗi lấy số lượng bình luận:", error);
            });
    }, [post.id]);  // Chỉ gọi lại khi post.id thay đổi

    useEffect(() => {
        axios.get(`http://localhost:8080/likes/post/${post.id}`)
            .then(response => {
                const likes = response.data || [];
                setLikeCount(likes.length);

                // Kiểm tra nếu người dùng hiện tại đã like
                const likedByUser = likes.some(like => like.user.id === id); // id là userId
                setLiked(likedByUser);
            })
            .catch(err => console.error("Lỗi lấy likes:", err));
    }, [post.id, id]);


    const handleLikeClick = () => {
        if (!liked) {
            axios.post("http://localhost:8080/likes", null, {
                params: {
                    postId: post.id,
                    userId: id,
                    reactionType: "LIKE"
                }
            }).then(() => {
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }).catch(err => console.error("Lỗi Like:", err));
        } else {

            axios.delete("http://localhost:8080/likes", {
                params: {
                    postId: post.id,
                    userId: id
                }
            })
            .then(() => {
                setLiked(false);
                setLikeCount(prev => Math.max(prev - 1, 0)); // tránh âm
            })
            .catch(err => console.error("Lỗi Unlike:", err));
        }
    };



    return (
        <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
            {/* Post Header */}
            <div className="post-info">
                <div className="info-container">
                    <img src={`http://localhost:8080/images/${postUser.avatarUrl}`} className="info-compoment-image" alt="User" />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <span className="font-semibold">{postUser.username}</span>
                        <span style={{ fontSize: "12px" }}>{post.time}</span>
                    </div>
                </div>
                <div className="info-compoment-delete"><Clear /></div>
            </div>

            {/* Post Content */}
            <div className='post-content'>{post.content}</div>

            {/* Media section */}
           <div className="media-container">
                {/* Audio on top if exists */}
                {audios.length > 0 && (
                    <audio key="audio" controls className="audio-player mb-2">
                        <source src={audios[0]} type="audio/mpeg" />
                    </audio>
                )}

                {/* Images and videos */}
                {(images.length > 0 || videos.length > 0) && (
                    <div className="media-row">
                        {/* Nếu có cả ảnh và video */}
                        {(images.length === 1 && videos.length === 1) && (
                        <>  <div className='flex'>
                                <img
                                    src={images[0]}
                                    alt="media-img"
                                    className="media-half"
                                />
                                <video
                                    controls
                                    className="media-half"
                                >
                                    <source src={videos[0]} type="video/mp4" />
                                </video>
                            </div>
                            </>
                        )}

                        {/* Nếu chỉ có 1 file ảnh */}
                        {images.length === 1 && videos.length === 0 && (
                            <img
                                src={images[0]}
                                alt="media-img"
                                className="media-full"
                            />
                        )}

                        {/* Nếu chỉ có 1 video */}
                        {videos.length === 1 && images.length === 0 && (
                            <video
                                controls
                                className="media-full"
                            >
                                <source src={videos[0]} type="video/mp4" />
                            </video>
                        )}
                    </div>
                )}
            </div>


            {/* Reactions */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: "0 10px", padding: '10px 0', alignItems: 'center', borderBottom: '1px rgb(202, 199, 199) solid' }}>
                    <div className='flex items-center'>
                        <span><Recommend className="text-blue-500" /></span>
                        <span style={{ marginLeft: '3px' }}>{likeCount}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 text-sm mr-2'>{commentCount} Bình luận</span>
                        <span className='text-gray-500 text-sm mr-2'>2 Chia sẻ</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-around my-2 pb-2">
                    <div
                        className={`flex items-center gap-1 cursor-pointer px-6 py-2 rounded-lg transition duration-200 
                            ${liked ? "text-blue-600 bg-gray-200" : "text-gray-800 hover:text-blue-600 hover:bg-gray-200"}`}
                        onClick={handleLikeClick}
                    >
                        <span><Recommend className={liked ? "text-blue-600" : "text-gray-500"} /></span>
                        <span>Thích</span>
                    </div>

                    <div
                        className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <span><ModeComment className='text-gray-500' /></span>
                        <span>Bình luận</span>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-6 py-2 rounded-lg transition duration-200">
                        <span><Send className='text-gray-500' /></span>
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>

            {showComments && (
                <PopupComments
                    id ={id}
                    postId={post.id}
                    onClose={() => setShowComments(false)}
                />
            )}

        </div>
        

    );
}



function ContentArea() {
    const [showPopup, setShowPopup] = useState(false);
    const [userInfo, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const handleTextAreaClick = () => {
        setShowPopup(true);
    };



   



    // Lấy thông tin người dùng
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

    // Gọi API lấy tất cả bài viết
    useEffect(() => {
        axios.get("http://localhost:8080/posts")
            .then(res => {
                const fetchedPosts = res.data.map(post => ({
                    ...post,
                    time: post.createdAt, // gán thời gian nếu cần
                    mediaUrls: post.mediaUrls || [], // đảm bảo không undefined
                    comments: post.comments || []    // đảm bảo không undefined
                }));
                setPosts(fetchedPosts);
            })
            .catch(err => console.error("Lỗi lấy bài viết:", err));
    }, []);

    return (
        <div className="content-area">
            <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Viết bài */}
                <div style={{ width: '100%', backgroundColor: 'white', borderRadius: '10px' }}>
                    {userInfo && (
                        <div className="container-question">
                            <img src={`http://localhost:8080/images/${userInfo.avatarUrl}`} className='w-[45px] h-[45px] rounded-full' alt="User Avatar" />
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

                {/* Danh sách bài viết */}
                {userInfo && (
                    <div className="list-post" style={{ width: '100%' }}>
                        {[...posts]
                            .sort((a, b) => new Date(b.time) - new Date(a.time))
                            .map((post) => (
                                <PostItem key={post.id} id={userInfo.id} post={post} />
                            ))
                        }
                    </div>
                )}

            </div>

            {/* Popup đăng bài */}
            {showPopup && (
                <PopupPost  onClose={() => setShowPopup(false)} userInfo={userInfo} />
            )}
        </div>
    );
}

export default ContentArea;
