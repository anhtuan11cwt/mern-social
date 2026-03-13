import { Check } from "lucide-react";

const Chat = ({ chat, setSelectedChat, loggedInUser, selectedChat }) => {
  if (!chat || !chat.users || !loggedInUser) return null;

  const otherUser =
    chat.users.find((u) => u._id !== loggedInUser._id) || chat.users[0];
  const isSelected = selectedChat?._id === chat._id;
  const isLastMessageFromMe = chat?.latestMessage?.sender === loggedInUser._id;

  const formatLastMessage = (text) => {
    if (!text) return "";
    return text.length > 18 ? `${text.substring(0, 18)}...` : text;
  };

  return (
    <button
      className={`w-full text-left p-3 cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={() => setSelectedChat?.(chat)}
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
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
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 text-sm truncate">
              {otherUser?.name || "Người dùng"}
            </span>
            {isLastMessageFromMe && (
              <Check className="text-blue-500 flex-shrink-0" size={14} />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {formatLastMessage(chat?.latestMessage?.text)}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Chat;
