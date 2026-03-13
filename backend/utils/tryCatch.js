// tryCatch.js
//
// Wrapper cho các handler route không đồng bộ để tự động bắt lỗi.
// Ngăn chặn các promise rejection không được xử lý và cung cấp phản hồi lỗi nhất quán.
// Nếu header đã được gửi, chuyển lỗi đến middleware tiếp theo thay vào đó.

const tryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // Nếu phản hồi đã bắt đầu, chuyển đến middleware xử lý lỗi
      if (res.headersSent) {
        return next?.(error);
      }

      // Trả về phản hồi lỗi chung cho client
      return res.status(500).json({
        code: 500,
        error: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    }
  };
};

export default tryCatch;
