import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { ChatContext } from "./ChatContext.js";

export const ChatContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchAllUsers = useCallback(async (query = "") => {
    try {
      const { data } = await axios.get("/api/user/all", {
        params: query ? { search: query } : {},
      });
      setUsers(data?.users || []);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể tải danh sách người dùng";
      toast.error(message);
      setUsers([]);
    }
  }, []);

  const getAllChats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/messages/chat");
      setChats(data?.data || []);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Không thể tải danh sách cuộc trò chuyện";
      toast.error(message);
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    setMessagesLoading(true);
    try {
      const { data } = await axios.get(`/api/messages/${chatId}`);
      setMessages(data?.data || []);
    } catch (error) {
      const message = error?.response?.data?.error || "Không thể tải tin nhắn";
      toast.error(message);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId, text) => {
    if (!chatId || !text?.trim()) return;
    try {
      const { data } = await axios.post("/api/messages", {
        chatId,
        message: text.trim(),
      });
      setMessages((prev) => [...prev, data?.data]);
      return data?.data;
    } catch (error) {
      const message = error?.response?.data?.error || "Không thể gửi tin nhắn";
      toast.error(message);
      throw error;
    }
  }, []);

  const createChat = async ({ receiverId }) => {
    if (!receiverId) {
      toast.error("Thiếu ID người nhận để tạo cuộc trò chuyện");
      return;
    }
    try {
      const { data } = await axios.post("/api/messages", {
        message: "Xin chào",
        receiverId,
      });

      await getAllChats();

      if (data?.data?.chat) {
        setSelectedChat(data.data.chat);
      }

      toast.success("Đã tạo cuộc trò chuyện mới");
      return data?.data;
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể tạo cuộc trò chuyện mới";
      toast.error(message);
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        createChat,
        fetchAllUsers,
        getAllChats,
        getMessages,
        loading,
        messages,
        messagesLoading,
        selectedChat,
        sendMessage,
        setChats,
        setMessages,
        setSelectedChat,
        setUsers,
        users,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
