## Cập nhật hồ sơ user (`/api/user/:id`)

### Mục tiêu

Endpoint này cho phép user hiện tại cập nhật tên và/hoặc ảnh đại diện (profilePic) của chính mình.

### Tóm tắt API

- **Phương thức**: `PUT`
- **Đường dẫn**: `http://localhost:7000/api/user/:id`
- **Kiểu nội dung**: `multipart/form-data`
- **Xác thực**: Bắt buộc (middleware `isAuth`)
- **Upload file**: middleware `uploadFile.single("file")` (multer)

### Yêu cầu

#### Tham số URL

- **id** (string, bắt buộc): `_id` của user cần cập nhật. Trong thực tế nên trùng với `req.user._id` (user hiện tại).

Ví dụ: `PUT /api/user/66f0b7c2c7b7b7b7b7b7b7b7`.

#### Body (`multipart/form-data`)

- **name** (string, tùy chọn): tên mới của user.
- **file** (file, tùy chọn): ảnh đại diện mới, gửi qua field `file`.

Ít nhất phải có một trong hai giá trị `name` hoặc `file`. Nếu không, server trả lỗi 400.

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "message": "Cập nhật hồ sơ thành công",
  "user": {
    "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
    "name": "Tên mới",
    "email": "a@example.com",
    "profilePic": {
      "id": "mern-social/users/xxx",
      "url": "https://res.cloudinary.com/.../image/upload/...jpg"
    }
  }
}
```

Trường `password` đã bị loại bỏ trước khi trả về.

#### Lỗi phổ biến

- **400**:
  - Không có dữ liệu để cập nhật (`không có name và không có file`).
  - File upload không hợp lệ (không tạo được `fileUri.content`).
- **401**: chưa đăng nhập hoặc token không hợp lệ.
- **404**: không tìm thấy user hiện tại.

Lỗi dùng chung format:

```json
{ "code": 400, "error": "Thông báo lỗi chi tiết" }
```

### Ghi chú hành vi

- Nếu user đã có `profilePic.id` cũ, controller sẽ xoá ảnh cũ khỏi Cloudinary trước khi upload ảnh mới.
- Ảnh mới được upload lên folder `mern-social/users` trong Cloudinary.

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware upload: [`backend/middleware/multer.js`](../middleware/multer.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ của tôi](./user-me.md)
- [Hồ sơ người dùng theo ID](./user-profile.md)
