## Like và unlike bài viết

### Mục tiêu

Endpoint này cho phép người dùng **toggle** trạng thái like của một bài viết: nếu đã like thì sẽ unlike, nếu chưa like thì sẽ like. Kết quả trả về gồm thông báo và danh sách `likes` sau khi cập nhật.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/post/like/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (cần cookie `token` hợp lệ – middleware `isAuth`)

### Tham số

#### Path params

- **id**: ID của bài viết (MongoDB ObjectId)

### Ví dụ request

```http
POST /api/post/like/670000000000000000000001 HTTP/1.1
Host: localhost:7000
Cookie: token=<jwt>
```

### Phản hồi

#### Like thành công (200)

```json
{
  "code": 200,
  "message": "Đã thích bài viết",
  "likesCount": 1,
  "likes": ["66f0b7c2c7b7b7b7b7b7b7b7"]
}
```

#### Unlike thành công (200)

```json
{
  "code": 200,
  "message": "Đã bỏ thích bài viết",
  "likesCount": 0,
  "likes": []
}
```

#### Định dạng lỗi

Mọi lỗi đều tuân theo format chung:

```json
{ "code": 400, "error": "..." }
```

Các trường hợp thường gặp:

- **400**: Thiếu `id` bài đăng (`Thiếu ID bài đăng`)
- **401**: Chưa đăng nhập / token không hợp lệ
- **404**: Không tìm thấy bài viết với ID này

### Tham chiếu mã nguồn

- Controller: [`backend/controllers/postControllers.js`](../controllers/postControllers.js)
- Routes: [`backend/routes/postRoutes.js`](../routes/postRoutes.js)
- Model: [`backend/models/postModel.js`](../models/postModel.js)

### Tài liệu liên quan

- [Tạo bài viết mới](./post-new.md)
- [Xoá bài viết](./post-delete.md)
- [Lấy danh sách bài viết và reels](./post-all.md)
