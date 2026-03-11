## Xoá bài viết

### Mục tiêu

Endpoint này cho phép user xoá bài viết mà họ sở hữu. Nếu bài viết có file trên Cloudinary thì file đó cũng sẽ bị xoá.

### Tóm tắt API

- **Phương thức**: `DELETE`
- **Đường dẫn**: `http://localhost:7000/api/post/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (cần cookie `token` hợp lệ – middleware `isAuth`)

### Yêu cầu

#### Path params

- **id** (string, bắt buộc): `_id` của document `Post` trong MongoDB.

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "message": "Bài viết đã được xóa"
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng:

```json
{ "code": 400, "error": "..." }
```

Các trường hợp lỗi chính:

- **400**: thiếu `id` trong params

```json
{ "code": 400, "error": "Thiếu ID bài đăng" }
```

- **401**: user chưa đăng nhập

```json
{ "code": 401, "error": "Vui lòng đăng nhập để tiếp tục" }
```

- **403**: user không phải chủ sở hữu bài viết

```json
{ "code": 403, "error": "Bạn không có quyền xoá bài đăng này" }
```

- **404**: không tìm thấy bài viết với `id` tương ứng

```json
{ "code": 404, "error": "Không tìm thấy bài viết với ID này" }
```

### Ghi chú triển khai

- Sau khi tìm được `Post` theo `id`, controller kiểm tra:
  - user hiện tại (`req.user._id`) có trùng với `post.owner` hay không.
- Nếu `post.post.id` tồn tại, controller gọi:

```js
cloudinary.uploader.destroy(publicId);
```

để xoá file trên Cloudinary trước khi `post.deleteOne()`.

### Tham chiếu mã nguồn

- Model: [`backend/models/postModel.js`](../models/postModel.js)
- Controller: [`backend/controllers/postControllers.js`](../controllers/postControllers.js)
- Routes: [`backend/routes/postRoutes.js`](../routes/postRoutes.js)
- Cấu hình Cloudinary: [`backend/config/cloudinary.js`](../config/cloudinary.js)

### Tài liệu liên quan

- [Tạo bài viết mới](./post-new.md)
- [Đăng nhập](./login.md)
- [Hồ sơ của tôi](./user-me.md)
