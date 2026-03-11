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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
