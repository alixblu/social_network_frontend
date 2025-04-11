import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/header";
import { useNavigate } from "react-router-dom";
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
function Profile() {
  const listMenu = [
    "Bài viết",
    "Giới thiệu",
    "Bạn bè",
    "Ảnh",
    "Video",
    "Check in",
    "Xem thêm",
  ];

  const [isOpenEdit, setOpenEdit] = useState(false);

  const toggleEdit = () => {
    setOpenEdit(!isOpenEdit);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col relative justify-center max-h-max">
      <Header />
      <div className="relative">
        {/* top */}
        <div className="flex flex-col items-center bg-slate-400 h-[592px] w-full">
          {/* top-1 */}
          <div className="relative">
            <img
              className="w-[1100px] h-[400px] rounded-lg"
              src="./src/assets/1.png"
              alt=""
            />
            <button className="absolute bottom-3 right-9 bg-white px-3 py-2 rounded-md flex items-center gap-2">
              <Camera />
              <span className="hidden lg:inline">Chỉnh sửa hình ảnh</span>
            </button>
          </div>

          {/* top-2 */}
          <div className="absolute top-[350px] w-full max-w-[1030px] h-auto">
            <div className="flex justify-between items-center">
              <div className="flex w-full items-center gap-3">
                <div className="p-[4px] bg-white rounded-full">
                  <img
                    className="bg-white w-[150px] rounded-full"
                    src="../src/assets/1.png"
                    alt=""
                  />
                </div>
                <div className="relative">
                  <label className="text-3xl font-semibold" htmlFor="">
                    Huỳnh Vĩ
                  </label>
                  <p className="absolute top-[40px]">942 người bạn</p>
                </div>
              </div>
              <div className="relative w-full flex justify-end gap-3">
                <button className="flex items-center px-2 py-2 bg-slate-500 rounded-lg">
                  <Add/>
                  Thêm vào tin
                </button>
                <button
                  onClick={toggleEdit}
                  className="flex items-center px-2 py-2 bg-slate-500 rounded-lg"
                >
                  <Edit/>
                  Chỉnh sửa trang cá nhân
                </button>
                <button className="absolute right-0 top-[45px] px-2 py-2 bg-slate-500 rounded-lg">
                  {" "}
                  <KeyboardArrowDown />{" "}
                </button>
              </div>
            </div>
            <hr className="mt-5 mb-3" />

            {/* ListMenu */}
            <div>
              <div className="flex items-center justify-between">
                <ul className="flex gap-0">
                  {listMenu.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 px-3 rounded-[5px] font-semibold hover:bg-gray-500 "
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div>
                  <button className="px-3 py-1 bg-slate-300 rounded-lg">
                    <MoreHoriz />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MainContent */}
        <div className="w-full flex justify-center bg-slate-300">
          <div className="flex flex-col min-w-max xl:flex xl:flex-row  max-w-[1030px] mt-5 gap-4">
            {/* leftContent */}
            <div className="w-full xl:max-w-[40%]  xl:sticky top-[67px] h-full space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col bg-white rounded-lg p-3">
                  <label className="text-2xl  font-semibold" htmlFor="">
                    Giới thiệu
                  </label>
                  <button className="bg-gray-300  py-1 font-semibold rounded-md my-4">
                    Thêm tiểu sử
                  </button>
                  <label htmlFor="">
                    Đã học tại THPT Nguyễn Du - Hoài Nhơn - Bình Định
                  </label>
                  <label htmlFor="">
                    Sống tại Hoai Nhon, Bình Định, VietNam
                  </label>
                  <label htmlFor="">Có 30 người theo dõi</label>
                  <button className="bg-gray-300  py-1 font-semibold rounded-md mt-2">
                    Chỉnh sửa chi tiết
                  </button>
                  <br />
                  <button className="bg-gray-300 py-1 font-semibold rounded-md">
                    Thêm nội dung đáng chú ý
                  </button>
                </div>
              ))}
            </div>

            {/* rightContent */}
            <div className="w-auto xl:max-w-[60%]  space-y-3">
              <div className=" mx-auto bg-white shadow-md p-4 rounded-xl">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Nguyễn Văn A
                    </h4>
                    <p className="text-sm text-gray-500">3 giờ trước · 🌍</p>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <p className="text-gray-800 text-base">
                    Cuối tuần chill cùng bạn bè 🍃☕ Ai muốn đi Đà Lạt giơ tay
                    nào 🙋‍♂️🙋‍♀️
                  </p>
                </div>

                {/* Image */}
                <div className="mt-3">
                  <img
                    src="../src/assets/1.png"
                    alt="post"
                    className="w-full rounded-md"
                  />
                </div>

                {/* Interaction buttons */}
                <div className="flex justify-between items-center mt-4 border-t pt-2 text-gray-600 text-sm">
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    <ThumbUpOutlined /> Thích
                  </button>
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    <ChatBubbleOutline /> Bình luận
                  </button>
                  <button className="hover:text-blue-500 flex items-center gap-1">
                    ↗<ShareRounded /> Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* popup-Edit  */}
      {isOpenEdit && (
        <>
          {/* Overlay mờ nền */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />

          {/* Modal content */}
          <div className="fixed top-[50px] left-1/2 -translate-x-1/2 w-full  max-w-[700px]  bg-white rounded-xl shadow-lg z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chỉnh sửa trang cá nhân</h2>
              <button 
                onClick={toggleEdit} 
                className="text-gray-500 hover:text-black text-xl rounded-full bg-slate-200 flex items-center justify-center w-8 h-8"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Ảnh đại diện */}
              <div className="text-center">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-left">Ảnh đại diện</h3>
                  <p className="text-blue-500 text-sm mt-1 cursor-pointer hover:underline">Chỉnh sửa</p>
                </div>
                <img
                  src="./src/assets/1.png"
                  className="w-[120px] h-[120px] rounded-full mx-auto object-cover"
                />
              </div>

              {/* Ảnh bìa */}
              <div className="text-center">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-left">Ảnh Bìa</h3>
                  <p className="text-blue-500 text-sm mt-1 cursor-pointer hover:underline">Chỉnh sửa</p>
                </div>
                <img
                  src="./src/assets/1.png"
                  className="rounded-lg mx-auto max-h-[150px] object-cover"
                />
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default Profile;
