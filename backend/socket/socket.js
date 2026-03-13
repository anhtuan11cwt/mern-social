// socket.js
//
// Lớp giao tiếp thời gian thực sử dụng Socket.io.
// Duy trì một bản đồ userId -> socketId để định tuyến tin nhắn đến người dùng trực tuyến.
// Phát sóng danh sách người dùng trực tuyến cho tất cả các client được kết nối.
//
// Sự kiện:
// - sendMessage: Chuyển tiếp tin nhắn đến người nhận nếu trực tuyến
// - typing/stopTyping: Hiển thị chỉ báo đang gõ
// - disconnect: Dọn dẹp người dùng khỏi bản đồ trực tuyến

import http from "node:http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

// Ánh xạ userId đến socketId hiện tại của họ để định tuyến tin nhắn
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Đăng ký người dùng là trực tuyến. Kiểm tra chuỗi "undefined" để ngăn các mục không hợp lệ.
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Phát sóng danh sách người dùng trực tuyến được cập nhật cho tất cả các client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);

    // Chỉ phát nếu người nhận hiện đang trực tuyến
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        message,
        senderId: userId,
      });
    }
  });

  socket.on("typing", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId: userId,
      });
    }
  });

  socket.on("stopTyping", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", {
        senderId: userId,
      });
    }
  });

  socket.on("disconnect", () => {
    // Xóa người dùng khỏi bản đồ trực tuyến và thông báo cho tất cả các client
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
