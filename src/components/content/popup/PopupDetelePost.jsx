import { Clear } from "@mui/icons-material";
import axios from "axios";

function PopupDeletePost({currentId, post, onClose, onDeleteSuccess, type }) {
   const deletePost = async (id) => {
        try {
            console.log(currentId)
            console.log(post.user.id)
            if(type != "share"){
                if(currentId != post.user.id){
                    alert("Bạn không có quyền xóa bài viết này")
                    return
                }
            }
            

            if (type === "share") {
                await axios.delete("http://localhost:8080/shares", {
                    params: { postId: id, userId: currentId }
                });
            } else {
                await axios.delete(`http://localhost:8080/posts/delete/${id}`);
            }
            alert("Xóa thành công!");
            onDeleteSuccess(post.id, type);
            window.location.reload()
            onClose();
        } catch (error) {
            alert("Lỗi khi xóa: " + (error.response?.data || error.message));
        }
    };


    return (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="popup-content w-[400px] bg-white rounded-lg shadow-lg p-5 relative">
                <button className="absolute right-2 top-2" onClick={onClose}>
                    <Clear />
                </button>
                <h2 className="text-lg font-semibold mb-4">Xác nhận xóa bài viết</h2>
                <p className="mb-4 text-gray-700">Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => deletePost(post.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopupDeletePost