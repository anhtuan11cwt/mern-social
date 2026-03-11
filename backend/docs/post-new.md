## Tạo bài viết mới (post/reel)

### Mục tiêu

Endpoint này tạo bài viết mới (ảnh hoặc video dạng reel), upload file lên Cloudinary, lưu thông tin bài viết vào MongoDB và gắn với user đang đăng nhập.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/post/new`
- **Kiểu nội dung**: `multipart/form-data`
- **Xác thực**: Bắt buộc (cần cookie `token` hợp lệ – middleware `isAuth`)

### Yêu cầu

#### Trường dữ liệu (multipart)

- **caption** (string, không bắt buộc): nội dung mô tả bài viết
- **file** (file, bắt buộc): ảnh hoặc video của bài viết

#### Query string

- **type** (string, không bắt buộc, default: `"post"`):
  - `"post"`: upload ảnh thông thường
  - `"reel"`: upload video (Cloudinary `resource_type = "video"`)

#### Ràng buộc upload

- **Tên field**: `file` (sử dụng `uploadFile.single("file")`)
- File phải được middleware `multer` chấp nhận và được convert sang Data URI hợp lệ bởi `urlGenerator`.

### Phản hồi

#### Thành công (201)

Trả về thông tin bài viết vừa tạo.

```json
{
  "code": 201,
  "message": "Bài viết đã được tạo",
  "post": {
    "_id": "670000000000000000000000",
    "caption": "Ảnh hoàng hôn",
    "owner": "66f0b7c2c7b7b7b7b7b7b7b7",
    "post": {
      "id": "mern-social/posts/abc123",
      "url": "https://res.cloudinary.com/.../image/upload/v123/abc123.jpg"
    },
    "type": "post",
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng chuẩn:

```json
{ "code": 400, "error": "..." }
```

Controller hiện tại trả về một số mã lỗi như sau:

- **400**: thiếu file upload hoặc file không hợp lệ
- **401**: user chưa đăng nhập

Ví dụ:

```json
{ "code": 400, "error": "Vui lòng upload file hình ảnh hoặc video" }
```

```json
{ "code": 400, "error": "Tải file lên không hợp lệ" }
```

```json
{ "code": 401, "error": "Vui lòng đăng nhập để tiếp tục" }
```

### Ghi chú triển khai

- Sử dụng `cloudinary.uploader.upload` để upload file.
- Nếu `type === "reel"` thì `uploadOptions.resource_type = "video"`.
- Thông tin file được lưu trong field `post.id` (Cloudinary public id) và `post.url` (secure url).

### Tham chiếu mã nguồn

- Model: [`backend/models/postModel.js`](../models/postModel.js)
- Controller: [`backend/controllers/postControllers.js`](../controllers/postControllers.js)
- Routes: [`backend/routes/postRoutes.js`](../routes/postRoutes.js)
- Middleware upload: [`backend/middleware/multer.js`](../middleware/multer.js)
- Cấu hình Cloudinary: [`backend/config/cloudinary.js`](../config/cloudinary.js)
- Tiện ích Data URI: [`backend/utils/urlGenerator.js`](../utils/urlGenerator.js)

### Tài liệu liên quan

- [Đăng ký](./register.md)
- [Đăng nhập](./login.md)
- [Hồ sơ của tôi](./user-me.md)
