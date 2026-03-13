// multer.js
//
// Cấu hình xử lý tải lên tệp. Lưu trữ tệp trong bộ nhớ (không phải đĩa)
// để truyền trực tiếp đến Cloudinary. Giới hạn kích thước tệp là 5MB.

import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  storage,
});

export { uploadFile };
