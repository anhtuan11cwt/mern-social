## Dữ liệu follower/following (`/api/user/followdata/:id`)

### Mục tiêu

Endpoint này trả về danh sách follower và following của một user bất kỳ theo `id`.

### Tóm tắt API

- **Phương thức**: `GET`
- **Đường dẫn**: `http://localhost:7000/api/user/followdata/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Tham số URL

- **id** (string, bắt buộc): `_id` của user trong MongoDB mà bạn muốn xem follower/following.

Ví dụ: `GET /api/user/followdata/66f0b7c2c7b7b7b7b7b7b7b7`.

#### Xác thực

- Client phải gửi cookie `token` hợp lệ.

### Phản hồi

#### Thành công (200)

```json
{
  "code": 200,
  "followers": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b8",
      "name": "Follower 1",
      "email": "f1@example.com"
    }
  ],
  "following": [
    {
      "_id": "66f0b7c2c7b7b7b7b7b7b7b9",
      "name": "Following 1",
      "email": "fo1@example.com"
    }
  ]
}
```

Các user trong `followers` và `following` đều không có trường `password` (`populate(..., "-password")`).

#### Lỗi phổ biến

- **400**: thiếu `id` trong `req.params`.
- **404**: không có user với `id` tương ứng.
- **401/403**: lỗi xác thực từ middleware `isAuth`.

Lỗi dùng chung format:

```json
{ "code": 400, "error": "Thông báo lỗi chi tiết" }
```

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Hồ sơ người dùng theo ID](./user-profile.md)
- [Hồ sơ của tôi](./user-me.md)
- [Theo dõi / Bỏ theo dõi user](./user-follow.md)
