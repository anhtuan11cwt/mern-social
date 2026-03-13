// postModel.js
//
// Đại diện cho một bài viết hoặc reel (video) trong feed xã hội.
// Lưu trữ siêu dữ liệu phương tiện từ Cloudinary (public_id để xóa).
// Bình luận và thích được nhúng mảng để truy cập nhanh.
//
// Loại: "post" cho hình ảnh, "reel" cho video.
// Thích: Mảng ID người dùng đã thích bài viết này.
// Bình luận: Tài liệu nhúng với tham chiếu người dùng, văn bản và dấu thời gian.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Chú thích/mô tả tùy chọn
    caption: {
      trim: true,
      type: String,
    },
    // Mảng bình luận nhúng. Mỗi bình luận lưu trữ ID người dùng, tên, văn bản và dấu thời gian.
    comments: [
      {
        comment: {
          required: true,
          type: String,
        },
        createdAt: {
          default: Date.now,
          type: Date,
        },
        name: {
          required: true,
          type: String,
        },
        user: {
          ref: "User",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    // Mảng ID người dùng đã thích bài viết này
    likes: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    // Người dùng đã tạo bài viết này
    owner: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    // Siêu dữ liệu phương tiện Cloudinary (public_id được sử dụng để xóa)
    post: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    // Phân biệt giữa bài viết thông thường và reel video
    type: {
      default: "post",
      enum: ["post", "reel"],
      required: true,
      type: String,
    },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
