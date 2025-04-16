import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchPost, setSearchPost] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const posts = [
    { id: 1, title: 'Bài viết React', content: 'Giới thiệu ReactJS' },
    { id: 2, title: 'Bài viết Vue', content: 'Nội dung VueJS cơ bản' },
    { id: 3, title: 'Bài viết Angular', content: 'Khái niệm Angular' },
  ];

  const users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com' },
    { id: 3, name: 'Lê Văn C', email: 'c@gmail.com' },
  ];

  // Lọc dữ liệu theo thanh tìm kiếm
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchPost.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
    navigate("/home")
    // Logic đăng xuất ở đây (ví dụ: xoá token, chuyển hướng về trang đăng nhập...)
  };

  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trang Quản Trị</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <ul className="flex border-b mb-6">
        <li
          className={`cursor-pointer px-4 py-2 font-semibold ${
            activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Quản lý Bài viết
        </li>
        <li
          className={`cursor-pointer px-4 py-2 font-semibold ${
            activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Quản lý Người dùng
        </li>
      </ul>

      {/* Tìm kiếm */}
      {activeTab === 'posts' && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm bài viết..."
            className="w-full border p-2 rounded-md"
            value={searchPost}
            onChange={(e) => setSearchPost(e.target.value)}
          />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm người dùng..."
            className="w-full border p-2 rounded-md"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
      )}

      {/* Nội dung tương ứng */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="p-4 border rounded-md shadow-sm">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
          {filteredPosts.length === 0 && <p className="text-gray-500">Không tìm thấy bài viết nào.</p>}
        </div>
      )}

      {activeTab === 'users' && (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
