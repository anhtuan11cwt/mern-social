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

    chat.latestMessage = {
      sender: createdMessage.sender,
      text: createdMessage.text,
    };
    await chat.save();

    // Gửi tin nhắn real-time đến người nhận nếu đang online
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
