## Lấy danh sách tất cả người dùng (`/api/user/all`)

### Mục tiêu

Endpoint này trả về danh sách tất cả người dùng trong hệ thống với hỗ trợ tìm kiếm theo tên. Người dùng hiện tại sẽ bị loại bỏ khỏi danh sách kết quả.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/user/all`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Query Parameters

| Tham số  | Kiểu   | Bắt buộc | Mô tả                                                             |
| -------- | ------ | -------- | ----------------------------------------------------------------- |
| `search` | string | Không    | Từ khóa tìm kiếm theo tên người dùng (không phân biệt hoa thường) |

#### Xác thực

- Client phải gửi cookie `token` hợp lệ (đã được tạo bởi các endpoint login/register).

### Phản hồi

#### Thành công (200)

**Lấy tất cả người dùng:**

```
GET /api/user/all
```

```json
{
  "code": 200,
  "users": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
      "name": "Nguyễn Văn B",
      "email": "b@example.com",
      "gender": "female",
      "profilePic": {
        "id": "mern-social/users/xxx",
        "url": "https://res.cloudinary.com/.../image/upload/...jpg"
      },
      "followers": [],
      "following": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b8",
      "name": "Trần Thị C",
      "email": "c@example.com",
      "gender": "male",
      "profilePic": null,
      "followers": [],
      "following": [],
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Tìm kiếm theo tên:**

```
GET /api/user/all?search=Nguyễn
```

```json
{
  "code": 200,
  "users": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
      "name": "Nguyễn Văn B",
      "email": "b@example.com",
      "gender": "female",
      "profilePic": {
        "id": "mern-social/users/xxx",
        "url": "https://res.cloudinary.com/.../image/upload/...jpg"
      },
      "followers": [],
      "following": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Không tìm thấy kết quả:**

```
GET /api/user/all?search=xyz
```

```json
{
  "code": 200,
  "users": []
}
```

#### Định dạng lỗi

```json
{ "code": 401, "error": "Vui lòng đăng nhập để tiếp tục" }
```

Các lỗi phổ biến:

- **401**: chưa đăng nhập hoặc token không hợp lệ (do `isAuth` trả về).
- **500**: lỗi server khi truy vấn cơ sở dữ liệu.

### Ghi chú triển khai

- **Tìm kiếm không phân biệt hoa thường**: Sử dụng regex với `$options: "i"` để tìm kiếm linh hoạt.
- **Loại bỏ người dùng hiện tại**: Sử dụng `$ne` để đảm bảo người dùng đang đăng nhập không xuất hiện trong kết quả.
- **Bảo mật mật khẩu**: Mật khẩu luôn được loại bỏ (`select("-password")`).
- **Xử lý lỗi toàn diện**: Bọc trong `tryCatch` để bắt các lỗi phát sinh.

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Model: [`backend/models/userModel.js`](../models/userModel.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ của tôi](./user-me.md)
- [Hồ sơ người dùng theo ID](./user-profile.md)
- [Theo dõi/Bỏ theo dõi người dùng](./user-follow.md)
