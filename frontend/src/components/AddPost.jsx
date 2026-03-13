// AddPost.jsx
//
// Form để tạo bài viết hoặc reel mới. Cho phép người dùng chọn file media,
// thêm chú thích, và xem trước trước khi đăng.
//
// Tại sao tách riêng component: Được dùng ở nhiều nơi (trang chủ, modal),
// nên tách thành component tái sử dụng để tránh lặp code.

import { X } from "lucide-react";
import { useContext, useState } from "react";
import { PostContext } from "../context/PostContext.js";
import { LoadingAnimation } from "./loading";

const AddPost = ({ type = "post", onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { addPost, addLoading } = useContext(PostContext);

  const isReel = type === "reel";

  const changeFileHandler = (e) => {
    // Tạo preview URL từ file được chọn để hiển thị ngay cho người dùng
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);

    const createdPost = await addPost({
      formData,
      setCaption,
      setFile,
      setFilePreview,
      type,
    });

    if (onPostCreated && createdPost) {
      onPostCreated(createdPost);
    }
  };

  const removePreview = () => {
    // Giải phóng memory của preview URL trước khi xóa
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isReel ? "Đăng Reel" : "Đăng bài"}
      </h2>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Chú thích..."
            type="text"
            value={caption}
          />
        </div>

        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-700"
            htmlFor="file-input"
          >
            Chọn {isReel ? "video" : "hình ảnh"}
          </label>
          <input
            accept={isReel ? "video/*" : "image/*"}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            id="file-input"
            onChange={changeFileHandler}
            type="file"
          />
        </div>

        {filePreview && (
          <div className="mb-4 relative">
            {isReel ? (
              <video
                className="w-full h-[300px] object-cover rounded-lg"
                controls
                controlsList="nodownload"
                src={filePreview}
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                alt="Xem trước"
                className="w-full h-[300px] object-cover rounded-lg"
                src={filePreview}
              />
            )}
            <button
              aria-label="Xóa file"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
              onClick={removePreview}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
          disabled={addLoading || !file}
          type="submit"
        >
          {addLoading ? (
            <>
              <LoadingAnimation />
              <span>Đang đăng...</span>
            </>
          ) : isReel ? (
            "Đăng Reel"
          ) : (
            "Đăng bài"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
