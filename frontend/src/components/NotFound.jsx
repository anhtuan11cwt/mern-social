// NotFound.jsx
//
// Trang 404 khi người dùng truy cập URL không tồn tại.
// Cung cấp nút quay về trang chủ.

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-5 text-center">
        <p className="text-xl font-medium text-gray-600">Mạng xã hội</p>
        <h1 className="text-5xl font-bold text-gray-800">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-500">Xin lỗi, trang này không khả dụng</p>
        <button
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/")}
          type="button"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound;
