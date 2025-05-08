import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/users/auth/login', data);

      sessionStorage.setItem('token', JSON.stringify(response.data));

      toast.success('Đăng nhập thành công!', {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => {
        navigate('/home');
      }, 2500);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError('root', {
        type: 'manual',
        message: 'Đăng nhập không thành công! Kiểm tra lại email và mật khẩu',
      });
    }
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            {...register('email')}
            className="w-full p-3 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password')}
            className="w-full p-3 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700"
          >
            Đăng nhập
          </button>

          {errors.root && <p className="text-red-500 text-sm text-center mt-3">{errors.root.message}</p>}

          <p className="text-blue-600 text-sm text-center mt-3 cursor-pointer hover:underline">
            Quên mật khẩu?
          </p>

          <div className="border-t my-4"></div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
          >
            Tạo tài khoản mới
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
