// userController.js
//
// Xử lý các hoạt động hồ sơ người dùng: xem, theo dõi, và cập nhật tài khoản.
// Ảnh đại diện được lưu trữ trên Cloudinary; hình ảnh cũ được xóa khi cập nhật.
// Quan hệ theo dõi/bỏ theo dõi là hai chiều: cập nhật mảng người theo dõi/đang theo dõi của cả hai người dùng.

import bcrypt from "bcrypt";
import { cloudinary } from "../config/cloudinary.js";
import { User } from "../models/userModel.js";
import tryCatch from "../utils/tryCatch.js";
import { urlGenerator } from "../utils/urlGenerator.js";

// Lấy hồ sơ của người dùng hiện tại
const myProfile = tryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng" });
  }

  return res.status(200).json({
    code: 200,
    user,
  });
});

// Lấy hồ sơ công khai của bất kỳ người dùng nào theo ID
const userProfile = tryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: 400, error: "Thiếu ID người dùng" });
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng với ID này" });
  }

  return res.status(200).json({
    code: 200,
    user,
  });
});

// Bật/tắt quan hệ theo dõi giữa hai người dùng.
// Cập nhật mảng người theo dõi và đang theo dõi của cả hai người dùng theo hai chiều.
// Ngăn chặn tự theo dõi.
const followAndUnFollowUser = tryCatch(async (req, res) => {
  const currentUserId = req.user?._id;
  const { id: targetUserId } = req.params;

  if (!currentUserId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  if (!targetUserId) {
    return res
      .status(400)
      .json({ code: 400, error: "Thiếu ID người dùng cần theo dõi" });
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng với ID này" });
  }

  // Ngăn chặn tự theo dõi
  if (targetUser._id.toString() === currentUserId.toString()) {
    return res
      .status(400)
      .json({ code: 400, error: "Bạn không thể tự theo dõi chính mình" });
  }

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy tài khoản hiện tại" });
  }

  // Kiểm tra xem đã theo dõi chưa
  const isAlreadyFollowing = targetUser.followers.some(
    (followerId) => followerId.toString() === currentUserId.toString(),
  );

  if (isAlreadyFollowing) {
    // Bỏ theo dõi: xóa khỏi mảng của cả hai người dùng
    const followingIndex = currentUser.following.findIndex(
      (followingId) => followingId.toString() === targetUserId.toString(),
    );

    if (followingIndex !== -1) {
      currentUser.following.splice(followingIndex, 1);
    }

    const followerIndex = targetUser.followers.findIndex(
      (followerId) => followerId.toString() === currentUserId.toString(),
    );

    if (followerIndex !== -1) {
      targetUser.followers.splice(followerIndex, 1);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({
      code: 200,
      message: "Bỏ theo dõi người dùng thành công",
    });
  }

  // Theo dõi: thêm vào mảy của cả hai người dùng
  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await Promise.all([currentUser.save(), targetUser.save()]);

  return res.status(200).json({
    code: 200,
    message: "Theo dõi người dùng thành công",
  });
});

// Lấy danh sách người theo dõi và đang theo dõi của một người dùng
const userFollowerAndFollowingData = tryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: 400, error: "Thiếu ID người dùng" });
  }

  const user = await User.findById(id)
    .populate("followers", "-password")
    .populate("following", "-password");

  if (!user) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng với ID này" });
  }

  const { followers, following } = user;

  return res.status(200).json({
    code: 200,
    followers,
    following,
  });
});

// Cập nhật hồ sơ người dùng: tên và/hoặc ảnh đại diện.
// Ảnh đại diện cũ được xóa khỏi Cloudinary trước khi tải lên ảnh mới.
const updateProfile = tryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng" });
  }

  const { name } = req.body;
  const file = req.file;

  if (!name && !file) {
    return res
      .status(400)
      .json({ code: 400, error: "Không có dữ liệu để cập nhật" });
  }

  if (name) {
    user.name = name;
  }

  if (file) {
    // Xóa ảnh đại diện cũ khỏi Cloudinary
    if (user.profilePic?.id) {
      await cloudinary.uploader.destroy(user.profilePic.id);
    }

    const fileUri = urlGenerator(file);

    if (!fileUri?.content) {
      return res
        .status(400)
        .json({ code: 400, error: "Tải file lên không hợp lệ" });
    }

    const uploadedFile = await cloudinary.uploader.upload(fileUri.content, {
      folder: "mern-social/users",
    });

    user.profilePic = {
      id: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    };
  }

  await user.save();

  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json({
    code: 200,
    message: "Cập nhật hồ sơ thành công",
    user: userData,
  });
});

// Cập nhật mật khẩu người dùng. Yêu cầu xác minh mật khẩu cũ.
// Mật khẩu mới được mã hóa bằng bcrypt trước khi lưu trữ.
const updatePassword = tryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      code: 400,
      error: "Vui lòng cung cấp mật khẩu cũ và mật khẩu mới",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ code: 404, error: "Không tìm thấy người dùng" });
  }

  // Xác minh mật khẩu cũ trước khi cho phép thay đổi
  const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);

  if (!isValidOldPassword) {
    return res.status(400).json({ code: 400, error: "Wrong old password" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  await user.save();

  return res.status(200).json({
    code: 200,
    message: "Cập nhật mật khẩu thành công",
  });
});

// Tìm kiếm người dùng theo tên. Loại trừ người dùng hiện tại khỏi kết quả.
// Tìm kiếm regex không phân biệt chữ hoa/thường trên trường tên.
const getAllUsers = tryCatch(async (req, res) => {
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    return res
      .status(401)
      .json({ code: 401, error: "Vui lòng đăng nhập để tiếp tục" });
  }

  const search = req.query.search || "";

  const users = await User.find({
    _id: { $ne: currentUserId },
    name: { $options: "i", $regex: search },
  }).select("-password");

  return res.status(200).json({
    code: 200,
    users,
  });
});

export {
  myProfile,
  userProfile,
  followAndUnFollowUser,
  userFollowerAndFollowingData,
  updateProfile,
  updatePassword,
  getAllUsers,
};
