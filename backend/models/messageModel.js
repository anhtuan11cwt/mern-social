// messageModel.js
//
// Tin nhắn riêng lẻ trong một cuộc trò chuyện.
// Tham chiếu đến cả chat và người dùng gửi.
// Văn bản được cắt để xóa khoảng trắng ở đầu và cuối.

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Tham chiếu đến chat mà tin nhắn này thuộc về
    chatId: {
      ref: "Chat",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    // Người dùng đã gửi tin nhắn này
    sender: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    // Nội dung tin nhắn
    text: {
      required: true,
      trim: true,
      type: String,
    },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
