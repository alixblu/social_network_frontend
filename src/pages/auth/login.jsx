import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-5xl w-full px-6">
        {/* Phần logo + mô tả */}
        <div className="mb-10 lg:mb-0 lg:w-1/2">
          <h1 className="text-blue-600 text-5xl font-bold mb-4">facebook</h1>
          <p className="text-2xl">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </p>
        </div>

        {/* Form đăng nhập */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
          <p className="text-blue-600 text-sm text-center mt-3 cursor-pointer hover:underline">
            Quên mật khẩu?
          </p>

          <div className="border-t my-4"></div>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
          >
            Tạo tài khoản mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
