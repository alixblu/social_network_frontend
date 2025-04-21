import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";









export function FormUser({ user, onClose, onToggleStatus }) {
  if (!user) return null;

  const isActive = user.status === "Active";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Card chính */}
      <div className="relative bg-white border p-6 shadow-xl rounded-md w-96">
        {/* Nút đóng ở góc trên bên phải */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Nội dung */}
        <h3 className="text-xl font-bold mb-4 text-center">Thông tin người dùng</h3>
        <div className="space-y-2">
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={isActive ? "text-green-600" : "text-red-500"}>
              {user.status}
            </span>
          </p>
        </div>

        {/* Nút chuyển trạng thái tài khoản */}
        <button
          className={`mt-6 w-full py-2 rounded font-semibold ${
            isActive
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          onClick={() => onToggleStatus(user.id)}
        >
          {isActive ? "Khóa tài khoản" : "Mở tài khoản"}
        </button>
      </div>
    </div>
  );
}










function Admin() {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchPost, setSearchPost] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [isOpenInfo, setOpenInfo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const posts = [
    { id: 1, title: 'Bài viết React', content: 'Giới thiệu ReactJS' },
    { id: 2, title: 'Bài viết Vue', content: 'Nội dung VueJS cơ bản' },
    { id: 3, title: 'Bài viết Angular', content: 'Khái niệm Angular' },
  ];

  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', status: "Active" },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', status: "Deactivated" },
    { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', status:"Active" },
  ]);
  
  // Lọc dữ liệu theo thanh tìm kiếm
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchPost.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

 

  const navigate = useNavigate()
  const BackToLogin = () => navigate("/home")

 //Xử lí phần đăng xuất
  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      toast.success("Đăng xuất thành công!", { autoClose: 2000 });
      setTimeout(() => {
        BackToLogin()
      }, 2000); // đợi toast hiện rồi mới chuyển trang
    }
  };
  
  //Hiển thị chi tiết thông tin
  const PopupInformation = (user) => {
    setOpenInfo(!isOpenInfo)
    setSelectedUser(user)
  }

  const handleToggleStatus = (id) => {
    const updatedUsers = users.map(user =>
      user.id === id
        ? {
            ...user,
            status: user.status === "Active" ? "Deactivated" : "Active"
          }
        : user
    );
    setUsers(updatedUsers);
    toast.success("Cập nhật trạng thái tài khoản thành công!");
    setOpenInfo(false);
  };
  


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
              <th className="border p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr onClick={ () => PopupInformation(user)} className=' hover:bg-blue-200' key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className= {user.status==="Active" ? "border p-2 text-green-600 font-semibold text-center" : "border p-2 text-red-500 font-semibold text-center" }>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isOpenInfo && selectedUser &&(
        <FormUser user={selectedUser} onClose={() => setOpenInfo(false)} onToggleStatus={handleToggleStatus}  />
      )}
    <ToastContainer position="top-right" />



    </div>
  );
}

export default Admin;
