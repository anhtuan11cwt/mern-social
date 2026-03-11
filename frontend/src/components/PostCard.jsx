import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { IoChatbubble, IoHeart, IoHeartOutline, IoSend } from "react-icons/io5";

const PostCard = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const owner = post?.owner || {};
  const ownerName = owner?.name || owner?.username || "Người dùng";
  const ownerAvatar =
    owner?.profilePic?.url || owner?.avatar || "https://via.placeholder.com/40";

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

  const handleLike = () => {
    setIsLike(!isLike);
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    console.log("Comment:", commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <img
          alt={ownerName}
          className="w-10 h-10 rounded-full object-cover"
          src={ownerAvatar}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">{ownerName}</h3>
          <p className="text-xs text-gray-500">
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString("vi-VN")
              : ""}
          </p>
        </div>
        <button
          aria-label="Tùy chọn thêm"
          className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          type="button"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {post?.caption && (
        <div className="px-4 pb-3">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {post.caption}
          </p>
        </div>
      )}

      {imageUrl && (
        <div className="w-full">
          {isReel ? (
            <video
              autoPlay
              className="w-full max-h-[500px] object-contain bg-gray-900"
              controls
              controlsList="nodownload"
              loop
              muted
              playsInline
              src={imageUrl}
            />
          ) : (
            <img
              alt={post?.caption || "Bài đăng"}
              className="w-full max-h-[500px] object-contain bg-gray-100"
              src={imageUrl}
            />
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            onClick={handleLike}
            type="button"
          >
            {isLike ? (
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
              <div className="space-y-3 mb-4">
                {comments.map((comment, index) => (
                  <div className="flex gap-2" key={comment?._id || index}>
                    <img
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                      src={
                        comment?.owner?.profilePic?.url ||
                        comment?.owner?.avatar ||
                        "https://via.placeholder.com/32"
                      }
                    />
                    <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-medium text-sm text-gray-800">
                        {comment?.owner?.name ||
                          comment?.owner?.username ||
                          "Người dùng"}
                      </span>
                      <p className="text-sm text-gray-600">
                        {comment?.text || ""}
                      </p>
                    </div>
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
      </div>
    </div>
  );
};

export default PostCard;
