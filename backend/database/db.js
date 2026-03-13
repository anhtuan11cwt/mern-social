// db.js
//
// Thiết lập kết nối MongoDB khi khởi động ứng dụng.
// Chuỗi kết nối đến từ biến môi trường MONGO_URL.

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Đã kết nối đến MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };
