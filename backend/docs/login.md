## Login (đăng nhập)

### Mục tiêu

Endpoint này xác thực người dùng bằng email và mật khẩu, sau đó set JWT vào cookie `token` (httpOnly) và trả về thông tin user (đã ẩn mật khẩu).

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/auth/login`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Công khai (không cần đăng nhập)

### Yêu cầu

#### Thân request (JSON)

- **email** (string, bắt buộc)
- **password** (string, bắt buộc)

Ví dụ:

```json
{
  "email": "a@example.com",
  "password": "secret123"
}
```

### Phản hồi

#### Thành công (200)

Trả về object user (đã loại bỏ `password`) và message. JWT được set vào cookie `token`.

```json
{
  "code": 200,
  "message": "Đăng nhập thành công",
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

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng:

```json
{ "code": 400, "error": "..." }
```

#### Các lỗi thường gặp

- **400**: thiếu `email` hoặc `password`
- **400**: email hoặc mật khẩu không đúng
- **500**: JWT chưa được cấu hình (`JWT_SECRET`)
- **500**: lỗi không xác định khi đăng nhập (MongoDB/…)

### Cookie và lưu ý bảo mật

- **Tên cookie**: `token`
- **httpOnly**: `true`
- **sameSite**: `"strict"`
- **secure**: `true` khi `NODE_ENV === "production"`
- **expires**: 15 ngày

Client cần gửi kèm cookie trong các request tiếp theo (ví dụ với `fetch`: `credentials: "include"`).

### Tham chiếu mã nguồn

- Route: [`backend/routes/authRoutes.js`](../routes/authRoutes.js)
- Controller: [`backend/controllers/authControllers.js`](../controllers/authControllers.js)
- Tiện ích token: [`backend/utils/generateToken.js`](../utils/generateToken.js)
- Tiện ích try/catch: [`backend/utils/tryCatch.js`](../utils/tryCatch.js)

### Tài liệu liên quan

- [Đăng ký tài khoản](./register.md)
- [Đăng xuất](./logout.md)

