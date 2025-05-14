import { Clear, ModeComment, Recommend } from "@mui/icons-material";
import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import PopupComments from "./popup/PopupComments";
import PopupShare from "./popup/PopupShare";
import PopupDeletePost from "./popup/PopupDetelePost";

// Các loại reaction có thể mở rộng
const REACTIONS = [
    { type: "LIKE", label: "👍" },
    { type: "LOVE", label: "❤️" },
    { type: "HAHA", label: "😂" },
    { type: "SAD", label: "😢" },
    { type: "ANGRY", label: "😠" },
];

function PostItem({ post, currentId, onDeleteSuccess, type, exit }) {
    const postUser = post.user;
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [reactionCount, setReactionCount] = useState({
        LIKE: 0,
        LOVE: 0,
        HAHA: 0,
        SAD: 0,
        ANGRY: 0,
    });
    const [reactionType, setReactionType] = useState(null);
    const [isReacting, setIsReacting] = useState(false);
    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const mediaUrls = post.mediaUrls || [];
    const images = mediaUrls.filter(url => url.match(/\.(jpeg|jpg|png|gif)$/i));
    const videos = mediaUrls.filter(url => url.match(/\.mp4$/i));
    const audios = mediaUrls.filter(url => url.match(/\.mp3$/i));

    useEffect(() => {
        axios.get(`http://localhost:8080/comments/post/${post.id}`)
            .then(response => setCommentCount(response.data?.length || 0))
            .catch(error => console.error("Lỗi lấy số lượng bình luận:", error));
    }, [post.id]);

    useEffect(() => {
        axios.get(`http://localhost:8080/likes/post/${post.id}`)
            .then(response => {
                const likes = response.data || [];
                const counts = {
                    LIKE: 0,
                    LOVE: 0,
                    HAHA: 0,
                    SAD: 0,
                    ANGRY: 0,
                };

                // Đếm số lượng reactions cho mỗi loại
                likes.forEach(like => {
                    if (counts[like.reactionType] !== undefined) {
                        counts[like.reactionType]++;
                    }
                    if (like.user.id === currentId) {
                        setReactionType(like.reactionType);
                    }
                });

                setReactionCount(counts);
            })
            .catch(err => console.error("Lỗi lấy reactions:", err));
    }, [post.id, currentId]);

    const handleReaction = async (type) => {
        if (isReacting) return;
        setIsReacting(true);
        try {
            if (reactionType === type) {
                // Nếu nhấn lại cùng loại reaction => gỡ bỏ
                await axios.delete("http://localhost:8080/likes", {
                    params: { postId: post.id, userId: currentId, reactionType: type }
                });
                setReactionType(null); // Đặt lại reactionType thành null
                setReactionCount(prev => {
                    const newCount = { ...prev };
                    newCount[type] = Math.max(newCount[type] - 1, 0); // Giảm số lượng reaction
                    return newCount;
                });
            } else {
                // Nếu đã có reaction khác => xóa cái cũ trước
                if (reactionType) {
                    await axios.delete("http://localhost:8080/likes", {
                        params: { postId: post.id, userId: currentId }
                    });
                    setReactionCount(prev => {
                        const newCount = { ...prev };
                        newCount[reactionType] = Math.max(newCount[reactionType] - 1, 0); // Giảm số lượng reaction loại cũ
                        return newCount;
                    });
                }

                // Sau đó thêm mới reaction
                await axios.post("http://localhost:8080/likes", null, {
                    params: { postId: post.id, userId: currentId, reactionType: type }
                });

                // Cập nhật số lượng reactions cho reaction mới
                setReactionCount(prev => {
                    const newCount = { ...prev };
                    newCount[type] = (newCount[type] || 0) + 1; // Tăng số lượng reaction cho loại mới
                    return newCount;
                });

                setReactionType(type); // Cập nhật lại reactionType với loại mới
            }
        } catch (err) {
            console.error("Lỗi gửi reaction:", err);
        } finally {
            setIsReacting(false);
            setShowReactionMenu(false);
        }
    };

    const updateCommentCount = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/comments/post/${post.id}`);
            setCommentCount(res.data?.length || 0);
        } catch (error) {
            console.error("Lỗi lấy số lượng bình luận:", error);
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/shares/post/${post.id}`)
            .then(res => setShareCount(res.data.length))
            .catch(err => console.error("Lỗi lấy số lượt chia sẻ:", err));
    }, [post.id]);

    const currentReactionLabel = REACTIONS.find(r => r.type === reactionType)?.label || "Thích";

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
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                    <div className="flex items-center">
                        {REACTIONS.map((reaction) => (
                            <div key={reaction.type} className="flex items-center mr-3">
                                <span className="text-xl">{reaction.label}</span>
                                <span className="ml-1 text-sm">{reactionCount[reaction.type] || 0}</span> {/* Hiển thị số lượng reaction */}
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm mr-2">{commentCount} Bình luận</span>
                        <span className="text-gray-500 text-sm">{shareCount} Chia sẻ</span>
                    </div>
                </div>

                <div className="flex justify-around my-2 pb-2 relative">
                    <div
                        className={`relative ${showReactionMenu ? "text-blue-600 bg-gray-200" : "text-gray-800 hover:text-blue-600 hover:bg-gray-200"}`}
                        onMouseEnter={() => setShowReactionMenu(true)}
                        onMouseLeave={() => setShowReactionMenu(false)}
                    >
                        {/* Nút Reaction */}
                        <div className="flex items-center gap-1 cursor-pointer px-6 py-2 rounded-lg transition duration-200">
                            {reactionType ? (
                                <span className="text-xl">{REACTIONS.find(r => r.type === reactionType)?.label}</span>
                            ) : (
                                <Recommend className="text-gray-500" />
                            )}
                        </div>

                        {/* Menu reactions */}
                        {showReactionMenu && (
                            <div className="absolute bottom-full left-0 bg-white border rounded shadow-md px-2 py-1 flex gap-2 z-50">
                                {REACTIONS.map(r => (
                                    <span
                                        key={r.type}
                                        className="cursor-pointer text-xl hover:scale-125 transition-transform"
                                        onClick={() => handleReaction(r.type)}
                                    >
                                        {r.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200">
                        <ModeComment className='text-gray-500' />
                        <span>Bình luận</span>
                    </div>

                    <div onClick={() => setShowSharePopup(true)} className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-blue-600 hover:bg-gray-200 px-6 py-2 rounded-lg transition duration-200">
                        <Send className='text-gray-500' />
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>

            {showComments && (
                <PopupComments
                    currentId={currentId}
                    postId={post.id}
                    onClose={() => setShowComments(false)}
                    updateCommentCount={updateCommentCount}
                />
            )}

            {showSharePopup && (
                <PopupShare
                    currentUserId={currentId}
                    post={post}
                    onClose={() => setShowSharePopup(false)}
                    onShareSuccess={() => setShareCount(prev => prev + 1)}
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
