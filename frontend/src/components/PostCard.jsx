import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { forwardRef, useState } from "react";
import { IoChatbubble, IoHeart, IoHeartOutline, IoSend } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";

const PostCard = forwardRef(({ post }, ref) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likeOptimistic, setLikeOptimistic] = useState(null);
  const { addComment, deleteComment, likePost } = usePostData();
  const { user } = useUserData();

  const likes = post.likes || [];
  const isLiked =
    likeOptimistic !== null
      ? likeOptimistic
      : user?._id
        ? likes.some((likeId) => likeId === user._id)
        : false;

  const owner = post?.owner || {};
  const ownerName = owner?.name || owner?.username || "Người dùng";
  // Sử dụng data URI cho placeholder avatar thay vì external URL
  const defaultAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%239ca3af'%3E%3F%3C/text%3E%3C/svg%3E";
  const ownerAvatar = owner?.profilePic?.url || owner?.avatar || defaultAvatar;
  const ownerProfilePath = owner?._id ? `/user/${owner._id}` : null;

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
          <button
            aria-label="Tùy chọn thêm"
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            type="button"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
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
                        if (!comment?._id) return;
                        try {
                          await deleteComment(post._id, comment._id);
                        } catch (error) {
                          console.error("Lỗi khi xóa bình luận:", error);
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
                                aria-label="Xóa bình luận"
                                className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                                onClick={handleDeleteComment}
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
      </div>
    </div>
  );
});

export default PostCard;
