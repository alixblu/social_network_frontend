import { Clear, ModeComment, MoreHoriz, Recommend } from "@mui/icons-material";
import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PopupComments from "./popup/PopupComments";
import PopupShare from "./popup/PopupShare";
import PopupDeletePost from "./popup/PopupDetelePost";
import PopupReport from "./popup/PopupReport";

const REACTIONS = [
    { type: "LIKE", label: "👍" },
    { type: "LOVE", label: "❤️" },
    { type: "HAHA", label: "😂" },
    { type: "SAD", label: "😢" },
    { type: "ANGRY", label: "😠" },
];

function PostItem({ post, currentId, onDeleteSuccess, type, exit }) {
    const postUser = post.user;
    const mediaUrls = post.mediaUrls || [];
    const images = mediaUrls.filter(url => /\.(jpeg|jpg|png|gif)$/i.test(url));
    const videos = mediaUrls.filter(url => /\.mp4$/i.test(url));
    const audios = mediaUrls.filter(url => /\.mp3$/i.test(url));

    const [reactionCount, setReactionCount] = useState({});
    const [reactionType, setReactionType] = useState(null);
    const [isReacting, setIsReacting] = useState(false);
    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false);






    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    useEffect(() => {
        axios.get(`http://localhost:8080/comments/post/${post.id}`)
            .then(res => setCommentCount(res.data?.length || 0))
            .catch(console.error);
    }, [post.id]);

    useEffect(() => {
        axios.get(`http://localhost:8080/likes/post/${post.id}`)
            .then(res => {
                const counts = REACTIONS.reduce((acc, r) => ({ ...acc, [r.type]: 0 }), {});
                res.data?.forEach(like => {
                    if (counts.hasOwnProperty(like.reactionType)) {
                        counts[like.reactionType]++;
                    }
                    if (like.user.id === currentId) {
                        setReactionType(like.reactionType);
                    }
                });
                setReactionCount(counts);
            })
            .catch(console.error);
    }, [post.id, currentId]);

    useEffect(() => {
        axios.get(`http://localhost:8080/shares/post/${post.id}`)
            .then(res => setShareCount(res.data.length))
            .catch(console.error);
    }, [post.id]);

    const sendNotification = async (message) => {
        if (currentId === post.user.id) return;
        try {
            await axios.post('http://localhost:8080/notifications/post-action', null, {
                params: {
                    postId: post.id,
                    message,
                    userId: post.user.id,
                    currentUserId: currentId,
                    type: 'REACTION'
                }
            });
        } catch (err) {
            console.error('Lỗi gửi thông báo:', err);
        }
    };

    const handleReaction = async (type) => {
        if (isReacting) return;
        setIsReacting(true);
        try {
            if (reactionType === type) {
                await axios.delete("http://localhost:8080/likes", {
                    params: { postId: post.id, userId: currentId, reactionType: type }
                });
                setReactionType(null);
                setReactionCount(prev => ({ ...prev, [type]: Math.max(prev[type] - 1, 0) }));
            } else {
                if (reactionType) {
                    await axios.delete("http://localhost:8080/likes", {
                        params: { postId: post.id, userId: currentId, reactionType }
                    });
                    setReactionCount(prev => ({
                        ...prev,
                        [reactionType]: Math.max(prev[reactionType] - 1, 0)
                    }));
                }
                await axios.post("http://localhost:8080/likes", null, {
                    params: { postId: post.id, userId: currentId, reactionType: type }
                });
                setReactionType(type);
                setReactionCount(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
                sendNotification(`đã thả cảm xúc ${REACTIONS.find(r => r.type === type)?.label} bài viết của bạn`);
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

    return (
        <div key={post.id} className="bg-white rounded-[10px] mb-5 p-4 shadow-sm">
            <div className="post-info flex justify-between items-start">
                <div className="info-container flex">
                    <img
                        src={`http://localhost:8080/images/${postUser.avatarUrl}`}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="User"
                    />
                    <div className="ml-3">
                        <p className="font-semibold">{postUser.username}</p>
                        <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                    </div>
                </div>
               {/* {exit !== "NO" && ( */}
                   <div className="relative" ref={menuRef}>
                        <div
                            className="cursor-pointer p-1 hover:bg-gray-200 rounded-full"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreHoriz />
                        </div>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 bg-white border rounded shadow-md z-50 min-w-[120px]">
                                {exit !== "NO" && (
                                    <button
                                        onClick={() => {
                                         setIsMenuOpen(false);
                                         setShowDeletePopup(true);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Xóa bài viết
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setShowReportPopup(true);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    Báo cáo
                                </button>
                            </div>
                        )}
                    </div>
                {/* )} */}

            </div>

            <div className="mt-3">{post.content}</div>

            <div className="media-container my-3">
                {audios.length > 0 && (
                    <audio controls className="w-full mb-2">
                        <source src={audios[0]} type="audio/mpeg" />
                    </audio>
                )}
                {(images.length > 0 || videos.length > 0) && (
                    <div className="flex gap-2">
                        {images.length === 1 && <img src={images[0]} alt="media" className="w-full rounded-md" />}
                        {videos.length === 1 && (
                            <video controls className="w-full rounded-md">
                                <source src={videos[0]} type="video/mp4" />
                            </video>
                        )}
                        {images.length === 1 && videos.length === 1 && (
                            <>
                                <img src={images[0]} alt="media-img" className="w-1/2 rounded-md" />
                                <video controls className="w-1/2 rounded-md">
                                    <source src={videos[0]} type="video/mp4" />
                                </video>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-t border-b py-2">
                <div className="flex gap-3">
                    {REACTIONS.map(({ type, label }) => (
                        <div key={type} className="flex items-center gap-1">
                            <span>{label}</span>
                            <span>{reactionCount[type] || 0}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <span className="mr-3">{commentCount} Bình luận</span>
                    <span>{shareCount} Chia sẻ</span>
                </div>
            </div>

            <div className="flex justify-around pt-2 relative">
                {/* Reaction button */}
                <div
                    className={`relative ${showReactionMenu ? "text-blue-600 bg-gray-200" : "hover:text-blue-600 hover:bg-gray-200"} px-4 py-2 rounded-lg transition`}
                    onMouseEnter={() => setShowReactionMenu(true)}
                    onMouseLeave={() => setShowReactionMenu(false)}
                >
                    <div className="flex items-center gap-1 cursor-pointer">
                        {reactionType ? (
                            <span className="text-xl">{REACTIONS.find(r => r.type === reactionType)?.label}</span>
                        ) : (
                            <Recommend className="text-gray-500" />
                        )}
                    </div>

                    {showReactionMenu && (
                        <div className="absolute bottom-full left-0 bg-white border rounded shadow px-2 py-1 flex gap-2 z-50">
                            {REACTIONS.map(({ type, label }) => (
                                <span
                                    key={type}
                                    className="cursor-pointer text-xl hover:scale-125 transition-transform"
                                    onClick={() => handleReaction(type)}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div onClick={() => setShowComments(true)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <ModeComment className="text-gray-500" />
                    <span>Bình luận</span>
                </div>

                <div onClick={() => setShowSharePopup(true)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Send className="text-gray-500" />
                    <span>Chia sẻ</span>
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
            {showReportPopup && (
                <PopupReport
                    currentId={currentId}
                    post={post}
                    onClose={() => setShowReportPopup(false)}
                />
            )}
        </div>
    );
}

export default PostItem;
