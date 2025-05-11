import React, { useEffect, useState } from 'react';
import { Clear } from '@mui/icons-material';
import axios from 'axios';

function PopupComments({ id: userId, postId, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/comments/post/${postId}`);
                setComments(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy comments:", err);
            }
        };
        fetchComments();

        // Khóa cuộn trang khi popup mở
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [postId]);

    // ✅ Hàm gửi comment mới
    const createComment = async () => {
        console.log(userId)
        console.log(postId)
        if (!newComment.trim()) return;
        try {
            const res = await axios.post('http://localhost:8080/comments/create', null, {
                params: {
                    userId,
                    postId,
                    content: newComment.trim()
                }
            });


            // Cập nhật bình luận mới vào danh sách
            setComments(prev => [...prev, res.data]);
            setNewComment('');
        } catch (err) {
            console.error("Lỗi khi gửi comment:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="w-full max-w-xl max-h-[80vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h3 className="text-lg font-semibold">Bình luận</h3>
                    <Clear onClick={onClose} className="cursor-pointer text-gray-600 hover:text-red-500" />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map((cmt, index) => (
                        <div key={index} className="border-b pb-2">
                            <div className="font-semibold">{cmt.user.username}</div>
                            <div className="text-sm text-gray-700">{cmt.content}</div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-300">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Viết bình luận..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200 text-sm"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && createComment()}
                        />
                        <button
                            onClick={createComment}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupComments;
