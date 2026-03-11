## Lấy tất cả tin nhắn (`/api/messages/:id`)

### Mục tiêu

Endpoint này trả về tất cả tin nhắn trong cuộc trò chuyện giữa người dùng hiện tại và một người dùng khác được chỉ định bởi `id`.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/messages/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### URL Parameters

- **id** (string, bắt buộc): ID của người dùng cần lấy cuộc trò chuyện

#### Ví dụ request

```
GET http://localhost:7000/api/messages/66f0b7c2c7b7b7b7b7b7b7b7
```

### Phản hồi

#### Thành công (200)

Trả về mảng các tin nhắn được sắp xếp theo thời gian tạo (từ cũ đến mới). Mỗi tin nhắn bao gồm thông tin người gửi đã được populate.

```json
{
  "code": 200,
  "data": [
    {
      "_id": "670000000000000000000000",
      "chatId": "66f0b7c2c7b7b7b7b7b7b7b8",
      "sender": {
        "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
        "name": "Nguyễn Văn A",
        "avatar": {
          "id": "mern-social/users/xxx",
          "url": "https://res.cloudinary.com/.../image/upload/...jpg"
        }
      },
      "text": "Xin chào",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "670000000000000000000001",
      "chatId": "66f0b7c2c7b7b7b7b7b7b7b8",
      "sender": {
        "_id": "66f0b7c2c7b7b7b7b7b7b7b9",
        "name": "Trần Thị B",
        "avatar": {
          "id": "mern-social/users/yyy",
          "url": "https://res.cloudinary.com/.../image/upload/...jpg"
        }
      },
      "text": "Chào bạn",
      "createdAt": "2024-01-01T00:01:00.000Z",
      "updatedAt": "2024-01-01T00:01:00.000Z"
    }
  ]
}
```

Nếu chưa có cuộc trò chuyện giữa hai người, trả về mảng rỗng:

```json
{
  "code": 200,
  "data": []
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng chuẩn:

```json
{ "code": 400, "error": "..." }
```

Các mã lỗi:

- **400**: Thiếu `id` trong URL parameters
- **401**: Người dùng chưa đăng nhập hoặc không tìm thấy thông tin người dùng
- **500**: Lỗi server khi lấy danh sách tin nhắn

Ví dụ:

```json
{ "code": 400, "error": "Thiếu id người dùng cần lấy cuộc trò chuyện" }
```

```json
{ "code": 401, "error": "Không tìm thấy thông tin người dùng" }
```

```json
{ "code": 500, "error": "Không thể lấy danh sách tin nhắn" }
```

### Ghi chú triển khai

- Tin nhắn được sắp xếp theo `createdAt` tăng dần (từ cũ đến mới) bằng `.sort({ createdAt: 1 })`.
- Thông tin người gửi được populate với các trường `_id`, `name`, và `avatar`.
- Nếu không tìm thấy cuộc trò chuyện, endpoint trả về mảng rỗng thay vì lỗi 404.

### Tham chiếu mã nguồn

- Model Chat: [`backend/models/chatModel.js`](../models/chatModel.js)
- Model Message: [`backend/models/messageModel.js`](../models/messageModel.js)
- Controller: [`backend/controllers/messageControllers.js`](../controllers/messageControllers.js)
- Routes: [`backend/routes/messageRoutes.js`](../routes/messageRoutes.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Gửi tin nhắn](./message-send.md)
- [Lấy danh sách cuộc trò chuyện](./message-chats.md)
