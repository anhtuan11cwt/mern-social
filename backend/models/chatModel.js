// chatModel.js
//
// Đại diện cho một cuộc trò chuyện nhắn tin trực tiếp giữa hai người dùng.
// Lưu trữ mảng ID người dùng và lưu trữ tin nhắn mới nhất cho xem trước danh sách chat.
// latestMessage được cập nhật mỗi khi một tin nhắn mới được gửi.

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // Tin nhắn mới nhất được lưu trong bộ nhớ đệm cho UI danh sách chat (ID người gửi và xem trước văn bản)
    latestMessage: {
      sender: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
      text: {
        trim: true,
        type: String,
      },
    },
    // Cuộc trò chuyện hai người dùng. Luôn chứa chính xác 2 ID người dùng.
    users: [
      {
        ref: "User",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

export const Chat = mongoose.model("Chat", chatSchema);
