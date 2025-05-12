import { Clear, ModeComment, Recommend } from "@mui/icons-material";
import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import PopupComments from "./popup/PopupComments";
import PopupShare from "./popup/PopupShare";
import PopupDeletePost from "./popup/PopupDetelePost";

function PostItem({ post, currentId, onDeleteSuccess, type, exit }) {
    const postUser = post.user;
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [shareCount, setShareCount] = useState(0);

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const mediaUrls = post.mediaUrls || [];
    const images = mediaUrls.filter(url => url.match(/\.(jpeg|jpg|png|gif)$/i));
    const videos = mediaUrls.filter(url => url.match(/\.mp4$/i));
    const audios = mediaUrls.filter(url => url.match(/\.mp3$/i));

    useEffect(() => {
        axios.get(`http://localhost:8080/comments/post/${post.id}`)
            .then(response => {
                setCommentCount(response.data ? response.data.length : 0);
            })
            .catch(error => console.error("Lỗi lấy số lượng bình luận:", error));
    }, [post.id]);

    useEffect(() => {
        axios.get(`http://localhost:8080/likes/post/${post.id}`)
            .then(response => {
                const likes = response.data || [];
                setLikeCount(likes.length);
                setLiked(likes.some(like => like.user.id === currentId));
            })
            .catch(err => console.error("Lỗi lấy likes:", err));
    }, [post.id, currentId]);

   
    const likePost = async () => {
        try {
            await axios.post("http://localhost:8080/likes", null, {
                params: { postId: post.id, userId: currentId, reactionType: "LIKE" }
            });
            setLiked(true);
            setLikeCount(prev => prev + 1);
        } catch (err) {
            console.error("Lỗi Like:", err);
        }
    };

    const unlikePost = async () => {
        try {
            await axios.delete("http://localhost:8080/likes", {
                params: { postId: post.id, userId: currentId, reactionType: "LIKE" }
            });
            setLiked(false);
            setLikeCount(prev => Math.max(prev - 1, 0));
        } catch (err) {
            console.error("Lỗi Unlike:", err);
        }
    };

    const handleLikeClick = async () => {
        if (isLiking) return; // nếu đang xử lý thì bỏ qua
        setIsLiking(true);

        try {
            if (liked) {
                await unlikePost();
            } else {
                await likePost();
            }
        } finally {
            setIsLiking(false);
        }
    };

    const updateCommentCount = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/comments/post/${post.id}`);
            setCommentCount(res.data ? res.data.length : 0);  // Cập nhật lại số lượng bình luận
        } catch (error) {
            console.error("Lỗi lấy số lượng bình luận:", error);
        }
    };


    useEffect(() => {
        axios.get(`http://localhost:8080/shares/post/${post.id}`)
            .then(res => {
                setShareCount(res.data.length);
            })
            .catch(err => console.error("Lỗi lấy số lượt chia sẻ:", err));
    }, [post.id]);

    return (
        <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
            <div className="post-info">
                <div className="info-container">
                    <img src={`http://localhost:8080/images/${postUser.avatarUrl}`} className="info-compoment-image" alt="User" />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <span className="font-semibold">{postUser.username}</span>
                        <span className='text-[14px] text-gray-500'>{new Date(post.time).toLocaleString()}</span>
                    </div>
                </div>
                {exit !== "NO" && (
                    <div onClick={() => setShowDeletePopup(true)} className="info-compoment-delete cursor-pointer">
                        <Clear />
                    </div>
                 )}
            </div>

            <div className='post-content'>{post.content}</div>

            <div className="media-container">
                {audios.length > 0 && (
                    <audio key="audio" controls className="audio-player mb-2">
                        <source src={audios[0]} type="audio/mpeg" />
                    </audio>
                )}

                {(images.length > 0 || videos.length > 0) && (
                    <div className="media-row">
                        {images.length === 1 && videos.length === 1 && (
                            <div className='flex'>
                                <img src={images[0]} alt="media-img" className="media-half" />
                                <video controls className="media-half">
                                    <source src={videos[0]} type="video/mp4" />
                                </video>
                            </div>
                        )}
                        {images.length === 1 && videos.length === 0 && (
                            <img src={images[0]} alt="media-img" className="media-full" />
                        )}
                        {videos.length === 1 && images.length === 0 && (
                            <video controls className="media-full">
                                <source src={videos[0]} type="video/mp4" />
                            </video>
                        )}
                    </div>
                )}
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: "0 10px", padding: '10px 0', alignItems: 'center', borderBottom: '1px rgb(202, 199, 199) solid' }}>
                    <div className='flex items-center'>
                        <span><Recommend className="text-blue-500" /></span>
                        <span style={{ marginLeft: '3px' }}>{likeCount}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 text-sm mr-2'>{commentCount} Bình luận</span>
                        <span className='text-gray-500 text-sm mr-2'>{shareCount} Chia sẻ</span>
                    </div>
                </div>

                <div className="flex justify-around my-2 pb-2">
                    <div onClick={handleLikeClick} className={`flex items-center gap-1 cursor-pointer px-6 py-2 rounded-lg transition duration-200 ${liked ? "text-blue-600 bg-gray-200" : "text-gray-800 hover:text-blue-600 hover:bg-gray-200"}`}>
                        <span><Recommend className={liked ? "text-blue-600" : "text-gray-500"} /></span>
                        <span>Thích</span>
                    </div>

                    <div onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200">
                        <span><ModeComment className='text-gray-500' /></span>
                        <span>Bình luận</span>
                    </div>

                    <div onClick={() => setShowSharePopup(true)} className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-6 py-2 rounded-lg transition duration-200">
                        <span><Send className='text-gray-500' /></span>
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>

            {showComments && <PopupComments currentId={currentId} postId={post.id} onClose={() => setShowComments(false)} updateCommentCount={updateCommentCount} />}
            {showSharePopup && (
                <PopupShare
                    currentUserId={currentId}
                    post={post}
                    onClose={() => setShowSharePopup(false)}
                    onShareSuccess={() => {
                        setShareCount(prev => prev + 1); // tăng lên sau khi share
                    }}
                />
            )}

            {showDeletePopup && (
                <PopupDeletePost
                    currentId={currentId}
                    post={post}
                    onClose={() => setShowDeletePopup(false)}
                    onDeleteSuccess={onDeleteSuccess}
                    type={type}
                />
            )}
        </div>
    );
}

export default PostItem;
