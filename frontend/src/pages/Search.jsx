// Search.jsx
//
// Trang tìm kiếm cho phép người dùng tìm kiếm và theo dõi người dùng khác.
// Hiển thị danh sách người dùng khớp với từ khóa tìm kiếm.

import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/loading";
import { useUserData } from "../hooks/useUserData";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser, followUser } = useUserData();

  const fetchUsers = async () => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      // Gọi API tìm kiếm người dùng theo tên.
      const { data } = await axios.get(`/api/user/all?search=${search}`);
      // Lọc ra người dùng hiện tại khỏi kết quả tìm kiếm.
      const filteredUsers = data.users.filter(
        (user) => user._id !== currentUser?._id,
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleFollow = async (userId) => {
    try {
      await followUser({ fetchUser: fetchUsers, id: userId });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const isFollowing = (user) => {
    // Kiểm tra xem người dùng hiện tại có theo dõi người dùng này không.
    // Hỗ trợ cả follower là string (ID) hoặc object.
    return user.followers?.some((follower) => {
      if (!follower) return false;
      if (typeof follower === "string") {
        return follower === currentUser?._id;
      }
      return follower._id === currentUser?._id;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Tìm kiếm người dùng
          </h1>

          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập tên người dùng..."
              type="text"
              value={search}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
              type="submit"
            >
              Tìm
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingAnimation />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {search.trim()
                ? "Không tìm thấy người dùng nào"
                : "Nhập tên để tìm kiếm"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  key={user._id}
                >
                  <Link
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    to={`/user/${user._id}`}
                  >
                    <img
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      src={
                        user.profilePic?.url || "https://via.placeholder.com/40"
                      }
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </Link>

                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isFollowing(user)
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => handleFollow(user._id)}
                    type="button"
                  >
                    {isFollowing(user) ? "Đã theo dõi" : "Theo dõi"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
