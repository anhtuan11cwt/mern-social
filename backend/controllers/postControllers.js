import { cloudinary } from "../config/cloudinary.js";
import { Post } from "../models/postModel.js";
import tryCatch from "../utils/tryCatch.js";
import { urlGenerator } from "../utils/urlGenerator.js";

const newPost = tryCatch(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const { caption } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      code: 400,
      error: "Vui lòng upload file hình ảnh hoặc video",
    });
  }

  const type = req.query?.type === "reel" ? "reel" : "post";

  const fileUri = urlGenerator(file);

  if (!fileUri?.content) {
    return res
      .status(400)
      .json({ code: 400, error: "Tải file lên không hợp lệ" });
  }

  const uploadOptions = {
    folder: "mern-social/posts",
  };

  if (type === "reel") {
    uploadOptions.resource_type = "video";
  }

  const uploadedFile = await cloudinary.uploader.upload(
    fileUri.content,
    uploadOptions,
  );

  const createdPost = await Post.create({
    caption,
    owner: ownerId,
    post: {
      id: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    },
    type,
  });

  const populatedPost = await Post.findById(createdPost._id)
    .populate("owner", "-password")
    .populate("comments.user", "-password");

  return res.status(201).json({
    code: 201,
    message: "Bài viết đã được tạo",
    post: populatedPost,
  });
});

const deletePost = tryCatch(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const postId = req.params?.id;

  if (!postId) {
    return res.status(400).json({ code: 400, error: "Thiếu ID bài đăng" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy bài viết với ID này" });
  }

  if (post.owner.toString() !== ownerId.toString()) {
    return res
      .status(403)
      .json({ code: 403, error: "Bạn không có quyền xoá bài đăng này" });
  }

  const publicId = post.post?.id;

  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }

  await post.deleteOne();

  return res.status(200).json({
    code: 200,
    message: "Bài viết đã được xóa",
  });
});

const getAllPost = tryCatch(async (_req, res) => {
  const posts = await Post.find({ type: "post" })
    .populate("owner", "-password")
    .populate("comments.user", "-password")
    .sort({ createdAt: -1 });

  const reels = await Post.find({ type: "reel" })
    .populate("owner", "-password")
    .populate("comments.user", "-password")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    code: 200,
    posts,
    reels,
  });
});

const likeUnlikePost = tryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const postId = req.params?.id;

  if (!postId) {
    return res.status(400).json({ code: 400, error: "Thiếu ID bài đăng" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy bài viết với ID này" });
  }

  const likedIndex = post.likes.findIndex(
    (likedUserId) => likedUserId?.toString() === userId.toString(),
  );

  if (likedIndex !== -1) {
    post.likes.splice(likedIndex, 1);
    await post.save();

    return res.status(200).json({
      code: 200,
      likes: post.likes,
      likesCount: post.likes.length,
      message: "Đã bỏ thích bài viết",
    });
  }

  post.likes.push(userId);
  await post.save();

  return res.status(200).json({
    code: 200,
    likes: post.likes,
    likesCount: post.likes.length,
    message: "Đã thích bài viết",
  });
});

const commentOnPost = tryCatch(async (req, res) => {
  const userId = req.user?._id;
  const userName = req.user?.name;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const postId = req.params?.id;

  if (!postId) {
    return res.status(400).json({ code: 400, error: "Thiếu ID bài đăng" });
  }

  const { comment } = req.body ?? {};

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    return res.status(400).json({
      code: 400,
      error: "Nội dung bình luận không hợp lệ",
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy bài viết với ID này" });
  }

  post.comments.push({
    comment: comment.trim(),
    name: userName ?? "Unknown",
    user: userId,
  });

  await post.save();

  return res.status(200).json({
    code: 200,
    comments: post.comments,
    commentsCount: post.comments.length,
    message: "Đã thêm bình luận",
  });
});

const editCaption = tryCatch(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const postId = req.params?.id;

  if (!postId) {
    return res.status(400).json({ code: 400, error: "Thiếu ID bài đăng" });
  }

  const { caption } = req.body ?? {};

  if (!caption || typeof caption !== "string" || !caption.trim()) {
    return res.status(400).json({
      code: 400,
      error: "Nội dung chú thích không hợp lệ",
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy bài viết" });
  }

  if (post.owner.toString() !== ownerId.toString()) {
    return res
      .status(403)
      .json({ code: 403, error: "Bạn không phải chủ sở hữu bài viết này" });
  }

  post.caption = caption.trim();
  await post.save();

  return res.status(200).json({
    code: 200,
    message: "Đã cập nhật bài viết",
    post,
  });
});

const deleteComment = tryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const postId = req.params?.id;

  if (!postId) {
    return res.status(400).json({ code: 400, error: "Thiếu ID bài đăng" });
  }

  const { commentId } = req.body ?? {};

  if (!commentId) {
    return res
      .status(404)
      .json({ code: 404, error: "Vui lòng cung cấp ID bình luận" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy bài viết với ID này" });
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment?._id?.toString() === commentId.toString(),
  );

  if (commentIndex === -1) {
    return res
      .status(400)
      .json({ code: 400, error: "Không tìm thấy bình luận" });
  }

  const comment = post.comments[commentIndex];

  const isPostOwner = post.owner.toString() === userId.toString();
  const isCommentOwner = comment.user.toString() === userId.toString();

  if (!isPostOwner && !isCommentOwner) {
    return res.status(403).json({
      code: 403,
      error: "Bạn không có quyền xóa bình luận này",
    });
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  return res.status(200).json({
    code: 200,
    comments: post.comments,
    commentsCount: post.comments.length,
    message: "Đã xóa bình luận",
  });
});

export {
  newPost,
  deletePost,
  getAllPost,
  likeUnlikePost,
  commentOnPost,
  editCaption,
  deleteComment,
};
