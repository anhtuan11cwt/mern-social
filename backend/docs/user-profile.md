## Hồ sơ người dùng theo ID (`/api/user/:id`)

### Mục tiêu

Endpoint này trả về thông tin hồ sơ của một người dùng bất kỳ theo `id`, dành cho client đã đăng nhập.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/user/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Tham số URL

- **id** (string, bắt buộc): `_id` của user trong MongoDB.

Ví dụ: `GET /api/user/66f0b7c2c7b7b7b7b7b7b7b7`.

#### Xác thực

- Client phải gửi cookie `token` hợp lệ (tạo bởi login/register).

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "user": {
    "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
    "name": "Nguyễn Văn B",
    "email": "b@example.com",
    "gender": "female",
    "profilePic": {
      "id": "mern-social/users/yyy",
      "url": "https://res.cloudinary.com/.../image/upload/...jpg"
    }
  }
}
```

Mật khẩu luôn được loại bỏ (`select("-password")`).

#### Định dạng lỗi

Lỗi sử dụng cấu trúc:

```json
{ "code": 400, "error": "..." }
```

hoặc

```json
{ "code": 404, "error": "..." }
```

Các lỗi phổ biến:

- **400**: thiếu `id` trong `req.params`.
- **404**: không có user với `id` tương ứng.
- **401/403**: lỗi xác thực từ middleware `isAuth` (xem tài liệu riêng).

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ của tôi](./user-me.md)
- [Dữ liệu follower/following của user](./user-followdata.md)
- [Theo dõi / Bỏ theo dõi user](./user-follow.md)
- [Cập nhật hồ sơ user](./user-update-profile.md)
- [Cập nhật mật khẩu user](./user-update-password.md)

