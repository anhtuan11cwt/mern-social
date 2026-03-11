## Lấy danh sách cuộc trò chuyện (`/api/messages/chats`)

### Mục tiêu

Endpoint này trả về danh sách tất cả cuộc trò chuyện của người dùng hiện tại, được sắp xếp theo thời gian cập nhật gần nhất. Danh sách chỉ hiển thị thông tin của đối phương (loại bỏ người dùng hiện tại).

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/messages/chats`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

- Client phải gửi cookie `token` hợp lệ (đã được tạo bởi các endpoint login/register).
- Không cần tham số query hoặc body.

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "data": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
      "users": [
        {
          "_id": "66f0b7c2c7b7b7b7b7b7b7b8",
          "name": "Nguyễn Văn B",
          "profilePic": {
            "id": "mern-social/users/xxx",
            "url": "https://res.cloudinary.com/.../image/upload/...jpg"
          }
        }
      ],
      "latestMessage": {
        "sender": "66f0b7c2c7b7b7b7b7b7b7b8",
        "text": "Xin chào, bạn khỏe không?"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b9",
      "users": [
        {
          "_id": "66f0b7c2c7b7b7b7b7b7b7ba",
          "name": "Trần Thị C",
          "profilePic": null
        }
      ],
      "latestMessage": {
        "sender": "66f0b7c2c7b7b7b7b7b7b7ba",
        "text": "Hẹn gặp bạn lúc 3 giờ chiều"
      },
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-19T09:15:00.000Z"
    }
  ]
}
```

**Không có cuộc trò chuyện:**

```json
{
  "code": 200,
  "data": []
}
```

#### Định dạng lỗi

```json
{ "code": 401, "error": "Không tìm thấy thông tin người dùng" }
```

Các lỗi phổ biến:

- **401**: chưa đăng nhập hoặc token không hợp lệ (do `isAuth` trả về).
- **500**: lỗi server khi truy vấn cơ sở dữ liệu.

### Ghi chú triển khai

- **Lọc người dùng hiện tại**: Danh sách `users` chỉ chứa thông tin của đối phương, không bao gồm người dùng đang đăng nhập.
- **Sắp xếp theo thời gian**: Cuộc trò chuyện được sắp xếp theo `updatedAt` giảm dần (mới nhất trước).
- **Populate thông tin người dùng**: Lấy thông tin `_id`, `name`, `profilePic` của các thành viên trong cuộc trò chuyện.
- **Tin nhắn gần nhất**: Hiển thị tin nhắn cuối cùng trong mỗi cuộc trò chuyện.

### Tham chiếu mã nguồn

- Route: [`backend/routes/messageRoutes.js`](../routes/messageRoutes.js)
- Controller: [`backend/controllers/messageControllers.js`](../controllers/messageControllers.js)
- Model: [`backend/models/chatModel.js`](../models/chatModel.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Gửi tin nhắn](./message-send.md)
- [Lấy tất cả tin nhắn của một cuộc trò chuyện](./message-get-all.md)
- [Tổng quan tin nhắn](./message-overview.md)
