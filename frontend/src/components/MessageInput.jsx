// MessageInput.jsx
//
// Input field để gửi tin nhắn. Hỗ trợ gửi bằng nút hoặc phím Enter.
// Phím Shift+Enter để xuống dòng (không gửi).

import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text?.trim() || disabled) return;
    onSendMessage(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    // Gửi tin nhắn khi nhấn Enter (không phải Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          type="text"
          value={text}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text?.trim() || disabled}
          onClick={handleSend}
          type="button"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
