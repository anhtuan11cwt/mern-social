import { User } from "../models/userModel.js";
import tryCatch from "../utils/tryCatch.js";

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

export { myProfile, userProfile };
