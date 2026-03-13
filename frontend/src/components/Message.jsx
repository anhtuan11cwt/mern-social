// Message.jsx
//
// Hiển thị một tin nhắn đơn lẻ. Căn phải nếu là tin nhắn của mình,
// căn trái nếu là tin nhắn từ người khác.

const Message = ({ message, isMyMessage }) => {
  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`inline-block px-3 py-2 rounded-lg max-w-[70%] ${
          isMyMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
