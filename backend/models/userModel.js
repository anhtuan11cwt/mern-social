// userModel.js
//
// Schema người dùng cho xác thực và quản lý hồ sơ.
// Lưu trữ mật khẩu được mã hóa (không bao giờ dạng plain text). Ảnh đại diện
// được lưu trữ trên Cloudinary với public_id để xóa.
//
// followers/following: Mảng ID người dùng cho biểu đồ xã hội.
// Được sử dụng để lấy danh sách người theo dõi và kiểm tra trạng thái theo dõi.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    // Danh sách người dùng theo dõi người dùng này
    followers: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    // Danh sách người dùng mà người dùng này đang theo dõi
    following: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    gender: {
      enum: ["male", "female"],
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    // Luôn được mã hóa bằng bcrypt trước khi lưu
    password: {
      required: true,
      type: String,
    },
    // Siêu dữ liệu hình ảnh Cloudinary cho ảnh đại diện
    profilePic: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
