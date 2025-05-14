import React, { useState } from "react";
import axios from "axios";

const PopupReport = ({ onClose, post, currentId }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const reportReasons = [
        { label: "Nội dung không phù hợp", value: "INAPPROPRIATE_CONTENT" },
        { label: "Spam hoặc lừa đảo", value: "SPAM" },
        { label: "Ngôn ngữ kích động thù địch", value: "HATE_SPEECH" },
        { label: "Thông tin sai sự thật", value: "FALSE_INFORMATION" },
        { label: "Khác", value: "OTHER" }
    ];

    const handleSubmit = async () => {
        if(post.user.id == currentId){
            alert("Bạn là chủ bài viết nên không được báo cáo")
            return
        }
        if (selectedReason) {
            try {
                setLoading(true);
                setError("");
                // Gửi dữ liệu báo cáo lên server
                const response = await axios.post("http://localhost:8080/reports/create", {
                    post: { id: post.id },
                    user: { id: currentId }, // assuming currentId is the user making the report
                    reason: selectedReason,
                    status: "PENDING", // Default status for a new report
                });

                if (response.status === 200) {
                    alert("Báo cáo của bạn đã được gửi.");
                    onClose();
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại.");
                console.error("Error reporting:", err);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Vui lòng chọn lý do báo cáo.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Báo cáo bài viết</h2>
                <div className="space-y-2">
                    {reportReasons.map((reason, index) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="reportReason"
                                value={reason.value}
                                checked={selectedReason === reason.value}
                                onChange={() => setSelectedReason(reason.value)}
                                className="accent-red-500"
                            />
                            <span>{reason.label}</span>
                        </label>
                    ))}
                </div>
                {error && <div className="text-red-500 mt-4">{error}</div>}
                <div className="flex justify-end mt-6 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-red-500'} hover:bg-red-600 text-white rounded`}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupReport;
