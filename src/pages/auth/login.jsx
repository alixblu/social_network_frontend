import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // ✅ Sau khi đã submit thì mới check liên tục
  useEffect(() => {
    if (!isSubmitted) return;

    const result = loginSchema.safeParse({ email, password });
    const fieldErrors = { email: '', password: '', general: '' };

    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0] in fieldErrors) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
    }

    setErrors(prev => ({ ...prev, ...fieldErrors }));
  }, [email, password, isSubmitted]);

  const handleLogin = () => {
    setIsSubmitted(true);
  
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) return;
  
    setErrors({ email: '', password: '', general: '' });
  
    axios.post('http://localhost:8080/api/auth/login', { email, password })
      .then(response => {
        console.log('Đăng nhập thành công:', response.data);
  
        //Lưu thông tin user vào localStorage
        sessionStorage.setItem('user', JSON.stringify(response.data));

        toast.success('Đăng nhập thành công!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Điều hướng
        setTimeout(() => {
          navigate('/home');
        }, 2500)
      })

      .catch(error => {
        setErrors(prev => ({
          ...prev,
          general: 'Đăng nhập không thành công! Kiểm tra lại email và mật khẩu',
        }));
        console.error('Lỗi đăng nhập:', error);
      });
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-5xl w-full px-6">
        <div className="mb-10 lg:mb-0 lg:w-1/2">
          <h1 className="text-blue-600 text-5xl font-bold mb-4">facebook</h1>
          <p className="text-2xl">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700"
          >
            Đăng nhập
          </button>

          {errors.general && <p className="text-red-500 text-sm text-center mt-3">{errors.general}</p>}

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
      <ToastContainer />
    </div>
  );
};

export default Login;
