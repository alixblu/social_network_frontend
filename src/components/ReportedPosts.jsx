import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFlag, FaEye, FaEyeSlash } from 'react-icons/fa';

const ReportedPosts = () => {
    const [reportedPosts, setReportedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportedPosts();
    }, []);

    const fetchReportedPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/posts/reported');
            setReportedPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reported posts:', error);
            setLoading(false);
        }
    };

    const handleHidePost = async (postId) => {
        try {
            await axios.put(`http://localhost:8080/posts/${postId}/hide`);
            fetchReportedPosts();
        } catch (error) {
            console.error('Error hiding post:', error);
        }
    };

    const handleUnhidePost = async (postId) => {
        try {
            await axios.put(`http://localhost:8080/posts/${postId}/unhide`);
            fetchReportedPosts();
        } catch (error) {
            console.error('Error unhiding post:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý bài viết bị báo cáo</h1>
            
            <div className="space-y-4">
                {reportedPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={post.avatarUrl}
                                    alt={post.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold">{post.username}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center text-red-500">
                                    <FaFlag className="mr-1" />
                                    {post.reports?.length || 0} báo cáo
                                </span>
                                {post.hidden ? (
                                    <button
                                        onClick={() => handleUnhidePost(post.id)}
                                        className="flex items-center text-green-600 hover:text-green-700"
                                    >
                                        <FaEye className="mr-1" />
                                        Hiện bài viết
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleHidePost(post.id)}
                                        className="flex items-center text-red-600 hover:text-red-700"
                                    >
                                        <FaEyeSlash className="mr-1" />
                                        Ẩn bài viết
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-800">{post.content}</p>
                        </div>

                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="mb-4">
                                {post.mediaUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Media ${index + 1}`}
                                        className="max-w-full h-auto rounded-lg mb-2"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Danh sách báo cáo:</h4>
                            <div className="space-y-2">
                                {post.reports?.map((report) => (
                                    <div key={report.id} className="bg-gray-50 p-3 rounded">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{report.username}</p>
                                                <p className="text-sm text-gray-600">{report.reason}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(report.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {reportedPosts.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Không có bài viết nào bị báo cáo</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportedPosts; 