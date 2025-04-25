import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ✅ Schema với Zod

const registerSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu"),
  dob: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string()
  }),
  // gender: z.enum(['male', 'female', 'custom']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userToSend = {
        email: data.email,
        username: `${data.firstName.trim()} ${data.lastName.trim()}`,
        password: data.password,
        dateOfBirth: `${data.dob.year}-${data.dob.month.padStart(2, '0')}-${data.dob.day.padStart(2, '0')}`,
      };
  
      const response = await axios.post("http://localhost:8080/users/auth/register", userToSend);
  
      // Nếu thành công (status 201)
      if (response.status === 201) {
        toast.success("Đăng ký thành công!", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
  
    } catch (error) {
      // Nếu email hoặc username đã tồn tại, backend sẽ trả 409
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error("Đăng ký thất bại!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 gap-8 flex flex-col items-center justify-center">
      <div>
        <h1 className='text-6xl text-blue-600 font-bold'>FaceBook</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Tạo tài khoản mới</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Nhanh chóng và dễ dàng.</p>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex flex-col w-1/2">
              <input
                {...register("firstName")}
                placeholder="Họ"
                className="p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <input
                {...register("lastName")}
                placeholder="Tên"
                className="p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>


          <input {...register("email")} placeholder="Số di động hoặc email" className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input type="password" {...register("password")} placeholder="Mật khẩu mới" className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input type="password" {...register("confirmPassword")} placeholder="Nhập lại mật khẩu mới" className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

          {/* Ngày sinh */}
          <label className="text-sm text-gray-600">Ngày sinh</label>
          <div className="flex gap-2">
            <select {...register("dob.day")} className="w-1/3 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
              {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
            <select {...register("dob.month")} className="w-1/3 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
              {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5' ,'Tháng 6' ,'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'].map((m, i) => (
                <option key={i} value={i+1}>{m}</option>
              ))}
            </select>
            <select {...register("dob.year")} className="w-1/3 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
              {Array.from({ length: 100 }, (_, i) => 2024 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Giới tính */}
          {/* <label className="text-sm text-gray-600">Giới tính</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 border px-3 py-2 rounded w-full">
              <input type="radio" value="female" {...register("gender")} />
              Nữ
            </label>
            <label className="flex items-center gap-2 border px-3 py-2 rounded w-full">
              <input type="radio" value="male" {...register("gender")} />
              Nam
            </label>
            <label className="flex items-center gap-2 border px-3 py-2 rounded w-full">
              <input type="radio" value="custom" {...register("gender")} />
              Tùy chọn
            </label>
          </div>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>} */}

          {/* Nút submit */}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-3">
            Đăng ký
          </button>
          <a className='flex justify-center text-blue-600 underline font-semibold cursor-pointer' onClick={() => navigate("/login")}>
            <label>Đã có tài khoản?</label>
          </a>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
