import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/SocketContext.js";
import Message from "./Message";
import MessageInput from "./MessageInput";

const MessageContainer = ({ selectedChat, setChats, loggedInUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const { socket } = useContext(SocketContext) || {};

  const fetchMessages = useCallback(async () => {
    const otherUserId =
      selectedChat?.users?.find((u) => u._id !== loggedInUser?._id)?._id ||
      selectedChat?.users?.[0]?._id;

    if (!otherUserId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`/api/messages/${otherUserId}`);
      setMessages(data?.data || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser, selectedChat]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Tự động cuộn xuống dưới khi tin nhắn thay đổi
  useEffect(() => {
    if (messageContainerRef.current) {
      // Sử dụng setTimeout để đảm bảo DOM đã được cập nhật
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 100);
    }
  }, []);

  // Lắng nghe tin nhắn mới real-time
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = (newMessage) => {
      // Chỉ thêm tin nhắn nếu thuộc cuộc trò chuyện hiện tại
      if (newMessage.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // Cập nhật danh sách chat với tin nhắn mới nhất
      if (setChats) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newMessage.chatId
              ? {
                  ...chat,
                  latestMessage: {
                    sender: newMessage.sender,
                    text: newMessage.text,
                  },
                }
              : chat,
          ),
        );
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChat?._id, setChats]);

  const handleSendMessage = async (text) => {
    if (!selectedChat?._id || !text?.trim()) return;
    try {
      const otherUserId =
        selectedChat?.users?.find((u) => u._id !== loggedInUser?._id)?._id ||
        selectedChat?.users?.[0]?._id;

      if (!otherUserId) return;

      const { data } = await axios.post("/api/messages", {
        message: text.trim(),
        receiverId: otherUserId,
      });
      setMessages((prev) => [...prev, data?.data]);
      if (setChats) {
        const { data: chatsData } = await axios.get("/api/messages/chat");
        setChats(chatsData?.data || []);
      }
    } catch {
      // Xử lý lỗi đã được toast trong context
    }
  };

  const otherUser =
    selectedChat?.users?.find((u) => u._id !== loggedInUser?._id) ||
    selectedChat?.users?.[0];

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center mx-20">
        <span className="text-4xl mb-4">👋</span>
        <h2 className="text-2xl font-semibold text-gray-800">
          Xin chào {loggedInUser?.name || "Người dùng"}
        </h2>
        <p className="text-gray-500 mt-2">
          Chọn một cuộc trò chuyện để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 flex items-center gap-3">
        {otherUser?.profilePic?.url ? (
          <img
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
            src={otherUser.profilePic.url}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            {otherUser?.name?.charAt(0)?.toUpperCase() || "N"}
          </div>
        )}
        <span className="font-semibold text-gray-800">
          {otherUser?.name || "Người dùng"}
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref={messageContainerRef}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500 mt-2">Đang tải tin nhắn...</p>
            </div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMyMessage =
              msg.sender === loggedInUser?._id ||
              msg.sender?._id === loggedInUser?._id;
            return (
              <Message
                isMyMessage={isMyMessage}
                key={msg._id || index}
                message={msg}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Chưa có tin nhắn nào
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default MessageContainer;
