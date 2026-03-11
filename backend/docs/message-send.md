## Gửi tin nhắn (`/api/messages`)

### Mục tiêu

Endpoint này cho phép người dùng gửi tin nhắn đến một người dùng khác. Nếu chưa có cuộc trò chuyện giữa hai người, hệ thống sẽ tự động tạo một cuộc trò chuyện mới.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/messages`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Body (JSON)

- **receiverId** (string, bắt buộc): ID của người nhận tin nhắn
- **message** (string, bắt buộc): Nội dung tin nhắn (không được rỗng sau khi trim)

#### Ví dụ request

```json
{
  "receiverId": "66f0b7c2c7b7b7b7b7b7b7b7",
  "message": "Xin chào, bạn khỏe không?"
}
```

### Phản hồi

#### Thành công (201)

Trả về thông tin tin nhắn vừa được tạo.

```json
{
  "code": 201,
  "data": {
    "_id": "670000000000000000000000",
    "chatId": "66f0b7c2c7b7b7b7b7b7b7b8",
    "sender": "66f0b7c2c7b7b7b7b7b7b7b7",
    "text": "Xin chào, bạn khỏe không?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng chuẩn:

```json
{ "code": 400, "error": "..." }
```

Các mã lỗi:

- **400**: Thiếu `receiverId` hoặc `message` không hợp lệ
- **401**: Người dùng chưa đăng nhập hoặc không tìm thấy thông tin người dùng
- **500**: Lỗi server khi gửi tin nhắn

Ví dụ:

```json
{ "code": 400, "error": "Vui lòng cung cấp ID người nhận" }
```

```json
{ "code": 400, "error": "Nội dung tin nhắn không hợp lệ" }
```

```json
{ "code": 401, "error": "Không tìm thấy thông tin người dùng" }
```

```json
{ "code": 500, "error": "Không thể gửi tin nhắn, vui lòng thử lại sau" }
```

### Ghi chú triển khai

- Nếu chưa có cuộc trò chuyện giữa `senderId` và `receiverId`, hệ thống sẽ tự động tạo một `Chat` mới.
- Sau khi tạo tin nhắn, hệ thống sẽ cập nhật `latestMessage` trong `Chat` tương ứng.
- Tin nhắn được trim để loại bỏ khoảng trắng thừa ở đầu và cuối.

### Tham chiếu mã nguồn

- Model Chat: [`backend/models/chatModel.js`](../models/chatModel.js)
- Model Message: [`backend/models/messageModel.js`](../models/messageModel.js)
- Controller: [`backend/controllers/messageControllers.js`](../controllers/messageControllers.js)
- Routes: [`backend/routes/messageRoutes.js`](../routes/messageRoutes.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Lấy tất cả tin nhắn](./message-get-all.md)
- [Lấy danh sách cuộc trò chuyện](./message-chats.md)
