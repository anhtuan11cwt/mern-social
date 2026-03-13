import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import MessageContainer from "../components/MessageContainer";
import { ChatData } from "../hooks/useChatData";
import { useUserData } from "../hooks/useUserData";

const ChatPage = () => {
  const {
    users,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    loading,
    fetchAllUsers,
    getAllChats,
    createChat,
  } = ChatData() || {};

  const { user } = useUserData() || {};
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllChats?.();
  }, [getAllChats]);

  useEffect(() => {
    if (!searchOpen) return;
    const delay = setTimeout(() => {
      fetchAllUsers?.(query.trim());
    }, 400);
    return () => clearTimeout(delay);
  }, [fetchAllUsers, query, searchOpen]);

  const handleSelectUser = async (selectedUser) => {
    if (!selectedUser?._id) return;
    try {
      await createChat?.({ receiverId: selectedUser._id });
      setSearchOpen(false);
      setQuery("");
    } catch {
      // lỗi đã được toast trong context
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 pt-4 px-4">
      <div className="w-full h-[calc(100vh-120px)] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex h-full">
          <div className="w-[30%] border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Tin nhắn
                </h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  type="button"
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
              </div>

              {searchOpen && (
                <div className="mt-3">
                  <input
                    className="custom-input"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập tên"
                    type="text"
                    value={query}
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {users?.length ? (
                      <ul className="space-y-1">
                        {users.map((u) => (
                          <button
                            className="flex items-center gap-2 p-2 rounded cursor-pointer bg-gray-500 text-white hover:bg-gray-600 w-full"
                            key={u._id}
                            onClick={() => handleSelectUser(u)}
                            type="button"
                          >
                            {u?.profilePic?.url ? (
                              <img
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover"
                                src={u.profilePic.url}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                                {u?.name?.charAt(0)?.toUpperCase() || "N"}
                              </div>
                            )}
                            <span className="text-sm">{u.name}</span>
                          </button>
                        ))}
                      </ul>
                    ) : query.trim() ? (
                      <p className="text-xs text-gray-500 mt-2">
                        Không có người dùng
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        Nhập tên để tìm kiếm
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-3">
                  <div className="animate-pulse flex items-center gap-3 p-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                  </div>
                </div>
              ) : chats?.length ? (
                <ul className="divide-y divide-gray-100">
                  {chats.map((chat) => (
                    <Chat
                      chat={chat}
                      key={chat._id}
                      loggedInUser={user}
                      selectedChat={selectedChat}
                      setSelectedChat={setSelectedChat}
                    />
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  Chưa có cuộc trò chuyện nào
                </div>
              )}
            </div>
          </div>

          <div className="w-[70%] flex flex-col">
            {selectedChat ? (
              <MessageContainer
                loggedInUser={user}
                selectedChat={selectedChat}
                setChats={setChats}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center mx-20">
                <span className="text-4xl mb-4">👋</span>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Xin chào {user?.name || "Người dùng"}
                </h2>
                <p className="text-gray-500 mt-2">
                  Chọn một cuộc trò chuyện để bắt đầu
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
