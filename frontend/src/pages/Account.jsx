import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/loading";
import Modal from "../components/Modal";
import PostCard from "../components/PostCard";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";

const followData = async (id) => {
  const { data } = await axios.get(`/api/user/followdata/${id}`);
  return { followers: data.followers, following: data.following };
};

const Account = ({ user }) => {
  const { logoutUser, updateProfilePic, updateProfileName } = useUserData();
  const { posts, reels, loading } = usePostData();
  const navigate = useNavigate();
  const [type, setType] = useState("post");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [showOne, setShowOne] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [file, setFile] = useState(null);
  const [isUpdatingPic, setIsUpdatingPic] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [name, setName] = useState(user?.name || "");

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

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  const updateName = () => {
    if (name.trim()) {
      updateProfileName(user._id, name, () => setActiveModal(null));
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới");
      return;
    }
    try {
      await axios.post("/api/user/update-password", {
        newPassword,
        oldPassword,
      });
      toast.success("Cập nhật mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setActiveModal(null);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Cập nhật mật khẩu thất bại";
      toast.error(message);
    }
  };

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const changeImageHandler = async () => {
    if (!file) {
      return;
    }
    setIsUpdatingPic(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await updateProfilePic(formData, user._id);
      setFile(null);
      setActiveModal(null);
    } finally {
      setIsUpdatingPic(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      const fetchFollowData = async () => {
        try {
          const data = await followData(user._id);
          setFollowersData(data.followers);
          setFollowingData(data.following);
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      };
      fetchFollowData();
    }
  }, [user?._id]);

  if (!user) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto px-4 pt-8 pb-24 max-w-2xl">
      <div className="bg-white shadow-md mb-6 p-8 rounded-lg">
        <div className="flex flex-col items-center">
          <img
            alt="Ảnh đại diện"
            className="mb-4 rounded-full w-44 h-44 object-cover border-4 border-gray-200"
            src={user.profilePic?.url || "https://via.placeholder.com/180"}
          />

          {activeModal === "name" ? (
            <div className="flex items-center gap-2 mb-2 w-full justify-center">
              <input
                className="custom-input px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-xs"
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
                onClick={updateName}
                type="button"
              >
                Cập nhật
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-full font-bold text-white transition-colors cursor-pointer w-10 h-10 flex items-center justify-center shrink-0"
                onClick={() => {
                  setActiveModal(null);
                  setName(user.name);
                }}
                type="button"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-gray-800 text-2xl">{user.name}</h2>
              <button
                className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer bg-transparent border-none p-1"
                onClick={() => {
                  setActiveModal("name");
                  setName(user.name);
                }}
                type="button"
              >
                <MdEdit className="w-6 h-6" />
              </button>
            </div>
          )}

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

          <div className="flex gap-4 mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
              disabled={isUpdatingPic}
              onClick={
                activeModal === "upload"
                  ? changeImageHandler
                  : () => setActiveModal("upload")
              }
              type="button"
            >
              {isUpdatingPic
                ? "Đang cập nhật..."
                : activeModal === "upload" && file
                  ? "Cập nhật ảnh đại diện"
                  : "Cập nhật ảnh đại diện"}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
              onClick={() => setActiveModal("password")}
              type="button"
            >
              Cập nhật mật khẩu
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
              onClick={logoutHandler}
              type="button"
            >
              Đăng xuất
            </button>
          </div>

          {activeModal === "upload" && (
            <div className="flex flex-col items-center gap-4 mb-6 w-full">
              <input
                accept="image/*"
                className="block w-full max-w-xs px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onChange={changeFileHandler}
                type="file"
              />
              <button
                className="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer w-full max-w-xs"
                onClick={() => {
                  setActiveModal(null);
                  setFile(null);
                }}
                type="button"
              >
                Hủy
              </button>
            </div>
          )}

          {activeModal === "password" && (
            <form
              className="flex flex-col gap-4 mb-6 w-full max-w-xs mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200"
              onSubmit={updatePassword}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">Cập nhật mật khẩu</h3>
                <button
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full font-bold text-white transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
                  onClick={() => {
                    setActiveModal(null);
                    setOldPassword("");
                    setNewPassword("");
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Mật khẩu cũ"
                  type={showOldPass ? "text" : "password"}
                  value={oldPassword}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer bg-transparent border-none p-1"
                  onClick={() => setShowOldPass(!showOldPass)}
                  type="button"
                >
                  {showOldPass ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu mới"
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer bg-transparent border-none p-1"
                  onClick={() => setShowNewPass(!showNewPass)}
                  type="button"
                >
                  {showNewPass ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
                type="submit"
              >
                Cập nhật
              </button>
            </form>
          )}
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

export default Account;
