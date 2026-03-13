// generateToken.js
//
// Tạo token JWT và đặt nó trong cookie httpOnly.
// Token hết hạn sau 15 ngày. httpOnly ngăn chặn tấn công XSS.
// Cờ Secure được bật trong production để thực thi HTTPS.

import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  // Ký token với payload userId. Hết hạn trong 15 ngày.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Đặt cookie httpOnly để ngăn truy cập từ phía client (bảo vệ XSS)
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 ngày tính bằng mili giây
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

export { generateToken };
