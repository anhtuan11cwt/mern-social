## Lấy danh sách cuộc trò chuyện (`/api/messages/chat`)

### Mục tiêu

Endpoint này trả về tất cả các cuộc trò chuyện của người dùng hiện tại, được sắp xếp theo thời gian cập nhật mới nhất (cuộc trò chuyện có tin nhắn mới nhất sẽ ở đầu danh sách).

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/messages/chat`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

- Client phải gửi cookie `token` hợp lệ.
- Không cần tham số query hoặc body.

### Phản hồi

#### Thành công (200)

Trả về mảng các cuộc trò chuyện với thông tin người dùng đã được populate.

```json
{
  "code": 200,
  "data": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b8",
      "users": [
        {
          "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
          "name": "Nguyễn Văn A",
          "profilePic": {
            "id": "mern-social/users/xxx",
            "url": "https://res.cloudinary.com/.../image/upload/...jpg"
          }
        },
        {
          "_id": "66f0b7c2c7b7b7b7b7b7b7b9",
          "name": "Trần Thị B",
          "profilePic": {
            "id": "mern-social/users/yyy",
            "url": "https://res.cloudinary.com/.../image/upload/...jpg"
          }
        }
      ],
      "latestMessage": {
        "sender": "66f0b7c2c7b7b7b7b7b7b7b9",
        "text": "Tin nhắn mới nhất"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

Nếu người dùng chưa có cuộc trò chuyện nào, trả về mảng rỗng:

```json
{
  "code": 200,
  "data": []
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng chuẩn:

```json
{ "code": 401, "error": "..." }
```

Các mã lỗi:

- **401**: Người dùng chưa đăng nhập hoặc không tìm thấy thông tin người dùng
- **500**: Lỗi server khi lấy danh sách cuộc trò chuyện

Ví dụ:

```json
{ "code": 401, "error": "Không tìm thấy thông tin người dùng" }
```

```json
{ "code": 500, "error": "Không thể lấy danh sách cuộc trò chuyện" }
```

### Ghi chú triển khai

- Cuộc trò chuyện được sắp xếp theo `updatedAt` giảm dần (mới nhất trước) bằng `.sort({ updatedAt: -1 })`.
- Thông tin người dùng trong mảng `users` được populate với các trường `_id`, `name`, và `profilePic`.
- Mỗi cuộc trò chuyện chứa `latestMessage` với thông tin tin nhắn mới nhất (người gửi và nội dung).

### Tham chiếu mã nguồn

- Model Chat: [`backend/models/chatModel.js`](../models/chatModel.js)
- Model Message: [`backend/models/messageModel.js`](../models/messageModel.js)
- Controller: [`backend/controllers/messageControllers.js`](../controllers/messageControllers.js)
- Routes: [`backend/routes/messageRoutes.js`](../routes/messageRoutes.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Gửi tin nhắn](./message-send.md)
- [Lấy tất cả tin nhắn](./message-get-all.md)
