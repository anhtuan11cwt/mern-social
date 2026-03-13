// cloudinary.js
//
// Khởi tạo SDK Cloudinary với thông tin xác thực từ các biến môi trường.
// Được sử dụng để tải lên và xóa ảnh đại diện người dùng và phương tiện bài viết.
// Thông tin xác thực: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

import { v2 as cloudinary } from "cloudinary";

const configureCloudinary = () => {
  cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

export { cloudinary, configureCloudinary };
