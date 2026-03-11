## Tổng quan hệ thống tin nhắn

### Giới thiệu

Hệ thống tin nhắn cho phép người dùng gửi và nhận tin nhắn văn bản với nhau. Hệ thống tự động quản lý các cuộc trò chuyện giữa các cặp người dùng và lưu trữ lịch sử tin nhắn.

### Kiến trúc

Hệ thống sử dụng hai model chính:

- **Chat**: Đại diện cho một cuộc trò chuyện giữa hai người dùng
- **Message**: Đại diện cho một tin nhắn cụ thể trong cuộc trò chuyện

### Các endpoint

1. **[Gửi tin nhắn](./message-send.md)** - `POST /api/messages`
2. **[Lấy tất cả tin nhắn](./message-get-all.md)** - `GET /api/messages/:id`
3. **[Lấy danh sách cuộc trò chuyện](./message-chats.md)** - `GET /api/messages/chat`

### Models

#### Chat Model

Lưu trữ thông tin về cuộc trò chuyện giữa hai người dùng.

```javascript
{
  users: [ObjectId, ObjectId],  // Mảng 2 người dùng
  latestMessage: {
    sender: ObjectId,          // Người gửi tin nhắn mới nhất
    text: String               // Nội dung tin nhắn mới nhất
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Message Model

Lưu trữ thông tin về từng tin nhắn cụ thể.

```javascript
{
  chatId: ObjectId,            // ID của cuộc trò chuyện
  sender: ObjectId,            // Người gửi
  text: String,                // Nội dung tin nhắn
  createdAt: Date,
  updatedAt: Date
}
```

### Luồng hoạt động

1. **Gửi tin nhắn**: Khi người dùng gửi tin nhắn, hệ thống sẽ:
   - Tìm hoặc tạo cuộc trò chuyện giữa hai người dùng
   - Tạo tin nhắn mới và lưu vào database
   - Cập nhật `latestMessage` trong cuộc trò chuyện

2. **Lấy tin nhắn**: Khi người dùng xem cuộc trò chuyện:
   - Tìm cuộc trò chuyện giữa người dùng hiện tại và người dùng được chỉ định
   - Trả về tất cả tin nhắn trong cuộc trò chuyện đó, sắp xếp theo thời gian

3. **Lấy danh sách cuộc trò chuyện**: Khi người dùng xem danh sách cuộc trò chuyện:
   - Tìm tất cả cuộc trò chuyện mà người dùng hiện tại tham gia
   - Sắp xếp theo thời gian cập nhật mới nhất
   - Populate thông tin người dùng và trả về

### Xác thực

Tất cả các endpoint đều yêu cầu xác thực thông qua middleware `isAuth`. Người dùng phải đăng nhập và có cookie `token` hợp lệ.

### Định dạng phản hồi

Tất cả các endpoint đều trả về định dạng chuẩn:

```json
{
  "code": 200,
  "data": { ... }
}
```

Hoặc khi có lỗi:

```json
{
  "code": 400,
  "error": "Thông báo lỗi"
}
```

### Tham chiếu mã nguồn

- Routes: [`backend/routes/messageRoutes.js`](../routes/messageRoutes.js)
- Controllers: [`backend/controllers/messageControllers.js`](../controllers/messageControllers.js)
- Model Chat: [`backend/models/chatModel.js`](../models/chatModel.js)
- Model Message: [`backend/models/messageModel.js`](../models/messageModel.js)
- Main app: [`backend/index.js`](../index.js)

### Tài liệu liên quan

- [Gửi tin nhắn](./message-send.md)
- [Lấy tất cả tin nhắn](./message-get-all.md)
- [Lấy danh sách cuộc trò chuyện](./message-chats.md)
