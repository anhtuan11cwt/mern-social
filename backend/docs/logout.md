## Logout (đăng xuất)

### Mục tiêu

Endpoint này xoá cookie JWT `token` trên trình duyệt, giúp người dùng đăng xuất khỏi hệ thống.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/auth/logout`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Có thể gọi cả khi chưa đăng nhập (idempotent)

### Hành vi

- Set cookie `token` thành `null` với `maxAge: 0`.
- Giữ nguyên các option bảo mật:
  - `httpOnly: true`
  - `sameSite: "strict"`
  - `secure: NODE_ENV === "production"`

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "message": "Logout successfully"
}
```

Không có body lỗi riêng cho logout vì logic chỉ clear cookie.

### Tham chiếu mã nguồn

- Route: [`backend/routes/authRoutes.js`](../routes/authRoutes.js)
- Controller: [`backend/controllers/authControllers.js`](../controllers/authControllers.js)

### Tài liệu liên quan

- [Đăng nhập](./login.md)
- [Đăng ký tài khoản](./register.md)

