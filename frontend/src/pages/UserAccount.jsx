// UserAccount.jsx
//
// Trang hồ sơ người dùng hiển thị thông tin cá nhân, bài viết và reel.
// Cho phép theo dõi/bỏ theo dõi người dùng khác hoặc chỉnh sửa hồ sơ của chính mình.

import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/loading";
import Modal from "../components/Modal";
import PostCard from "../components/PostCard";
import { SocketContext } from "../context/SocketContext";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";

// Lấy danh sách người theo dõi và đang theo dõi của người dùng.
const followData = async (id) => {
  const { data } = await axios.get(`/api/user/followdata/${id}`);
  return { followers: data.followers, following: data.following };
};

const UserAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, followUser } = useUserData();
  const { posts, reels } = usePostData();
  const { onlineUsers } = useContext(SocketContext) || {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("post");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [follow, setFollow] = useState(false);
  const [show, setShow] = useState(false);
  const [showOne, setShowOne] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      // Lấy thông tin người dùng từ ID trong URL.
      const { data } = await axios.get(`/api/user/${id}`);
      setUser(data.user);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể tải thông tin người dùng";
      toast.error(message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id, fetchUser]);

  useEffect(() => {
    if (id) {
      const fetchFollowData = async () => {
        try {
          const data = await followData(id);
          setFollowersData(data.followers);
          setFollowingData(data.following);
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      };
      fetchFollowData();
    }
  }, [id]);

  const myPost = posts.filter((post) => post.owner?._id === user?._id);
  const myReels = reels.filter((reel) => reel.owner?._id === user?._id);

  const previousReel = () => {
    if (currentReelIndex === 0) return;
    setCurrentReelIndex(currentReelIndex - 1);
  };

  const nextReel = () => {
    if (currentReelIndex === myReels.length - 1) return;
    setCurrentReelIndex(currentReelIndex + 1);
  };

  const isOwnProfile = currentUser?._id === user?._id;

  useEffect(() => {
    if (!user || !currentUser) return;

    // Kiểm tra xem người dùng hiện tại có theo dõi người dùng này không.
    // Hỗ trợ cả follower là string (ID) hoặc object.
    const hasFollowed = user.followers?.some((follower) => {
      if (!follower) return false;
      if (typeof follower === "string") {
        return follower === currentUser._id;
      }
      return follower._id === currentUser._id;
    });

    setFollow(Boolean(hasFollowed));
  }, [user, currentUser]);

  const followHandler = async () => {
    // Cập nhật UI ngay lập tức, sau đó gọi API.
    // Nếu API thất bại, hoàn nguyên trạng thái.
    setFollow((prev) => !prev);
    try {
      await followUser({ fetchUser, id: user._id });
    } catch {
      setFollow((prev) => !prev);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="mx-auto px-4 pt-8 pb-24 max-w-2xl">
      <div className="bg-white shadow-md mb-6 p-8 rounded-lg">
        <div className="flex flex-col items-center">
          <img
            alt="Ảnh đại diện"
            className="mb-4 rounded-full w-44 h-44 object-cover"
            src={user.profilePic?.url || "https://via.placeholder.com/180"}
          />

          <h2 className="mb-2 font-bold text-gray-800 text-2xl">
            <div className="flex justify-center items-center gap-3">
              {user.name}
              {user._id && onlineUsers?.includes(user._id) && (
                <span className="text-green-500 font-bold text-sm">Online</span>
              )}
            </div>
          </h2>

          <p className="mb-1 text-gray-600">{user.email}</p>

          <p className="mb-6 text-gray-600">
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
            <button
              className="text-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0"
              onClick={() => setShow(true)}
              type="button"
            >
              <p className="font-bold text-gray-800 text-xl">
                {user.followers?.length || 0}
              </p>
              <p className="text-gray-600 text-sm">Người theo dõi</p>
            </button>
            <button
              className="text-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0"
              onClick={() => setShowOne(true)}
              type="button"
            >
              <p className="font-bold text-gray-800 text-xl">
                {user.following?.length || 0}
              </p>
              <p className="text-gray-600 text-sm">Đang theo dõi</p>
            </button>
          </div>

          <div className="flex gap-4">
            {isOwnProfile ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
                onClick={() => navigate("/account")}
                type="button"
              >
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <button
                className={`px-6 py-2 rounded-md font-medium text-white transition-colors cursor-pointer ${
                  follow
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-400 hover:bg-blue-500"
                }`}
                onClick={followHandler}
                type="button"
              >
                {follow ? "Bỏ theo dõi" : "Theo dõi"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              type === "post"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setType("post");
              setCurrentReelIndex(0);
            }}
            type="button"
          >
            Bài viết
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              type === "reel"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setType("reel");
              setCurrentReelIndex(0);
            }}
            type="button"
          >
            Reels
          </button>
        </div>

        {type === "post" ? (
          myPost.length > 0 ? (
            <div className="space-y-6">
              {myPost.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-gray-500 text-center">
              Chưa có bài viết nào
            </p>
          )
        ) : myReels.length > 0 ? (
          <div className="relative">
            <PostCard post={{ ...myReels[currentReelIndex], type: "reel" }} />

            <div className="flex flex-col gap-4 right-0 top-1/2 absolute -translate-y-1/2 translate-x-full ml-4">
              {myReels.length > 1 && currentReelIndex > 0 && (
                <button
                  aria-label="Reel trước"
                  className="bg-gray-500/80 hover:bg-gray-500 p-3 rounded-full text-white transition-colors duration-200 cursor-pointer"
                  onClick={previousReel}
                  type="button"
                >
                  <FaArrowUp className="w-4 h-4" />
                </button>
              )}

              {myReels.length > 1 && currentReelIndex < myReels.length - 1 && (
                <button
                  aria-label="Reel tiếp theo"
                  className="bg-gray-500/80 hover:bg-gray-500 p-3 rounded-full text-white transition-colors duration-200 cursor-pointer"
                  onClick={nextReel}
                  type="button"
                >
                  <FaArrowDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="py-8 text-gray-500 text-center">Chưa có reel nào</p>
        )}
      </div>

      {show && (
        <Modal setShow={setShow} title="Người theo dõi" value={followersData} />
      )}
      {showOne && (
        <Modal
          setShow={setShowOne}
          title="Đang theo dõi"
          value={followingData}
        />
      )}
    </div>
  );
};

export default UserAccount;
