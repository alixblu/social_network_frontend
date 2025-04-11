import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 gap-8 flex flex-col items-center justify-center">
      <div>
        <h1 className=' text-6xl text-blue-600 font-bold'>FaceBook</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Tạo tài khoản mới</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Nhanh chóng và dễ dàng.</p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Họ"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Tên"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Số di động hoặc email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="w-full p-2 border border-gray-300 rounded"
          />

          {/* Ngày sinh */}
          <div>
            <label className="text-sm text-gray-600">Ngày sinh</label>
            <div className="flex gap-2 mt-1">
              <select className="w-1/3 p-2 border border-gray-300 rounded">
                {[...Array(31)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
              <select className="w-1/3 p-2 border border-gray-300 rounded">
                {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'].map((m, i) => (
                  <option key={i}>{m}</option>
                ))}
              </select>
              <select className="w-1/3 p-2 border border-gray-300 rounded">
                {Array.from({ length: 100 }, (_, i) => 2024 - i).map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Giới tính */}
          <div>
            <label className="text-sm text-gray-600">Giới tính</label>
            <div className="flex gap-3 mt-1">
              <label className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 w-full">
                <input type="radio" name="gender" value="female" />
                <span>Nữ</span>
              </label>
              <label className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 w-full">
                <input type="radio" name="gender" value="male" />
                <span>Nam</span>
              </label>
              <label className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 w-full">
                <input type="radio" name="gender" value="custom" />
                <span>Tùy chọn</span>
              </label>
            </div>
          </div>

          {/* Nút đăng ký */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-3">
            Đăng ký
          </button>
          <a className='flex justify-center text-blue-600 underline font-semibold' onClick={() => navigate("/login")}><label htmlFor="">Alredy have an Account?</label></a>
        </div>
      </div>
    </div>
  );
};

export default Register;
