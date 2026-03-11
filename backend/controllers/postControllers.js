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

  return res.status(201).json({
    code: 201,
    message: "Bài viết đã được tạo",
    post: createdPost,
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
    .populate("owner")
    .sort({ createdAt: -1 });

  const reels = await Post.find({ type: "reel" })
    .populate("owner")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    code: 200,
    posts,
    reels,
  });
});

export { newPost, deletePost, getAllPost };
