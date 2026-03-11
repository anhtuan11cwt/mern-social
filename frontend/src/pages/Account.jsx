import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";

const Account = ({ user }) => {
  const { logoutUser } = useUserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Đang tải...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            alt="Ảnh đại diện"
            className="w-44 h-44 rounded-full object-cover mb-4"
            src={user.profilePic?.url || "https://via.placeholder.com/180"}
          />

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>

          <p className="text-gray-600 mb-1">{user.email}</p>

          <p className="text-gray-600 mb-6">
            Giới tính:{" "}
            <span className="font-medium">
              {user.gender === "male"
                ? "Nam"
                : user.gender === "female"
                  ? "Nữ"
                  : "Chưa cập nhật"}
            </span>
          </p>

          <div className="flex gap-8 mb-6">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">
                {user.followers?.length || 0}
              </p>
              <p className="text-gray-600 text-sm">Người theo dõi</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">
                {user.following?.length || 0}
              </p>
              <p className="text-gray-600 text-sm">Đang theo dõi</p>
            </div>
          </div>

          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer"
            onClick={logoutHandler}
            type="button"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
