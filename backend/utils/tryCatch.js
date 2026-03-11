const tryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      if (res.headersSent) {
        return next?.(error);
      }

      return res.status(500).json({
        code: 500,
        error: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    }
  };
};

export default tryCatch;
