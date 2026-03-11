## Hồ sơ của tôi (`/api/user/me`)

### Mục tiêu

Endpoint này trả về thông tin hồ sơ của người dùng hiện đang đăng nhập, dựa trên token JWT trong cookie.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/user/me`
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
  "user": {
    "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "gender": "male",
    "profilePic": {
      "id": "mern-social/users/xxx",
      "url": "https://res.cloudinary.com/.../image/upload/...jpg"
    }
  }
}
```

Mật khẩu luôn được loại bỏ (`select("-password")`).

#### Định dạng lỗi

```json
{ "code": 401, "error": "..." }
```

Các lỗi phổ biến:

- **401**: chưa đăng nhập hoặc token không hợp lệ (do `isAuth` trả về).
- **404**: không tìm thấy người dùng tương ứng với token.

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ người dùng theo ID](./user-profile.md)
- [Đăng nhập](./login.md)

