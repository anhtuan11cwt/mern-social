// messageControllers.js
//
// Xử lý gửi tin nhắn và truy xuất cho nhắn tin trực tiếp.
// Tạo hoặc tái sử dụng tài liệu chat để nhóm tin nhắn giữa hai người dùng.
// Phát thông báo thời gian thực qua Socket.io nếu người nhận trực tuyến.
//
// Mô hình Chat: Lưu trữ mảng người dùng và latestMessage cho UI danh sách chat.
// Mô hình Message: Lưu trữ các tin nhắn riêng lẻ với người gửi và văn bản.

import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body ?? {};

    if (!receiverId) {
      return res
        .status(400)
        .json({ code: 400, error: "Vui lòng cung cấp ID người nhận" });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ code: 400, error: "Nội dung tin nhắn không hợp lệ" });
    }

    const senderId = req.user?._id;

    if (!senderId) {
      return res
        .status(401)
        .json({ code: 401, error: "Không tìm thấy thông tin người dùng" });
    }

    // Tìm hoặc tạo chat giữa người gửi và người nhận
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
      });
    }

    const createdMessage = await Message.create({
      chatId: chat._id,
      sender: senderId,
      text: message.trim(),
    });

    // Cập nhật latestMessage của chat cho xem trước danh sách chat
    chat.latestMessage = {
      sender: createdMessage.sender,
      text: createdMessage.text,
    };
    await chat.save();

    // Gửi thông báo thời gian thực nếu người nhận trực tuyến
    const receiverSocketId = getReceiverSocketId(receiverId);
    const messageData = {
      ...createdMessage.toObject(),
      chatId: chat._id,
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }

    return res.status(201).json({ code: 201, data: createdMessage });
  } catch {
    return res.status(500).json({
      code: 500,
      error: "Không thể gửi tin nhắn, vui lòng thử lại sau",
    });
  }
};

// Lấy tất cả tin nhắn trong một cuộc trò chuyện với người dùng khác.
// Trả về mảng trống nếu chưa có chat (cuộc trò chuyện mới).
// Sắp xếp theo createdAt tăng dần để hiển thị theo thứ tự thời gian.
export const getAllMessages = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const currentUserId = req.user?._id;

    if (!otherUserId) {
      return res.status(400).json({
        code: 400,
        error: "Thiếu id người dùng cần lấy cuộc trò chuyện",
      });
    }

    if (!currentUserId) {
      return res
        .status(401)
        .json({ code: 401, error: "Không tìm thấy thông tin người dùng" });
    }

    const chat = await Chat.findOne({
      users: { $all: [currentUserId, otherUserId] },
    });

    if (!chat) {
      return res.status(200).json({ code: 200, data: [] });
    }

    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: 1 })
      .populate("sender", "_id name avatar");

    return res.status(200).json({ code: 200, data: messages });
  } catch {
    return res
      .status(500)
      .json({ code: 500, error: "Không thể lấy danh sách tin nhắn" });
  }
};

// Lấy tất cả các chat cho người dùng hiện tại, sắp xếp theo hoạt động gần đây nhất.
// Lọc ra người dùng hiện tại khỏi mảng users để client chỉ thấy người kia.
// Được sử dụng để điền danh sách chat sidebar.
export const getAllChats = async (req, res) => {
  try {
    const currentUserId = req.user?._id;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ code: 401, error: "Không tìm thấy thông tin người dùng" });
    }

    const chats = await Chat.find({ users: currentUserId })
      .sort({ updatedAt: -1 })
      .populate("users", "_id name profilePic");

    // Xóa người dùng hiện tại khỏi mảng users trong mỗi chat
    const filteredChats = chats.map((chat) => {
      const chatObj = chat.toObject();
      chatObj.users = chatObj.users.filter(
        (user) => user._id.toString() !== currentUserId.toString(),
      );
      return chatObj;
    });

    return res.status(200).json({ code: 200, data: filteredChats });
  } catch {
    return res
      .status(500)
      .json({ code: 500, error: "Không thể lấy danh sách cuộc trò chuyện" });
  }
};
