// authControllers.js
//
// Xử lý đăng ký, đăng nhập, và đăng xuất người dùng.
// Mật khẩu được mã hóa bằng bcrypt (10 vòng) trước khi lưu.
// Token JWT được cấp phát khi xác thực thành công và lưu trong cookie httpOnly
// để ngăn chặn tấn công XSS. Token hết hạn sau 15 ngày.

import bcrypt from "bcrypt";
import { cloudinary } from "../config/cloudinary.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import tryCatch from "../utils/tryCatch.js";
import { urlGenerator } from "../utils/urlGenerator.js";

const registerUser = tryCatch(async (req, res) => {
  const { email, gender, name, password } = req.body;
  const file = req.file;

  if (!name || !email || !password || !gender || !file) {
    return res
      .status(400)
      .json({ code: 400, error: "Vui lòng cung cấp đầy đủ thông tin" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ code: 400, error: "Người dùng đã tồn tại" });
  }

  const fileUri = urlGenerator(file);

  if (!fileUri?.content) {
    return res
      .status(400)
      .json({ code: 400, error: "Tải file lên không hợp lệ" });
  }

  // Tải ảnh đại diện lên Cloudinary. Lưu public_id để xóa sau này.
  const uploadedFile = await cloudinary.uploader.upload(fileUri.content, {
    folder: "mern-social/users",
  });

  // Mã hóa mật khẩu với 10 vòng salt. Không bao giờ lưu mật khẩu dạng plain text.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    gender,
    name,
    password: hashedPassword,
    profilePic: {
      id: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    },
  });

  const token = generateToken(user._id, res);

  if (!token) {
    return res.status(500).json({ code: 500, error: "JWT chưa được cấu hình" });
  }

  // Xóa mật khẩu khỏi phản hồi vì lý do bảo mật
  const userData = user.toObject();
  delete userData.password;

  return res.status(201).json({
    code: 201,
    message: "Đăng ký tài khoản thành công",
    user: userData,
  });
});

const loginUser = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ code: 400, error: "Vui lòng cung cấp email và mật khẩu" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ code: 400, error: "Email hoặc mật khẩu không đúng" });
  }

  // So sánh mật khẩu được cung cấp với mật khẩu được mã hóa trong cơ sở dữ liệu
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res
      .status(400)
      .json({ code: 400, error: "Email hoặc mật khẩu không đúng" });
  }

  const token = generateToken(user._id, res);

  if (!token) {
    return res.status(500).json({ code: 500, error: "JWT chưa được cấu hình" });
  }

  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json({
    code: 200,
    message: "Đăng nhập thành công",
    user: userData,
  });
});

const logoutUser = tryCatch(async (_req, res) => {
  // Xóa cookie token bằng cách đặt maxAge thành 0. httpOnly ngăn truy cập từ phía client.
  res.cookie("token", null, {
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    code: 200,
    message: "Đăng xuất thành công",
  });
});

export { loginUser, logoutUser, registerUser };
