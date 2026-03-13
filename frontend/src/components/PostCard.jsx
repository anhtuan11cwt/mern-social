// PostCard.jsx
//
// Hiển thị một bài viết hoặc reel. Bao gồm: avatar/tên tác giả, caption,
// media (ảnh/video), nút like/comment, danh sách bình luận, và menu edit/delete.
//
// Tại sao dùng forwardRef: Cần truyền ref để video player có thể được
// quản lý bởi component cha (Reels page) để pause/play khi scroll.

import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { forwardRef, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { IoChatbubble, IoHeart, IoHeartOutline, IoSend } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";
import SimpleModal from "./SimpleModal";

const PostCard = forwardRef(({ post }, ref) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likeOptimistic, setLikeOptimistic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [editCaption, setEditCaption] = useState(post?.caption || "");
  const {
    addComment,
    deleteComment,
    likePost,
    deletePost,
    updateCaption,
    loading,
  } = usePostData();
  const { user } = useUserData();
  const { onlineUsers } = useContext(SocketContext) || {};

  const closeModal = () => setShowModal(false);

  const handleDeletePost = async () => {
    // Xác nhận trước khi xóa để tránh xóa nhầm
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deletePost(post._id);
        closeModal();
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      }
    }
  };

  const handleEditCaption = () => {
    setShowModal(false);
    setShowInput(true);
  };

  const handleUpdateCaption = async () => {
    // Kiểm tra caption không rỗng trước khi gửi
    if (!editCaption.trim()) {
      toast.error("Caption không được để trống");
      return;
    }

    try {
      await updateCaption(post._id, editCaption);
      setShowInput(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật caption:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditCaption(post?.caption || "");
    setShowInput(false);
  };

  const likes = post.likes || [];
  // Dùng likeOptimistic để cập nhật UI ngay, không chờ API response
  const isLiked =
    likeOptimistic !== null
      ? likeOptimistic
      : user?._id
        ? likes.some((likeId) => likeId === user._id)
        : false;

  const owner = post?.owner || {};
  const ownerName = owner?.name || owner?.username || "Người dùng";
  // Sử dụng data URI cho placeholder avatar thay vì external URL
  // để tránh phụ thuộc vào CDN bên ngoài
  const defaultAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%239ca3af'%3E%3F%3C/text%3E%3C/svg%3E";
  const ownerAvatar = owner?.profilePic?.url || owner?.avatar || defaultAvatar;
  const ownerProfilePath = owner?._id ? `/user/${owner._id}` : null;
  const isOwnerOnline = owner?._id && onlineUsers?.includes(owner._id);

  const imageUrl =
    post?.post?.url ||
    post?.imageUrl ||
    post?.photoUrl ||
    post?.fileUrl ||
    post?.url ||
    "";

  const isReel = post?.type === "reel";
  const likesCount = post?.likes?.length || 0;
  const commentsCount = post?.comments?.length || 0;
  const comments = post?.comments || [];

  const likeHandler = async () => {
    // Cập nhật UI ngay (optimistic update) rồi gửi request
    // Nếu lỗi, revert lại trạng thái cũ
    const previousLiked =
      likeOptimistic !== null
        ? likeOptimistic
        : user?._id
          ? likes.some((likeId) => likeId === user._id)
          : false;
    setLikeOptimistic(!previousLiked);
    try {
      await likePost(post._id);
    } catch {
      setLikeOptimistic(previousLiked);
    }
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e) => {
    // Gửi bình luận mới và xóa text input
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment(post._id, commentText, setCommentText);
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="relative">
          {ownerProfilePath ? (
            <Link className="cursor-pointer" to={ownerProfilePath}>
              <img
                alt={ownerName}
                className="w-10 h-10 rounded-full object-cover"
                src={ownerAvatar}
              />
            </Link>
          ) : (
            <img
              alt={ownerName}
              className="w-10 h-10 rounded-full object-cover"
              src={ownerAvatar}
            />
          )}
          {isOwnerOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          {ownerProfilePath ? (
            <Link
              className="font-semibold text-gray-800 text-sm hover:underline cursor-pointer inline-block"
              to={ownerProfilePath}
            >
              {ownerName}
            </Link>
          ) : (
            <h3 className="font-semibold text-gray-800 text-sm">{ownerName}</h3>
          )}
          <p className="text-xs text-gray-500">
            {post?.createdAt
              ? format(new Date(post.createdAt), "dd/MM/yyyy")
              : ""}
          </p>
        </div>
        {owner?._id && user?._id && owner._id === user._id && (
          <div className="relative">
            <button
              aria-label="Tùy chọn thêm"
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              onClick={() => setShowModal(!showModal)}
              type="button"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <SimpleModal
              isOpen={showModal}
              onClose={closeModal}
              position="right"
            >
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleEditCaption}
                type="button"
              >
                Chỉnh sửa
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={handleDeletePost}
                type="button"
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </button>
            </SimpleModal>
          </div>
        )}
      </div>

      {showInput ? (
        <div className="px-4 pb-3">
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Nhập caption..."
            rows="3"
            value={editCaption}
          />
        </div>
      ) : post?.caption ? (
        <div className="px-4 pb-3">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {post.caption}
          </p>
        </div>
      ) : null}

      {imageUrl && (
        <div className="w-full">
          {isReel ? (
            <video
              autoPlay
              className="w-full object-contain bg-gray-900"
              controls
              controlsList="nodownload"
              loop
              muted
              playsInline
              ref={ref}
              src={imageUrl}
            />
          ) : (
            <img
              alt={post?.caption || "Bài viết"}
              className="w-full object-contain bg-gray-100"
              src={imageUrl}
            />
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            onClick={likeHandler}
            type="button"
          >
            {isLiked ? (
              <IoHeart className="w-6 h-6 text-red-500" />
            ) : (
              <IoHeartOutline className="w-6 h-6" />
            )}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
            onClick={handleCommentToggle}
            type="button"
          >
            <IoChatbubble className="w-6 h-6" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {comments.length > 0 ? (
              <div
                className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2"
                style={{
                  scrollbarColor: "#cbd5e0 #f7fafc",
                  scrollbarWidth: "thin",
                }}
              >
                {comments.map((comment, index) => (
                  <div className="flex gap-2" key={comment?._id || index}>
                    {(() => {
                      // Trích xuất thông tin người bình luận từ nhiều format khác nhau
                      const commenter = comment?.user || comment?.owner || {};
                      const commenterName =
                        comment?.name ||
                        commenter?.name ||
                        commenter?.username ||
                        "Người dùng";
                      const commenterAvatar =
                        commenter?.profilePic?.url ||
                        commenter?.avatar ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3E%3F%3C/text%3E%3C/svg%3E";
                      const commenterProfilePath = commenter?._id
                        ? `/user/${commenter._id}`
                        : null;

                      // Kiểm tra quyền xóa: chủ bình luận hoặc chủ bài viết
                      const commenterId =
                        commenter?._id ||
                        (typeof comment?.user === "string"
                          ? comment.user
                          : comment?.user?._id);
                      const canDeleteComment =
                        user?._id &&
                        (commenterId === user._id ||
                          (owner?._id && owner._id === user._id));

                      const handleDeleteComment = async () => {
                        // Xác nhận trước khi xóa bình luận
                        if (!comment?._id) return;
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn xóa bình luận này?",
                          )
                        ) {
                          try {
                            await deleteComment(post._id, comment._id);
                          } catch (error) {
                            console.error("Lỗi khi xóa bình luận:", error);
                          }
                        }
                      };

                      return (
                        <>
                          {commenterProfilePath ? (
                            <Link
                              className="cursor-pointer"
                              to={commenterProfilePath}
                            >
                              <img
                                alt={commenterName}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                src={commenterAvatar}
                              />
                            </Link>
                          ) : (
                            <img
                              alt={commenterName}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                              src={commenterAvatar}
                            />
                          )}
                          <div className="flex-1 flex items-start gap-2">
                            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                              {commenterProfilePath ? (
                                <Link
                                  className="font-medium text-sm text-gray-800 hover:underline cursor-pointer"
                                  to={commenterProfilePath}
                                >
                                  {commenterName}
                                </Link>
                              ) : (
                                <span className="font-medium text-sm text-gray-800">
                                  {commenterName}
                                </span>
                              )}
                              <p className="text-sm text-gray-600">
                                {comment?.comment || comment?.text || ""}
                              </p>
                            </div>
                            {canDeleteComment && (
                              <button
                                aria-label={
                                  commenterId === user._id
                                    ? "Xóa bình luận của bạn"
                                    : "Xóa bình luận (bạn là chủ bài viết)"
                                }
                                className="text-red-500 hover:text-red-600 p-1 cursor-pointer transition-colors"
                                onClick={handleDeleteComment}
                                title={
                                  commenterId === user._id
                                    ? "Xóa bình luận của bạn"
                                    : "Xóa bình luận (bạn là chủ bài viết)"
                                }
                                type="button"
                              >
                                <MdDelete className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">
                Chưa có bình luận nào.
              </p>
            )}

            <form className="flex gap-2" onSubmit={handleSubmitComment}>
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                type="text"
                value={commentText}
              />
              <button
                className="text-blue-500 hover:text-blue-600 p-2 cursor-pointer"
                type="submit"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {showInput && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <button
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={handleUpdateCaption}
              type="button"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button
              className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
              onClick={handleCancelEdit}
              type="button"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default PostCard;
