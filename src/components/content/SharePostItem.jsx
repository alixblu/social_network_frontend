import React, { useState } from 'react';
import PostItem from './PostItem'; // đường dẫn đến PostItem.jsx
import PopupDeletePost from './popup/PopupDetelePost';

function SharePostItem({ post, currentId, onDeleteSuccess, type }) {
    const sharedUser = post.user; // người đã chia sẻ
    const originalPost = post.post; // Bài viết gốc
    const originalPost1 = {
        ...originalPost,
        time: originalPost.createdAt, // Đổi tên createdAt thành time
    };

    const [showDeletePopup, setShowDeletePopup] = useState(false);

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px', padding: '10px' }}>
            {/* Header: Người chia sẻ */}
            <div className="post-info">
                <div className="info-container">
                    <img
                        src={`http://localhost:8080/images/${sharedUser.avatarUrl}`}
                        className="info-compoment-image"
                        alt="User"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <span className="font-semibold">{sharedUser.username} đã chia sẻ bài viết</span>
                        <span className='text-[14px] text-gray-500'>{new Date(post.sharedAt).toLocaleString()}</span>
                    </div>
                </div>
                {currentId === sharedUser.id && (
                    <div onClick={() => setShowDeletePopup(true)} className="info-compoment-delete text-red-500 cursor-pointer">
                        Xóa
                    </div>
                )}
            </div>

            {/* Render bài viết gốc */}
            <div style={{ marginTop: '10px', backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '10px' }}>
                <PostItem
                    post={originalPost1}
                    currentId={currentId}
                    onDeleteSuccess={onDeleteSuccess}
                    type={type}
                    exit="NO"
                />
            </div>



            {showDeletePopup && (
                <PopupDeletePost
                    post={originalPost1}
                    currentId={currentId}
                    onClose={() => setShowDeletePopup(false)}
                    onDeleteSuccess={onDeleteSuccess}
                    type={type}
                />
            )}
        </div>
    );
}

export default SharePostItem;
