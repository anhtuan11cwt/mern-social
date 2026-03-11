## Cập nhật mật khẩu user (`/api/user/update-password`)

### Mục tiêu

Endpoint này cho phép user hiện tại đổi mật khẩu bằng cách cung cấp mật khẩu cũ và mật khẩu mới.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/user/update-password`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Body (JSON)

- **oldPassword** (string, bắt buộc): mật khẩu hiện tại.
- **newPassword** (string, bắt buộc): mật khẩu mới.

Ví dụ:

```json
{
  "oldPassword": "123456",
  "newPassword": "abcXYZ789!"
}
```

#### Xác thực

- Client phải gửi cookie `token` hợp lệ.

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "message": "Cập nhật mật khẩu thành công"
}
```

Mật khẩu mới được hash bằng `bcrypt` trước khi lưu.

#### Lỗi phổ biến

- **400**:
  - Thiếu `oldPassword` hoặc `newPassword` trong body.
  - `oldPassword` không đúng với mật khẩu hiện tại của user (`"Wrong old password"`).
- **401**: chưa đăng nhập hoặc token không hợp lệ.
- **404**: không tìm thấy user hiện tại.

Tất cả lỗi dùng chung format:

```json
{ "code": 400, "error": "Thông báo lỗi chi tiết" }
```

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ của tôi](./user-me.md)
- [Cập nhật hồ sơ user](./user-update-profile.md)
