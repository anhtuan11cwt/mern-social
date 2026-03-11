## Lấy danh sách bài viết và reels

### Mục tiêu

Endpoint này trả về danh sách tất cả bài viết dạng `post` và `reel`, sắp xếp theo thời gian tạo giảm dần, kèm thông tin chủ sở hữu (populate `owner`).

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/post/all`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (cần cookie `token` hợp lệ – middleware `isAuth`)

### Yêu cầu

Endpoint này không nhận body, params hay query bắt buộc nào khác ngoài cookie xác thực.

### Phản hồi

#### Thành công (200)

Trả về 2 mảng riêng biệt cho `posts` (type = `"post"`) và `reels` (type = `"reel"`).

```json
{
  "code": 200,
  "posts": [
    {
      "_id": "670000000000000000000001",
      "caption": "Ảnh 1",
      "owner": {
        "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
        "name": "Nguyễn Văn A",
        "email": "a@example.com"
      },
      "post": {
        "id": "mern-social/posts/img1",
        "url": "https://res.cloudinary.com/.../image/upload/v1/img1.jpg"
      },
      "type": "post",
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "reels": [
    {
      "_id": "670000000000000000000002",
      "caption": "Reel 1",
      "owner": {
        "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
        "name": "Nguyễn Văn A",
        "email": "a@example.com"
      },
      "post": {
        "id": "mern-social/posts/video1",
        "url": "https://res.cloudinary.com/.../video/upload/v1/video1.mp4"
      },
      "type": "reel",
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

#### Định dạng lỗi

Mọi lỗi đều tuân theo format chung:

```json
{ "code": 400, "error": "..." }
```

Controller hiện tại chủ yếu có thể phát sinh lỗi từ:

- Lỗi database khi truy vấn `Post.find`.
- Lỗi không xác định trong quá trình xử lý (được bọc bởi `tryCatch`).

### Ghi chú triển khai

- Controller sử dụng:

```js
const posts = await Post.find({ type: "post" })
  .populate("owner")
  .sort({ createdAt: -1 });

const reels = await Post.find({ type: "reel" })
  .populate("owner")
  .sort({ createdAt: -1 });
```

- Cả hai mảng đều được trả về trong cùng một response.

### Tham chiếu mã nguồn

- Model: [`backend/models/postModel.js`](../models/postModel.js)
- Controller: [`backend/controllers/postControllers.js`](../controllers/postControllers.js)
- Routes: [`backend/routes/postRoutes.js`](../routes/postRoutes.js)

### Tài liệu liên quan

- [Tạo bài viết mới](./post-new.md)
- [Xoá bài viết](./post-delete.md)
- [Đăng nhập](./login.md)
