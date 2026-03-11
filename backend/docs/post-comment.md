## Bình luận bài viết

### Mục tiêu

Endpoint này cho phép người dùng đã đăng nhập thêm bình luận vào một bài viết. Mỗi bình luận sẽ được lưu dưới dạng một object trong mảng `comments` của bài viết và **MongoDB tự động tạo `_id` riêng** cho từng bình luận.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/post/comment/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (cần cookie `token` hợp lệ – middleware `isAuth`)

### Tham số

#### Path params

- **id**: ID của bài viết (MongoDB ObjectId)

#### Body

```json
{ "comment": "Ảnh đẹp quá" }
```

### Ví dụ request

```http
POST /api/post/comment/670000000000000000000001 HTTP/1.1
Host: localhost:7000
Content-Type: application/json
Cookie: token=<jwt>

{ "comment": "Ảnh đẹp quá" }
```

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "message": "Đã thêm bình luận",
  "commentsCount": 1,
  "comments": [
    {
      "_id": "6700000000000000000000c1",
      "user": "66f0b7c2c7b7b7b7b7b7b7b7",
      "name": "Nguyễn Văn A",
      "comment": "Ảnh đẹp quá",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Định dạng lỗi

Mọi lỗi đều tuân theo format chung:

```json
{ "code": 400, "error": "..." }
```

Các trường hợp thường gặp:

- **400**: Thiếu `id` bài đăng (`Thiếu ID bài đăng`) hoặc body `comment` không hợp lệ
- **401**: Chưa đăng nhập / token không hợp lệ
- **404**: Không tìm thấy bài viết với ID này

### Ghi chú kiểm tra dữ liệu trong database

Khi xem document của bài viết trong MongoDB, bạn sẽ thấy mảng `comments` chứa các object. Mỗi object bình luận sẽ có một trường `_id` riêng (do MongoDB tự cấp) bên cạnh `user`, `name`, `comment`, `createdAt`.

---

## Xoá bình luận

### Mục tiêu

Endpoint này cho phép người dùng đã đăng nhập xoá một bình luận khỏi bài viết. Bình luận chỉ được xoá nếu **người hiện tại là chủ sở hữu bài viết** hoặc **là người đã viết bình luận đó**.

### Tóm tắt API

- **Phương thức**: `DELETE`
- **Đường dẫn**: `http://localhost:7000/api/post/comment/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Tham số

#### Path params

- **id**: ID của bài viết (MongoDB ObjectId)

#### Body

```json
{ "commentId": "6700000000000000000000c1" }
```

### Ví dụ request

```http
DELETE /api/post/comment/670000000000000000000001 HTTP/1.1
Host: localhost:7000
Content-Type: application/json
Cookie: token=<jwt>

{ "commentId": "6700000000000000000000c1" }
```

### Logic xử lý

1. Lấy `postId` từ `req.params.id` và `commentId` từ `req.body.commentId`.
2. Nếu không có `commentId`, trả về:

```json
{ "code": 404, "error": "Vui lòng cung cấp ID bình luận" }
```

3. Tìm bài viết bằng `Post.findById(postId)`. Nếu không tồn tại, trả về:

```json
{ "code": 404, "error": "Không tìm thấy bài viết với ID này" }
```

4. Tìm vị trí bình luận trong `post.comments` bằng `findIndex`, so sánh `_id.toString()` với `commentId.toString()`. Nếu không tìm thấy (vị trí `-1`), trả về:

```json
{ "code": 400, "error": "Không tìm thấy bình luận" }
```

5. Kiểm tra quyền xoá:
   - Nếu `post.owner.toString() === userId.toString()` **(chủ bài viết)** hoặc
   - `comment.user.toString() === userId.toString()` **(người viết bình luận)**:
     - Cho phép xoá.
   - Ngược lại, trả về:

```json
{ "code": 403, "error": "Bạn không có quyền xóa bình luận này" }
```

6. Nếu hợp lệ, dùng `post.comments.splice(commentIndex, 1)` để xoá bình luận và gọi `post.save()` để lưu thay đổi.

### Phản hồi thành công

```json
{
  "code": 200,
  "message": "Đã xóa bình luận",
  "commentsCount": 0,
  "comments": []
}
```

Trong thực tế, `commentsCount` và nội dung mảng `comments` sẽ phản ánh trạng thái mới sau khi xoá (không nhất thiết là 0 nếu còn các bình luận khác).

### Tham chiếu mã nguồn

- Controller: [`backend/controllers/postControllers.js`](../controllers/postControllers.js)
- Routes: [`backend/routes/postRoutes.js`](../routes/postRoutes.js)
- Model: [`backend/models/postModel.js`](../models/postModel.js)

### Tài liệu liên quan

- [Tạo bài viết mới](./post-new.md)
- [Xoá bài viết](./post-delete.md)
- [Like và unlike bài viết](./post-like.md)
- [Lấy danh sách bài viết và reels](./post-all.md)
