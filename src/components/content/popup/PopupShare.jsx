import React from 'react';
import { Clear } from "@mui/icons-material";
import axios from 'axios';

function PopupShare({ post, onClose, currentUserId, onShareSuccess }) {
    // Hàm gọi API chia sẻ bài viết
    const createPostShare = async (postId, userId) => {
        try {
            const response = await axios.post('http://localhost:8080/shares', null, {
                params: {
                    postId,
                    userId,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Lỗi chia sẻ bài viết";
        }
    };

    // Xử lý khi người dùng nhấn nút chia sẻ
    const handleShare = async () => {
        try {
            await createPostShare(post.id, currentUserId);
            window.location.reload()
            onShareSuccess(); // gọi callback để cập nhật số chia sẻ
            alert("Đã chia sẻ bài viết!");
            onClose();
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="flex flex-col  popup-content w-[400px] bg-white rounded-lg shadow-lg p-4 relative">
                <button className="absolute right-2 top-2" onClick={onClose}>
                    <Clear />
                </button>
                <h2 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h2>
                <div className="mb-4">{post.content}</div>
                <button
                    onClick={handleShare}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Chia sẻ ngay
                </button>
            </div>
        </div>
    );
}

export default PopupShare;
