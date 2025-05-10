import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/header";
import {
  Add,
  Camera,
  ChatBubbleOutline,
  Edit,
  KeyboardArrowDown,
  MoreHoriz,
  ShareRounded,
  ThumbUpOutlined,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const editProfileSchema = z
  .object({
    username: z.string().min(1, "Tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),

  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });


function Profile() {
  const listMenu = [
    "Bài viết", "Giới thiệu", "Bạn bè", "Ảnh", "Video", "Check in", "Xem thêm",
  ];

  const [isOpenEdit, setOpenEdit] = useState(false);
  const toggleEdit = () => {
    setAvatarPreviewUrl("")
    setOpenEdit(!isOpenEdit);
  }
  const [user, setUser] = useState({});
  const [File, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));

    axios.get("http://localhost:8080/users/getUserByToken", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    })
      .then((response) => {
        setUser(response.data);
        reset(response.data);
      })
      .catch((error) => {
        console.error("Lỗi lấy thông tin user:", error);
      });
  }, [reset]);

  const handleEditClick = () => fileInputRef.current?.click();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFile(file);
      setAvatarPreviewUrl(previewUrl);
    }
  };

  const onSubmit = async (data) => {
    const userId = user.id;
    console.log(data);
    if (!userId) {
      toast.error("Không tìm thấy ID người dùng.");
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
  
    if (data.newPassword) {
      formData.append("password", data.newPassword);
    }
  
    if (File) {
      formData.append("avatar", File);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/users/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${sessionStorage.getItem('token')}` // Add authorization header
          },
        }
      );
  
      toast.success("Cập nhật thành công!", { autoClose: 1000 });
      setUser(response.data);
      setOpenEdit(false);
  
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error details:", error.response?.data); // Add this for debugging
      toast.error("Lỗi khi cập nhật: " + (error.response?.data || error.message));
    }
  };

  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="flex flex-col relative justify-center h-auto">
      <Header />
      <div className="relative">
        {/* Cover Image */}
        <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-white h-[592px] w-full">
          <div className="relative">
            <img
              className="w-[1100px] h-[400px] rounded-lg"
              src="./src/assets/1.png"
              alt="cover"
            />
            <button className="absolute bottom-3 right-9 bg-white px-3 py-2 rounded-md flex items-center gap-2">
              <Camera />
              <span className="hidden lg:inline">Chỉnh sửa hình ảnh</span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="absolute top-[350px] w-full max-w-[1030px] h-auto">
            <div className="flex justify-between items-center">
              <div className="flex w-full items-center gap-3">
                <div className="p-[4px] bg-white rounded-full">
                  <img
                    className="bg-white w-[150px] h-[150px] rounded-full object-cover"
                    src={`http://localhost:8080/images/${user.avatarUrl}`}
                    alt="avatar"
                  />
                </div>
                <div className="relative">
                  <label className="text-3xl font-semibold">{user.username}</label>
                  <p className="absolute top-[40px] text-gray-500">942 người bạn</p>
                </div>
              </div>
              <div className="relative w-full flex justify-end gap-3">
                <button className="flex items-center px-2 py-2 bg-[#E2E5E9] rounded-lg">
                  <Add />
                  Thêm vào tin
                </button>
                <button
                  onClick={toggleEdit}
                  className="flex items-center px-2 py-2 bg-[#E2E5E9] rounded-lg"
                >
                  <Edit />
                  Chỉnh sửa trang cá nhân
                </button>
                <button className="absolute right-0 top-[45px] px-3 py-2 bg-[#E2E5E9] rounded-lg">
                  <KeyboardArrowDown />
                </button>
              </div>
            </div>

            <hr className="mt-5 mb-3" />

            <div className="flex items-center justify-between">
              <ul className="flex gap-0">
                {listMenu.map((item, index) => (
                  <li
                    key={index}
                    className={`py-3 px-3 rounded-[5px] font-semibold hover:bg-gray-300 cursor-pointer ${
                      index === 0 ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </li>
                 
                ))}
              </ul>
              <button className="px-3 py-1 bg-slate-300 rounded-lg">
                <MoreHoriz />
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="w-full flex justify-center bg-[#F2F4F7]">
          <div className="flex flex-col xl:flex-row max-w-[1030px] mt-5 gap-4">
            {/* Giới thiệu */}
            <div className="w-full xl:max-w-[40%] xl:sticky top-[67px] space-y-3">
              <div className="flex flex-col bg-white rounded-lg p-3">
                <label className="text-2xl font-semibold">Giới thiệu</label>
                <button className="bg-gray-300 py-1 font-semibold rounded-md my-4">
                  Thêm tiểu sử
                </button>
                <label>Đã học tại THPT Nguyễn Du - Hoài Nhơn - Bình Định</label>
                <label>Sống tại Hoài Nhơn, Bình Định, VietNam</label>
                <label>Có 30 người theo dõi</label>
                <button className="bg-gray-300 py-1 font-semibold rounded-md mt-2">
                  Chỉnh sửa chi tiết
                </button>
                <button className="bg-gray-300 py-1 font-semibold rounded-md mt-2">
                  Thêm nội dung đáng chú ý
                </button>
              </div>
            </div>

            {/* Bài viết */}
            <div className="w-auto xl:max-w-[60%] space-y-3">
              <div className="bg-white shadow-md p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">Nguyễn Văn A</h4>
                    <p className="text-sm text-gray-500">3 giờ trước · 🌍</p>
                  </div>
                </div>
                <div className="mt-3 text-gray-800">
                  Cuối tuần chill cùng bạn bè 🍃☕ Ai muốn đi Đà Lạt giơ tay nào 🙋‍♂️🙋‍♀️
                </div>
                <img
                  src="../src/assets/1.png"
                  alt="post"
                  className="w-full mt-3 rounded-md"
                />
                <div className="flex justify-between items-center mt-4 border-t pt-2 text-gray-600 text-sm">
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    <ThumbUpOutlined /> Thích
                  </button>
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    <ChatBubbleOutline /> Bình luận
                  </button>
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    <ShareRounded /> Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Popup chỉnh sửa */}
      {isOpenEdit && (  
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />

          <div className="fixed top-[50px] left-1/2 -translate-x-1/2 w-full max-w-[700px] bg-white rounded-xl shadow-lg z-50 max-h-[600px] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chỉnh sửa trang cá nhân</h2>
              <button
                onClick={toggleEdit}
                className="text-xl text-gray-600 hover:text-black"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Ảnh đại diện</h3>
                <img
                  src={avatarPreviewUrl || `http://localhost:8080/images/${user.avatarUrl}`}
                  className="w-[120px] h-[120px] rounded-full mx-auto object-cover"
                  alt="avatar"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p
                  className="text-blue-500 text-sm mt-2 cursor-pointer hover:underline"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold">Tên người dùng:</label>
                  <input
                    className="w-full bg-gray-200 rounded-md p-2 mt-1"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold">Email:</label>
                  <input
                    type="email"
                    readOnly
                    className="w-full bg-gray-200 rounded-md p-2 mt-1"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="font-semibold">
                    Mật khẩu mới:
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full bg-gray-200 rounded-md p-2 mt-1"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="font-semibold">
                    Xác nhận mật khẩu:
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full bg-gray-200 rounded-md p-2 mt-1"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

        </>
      )}
    </div>
  );
}

export default Profile;
