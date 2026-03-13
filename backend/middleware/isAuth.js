// isAuth.js
//
// Middleware bảo vệ các route bằng cách xác minh token JWT.
// Trích xuất token từ cookie httpOnly, xác thực chữ ký,
// và gắn đối tượng user vào req.user cho các handler phía sau.
//
// Trả về 403 nếu không có token, 401 nếu token không hợp lệ hoặc hết hạn.
// Phân biệt giữa token hết hạn và token bị giả mạo trong thông báo lỗi.

import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(403)
        .json({ code: 403, error: "Vui lòng đăng nhập để tiếp tục" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ code: 500, error: "JWT chưa được cấu hình" });
    }

    // Xác minh chữ ký token và thời gian hết hạn
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy người dùng từ cơ sở dữ liệu và loại trừ trường password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        code: 401,
        error: "Tài khoản không tồn tại hoặc đã bị xoá",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    // Phân biệt giữa token hết hạn và token không hợp lệ để cải thiện UX
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ code: 401, error: "Token đã hết hạn, vui lòng đăng nhập lại" });
    }

    return res
      .status(401)
      .json({ code: 401, error: "Token không hợp lệ, vui lòng đăng nhập lại" });
  }
};

export default isAuth;
