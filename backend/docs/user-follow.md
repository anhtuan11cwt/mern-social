## Theo dõi / Bỏ theo dõi user (`/api/user/follow/:id`)

### Mục tiêu

Endpoint này cho phép user hiện tại theo dõi hoặc bỏ theo dõi một user khác. Hành vi là toggle: nếu đang follow thì sẽ bỏ follow, nếu chưa follow thì sẽ follow.

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/user/follow/:id`
- **Kiểu nội dung**: `application/json`
- **Xác thực**: Bắt buộc (middleware `isAuth`)

### Yêu cầu

#### Tham số URL

- **id** (string, bắt buộc): `_id` của user mục tiêu cần theo dõi/bỏ theo dõi.

Ví dụ: `POST /api/user/follow/66f0b7c2c7b7b7b7b7b7b7b9`.

#### Body

- Không yêu cầu body (request có thể để trống).

#### Xác thực

- Client phải gửi cookie `token` hợp lệ.

### Phản hồi

#### Thành công (200) – Follow thành công

```json
{
  "code": 200,
  "message": "Theo dõi người dùng thành công"
}
```

#### Thành công (200) – Bỏ follow thành công

```json
{
  "code": 200,
  "message": "Bỏ theo dõi người dùng thành công"
}
```

#### Lỗi phổ biến

- **400**: 
  - Thiếu `id` user mục tiêu.
  - Cố gắng tự follow chính mình.
- **401**: chưa đăng nhập hoặc token không hợp lệ.
- **404**:
  - Không tìm thấy user hiện tại.
  - Không tìm thấy user mục tiêu.

Mọi lỗi đều dùng chung format:

```json
{ "code": 400, "error": "Thông báo lỗi chi tiết" }
```

### Ghi chú hành vi

- Khi follow:
  - `_id` của current user được thêm vào `targetUser.followers`.
  - `_id` của target user được thêm vào `currentUser.following`.
- Khi unfollow:
  - `_id` của current user bị xoá khỏi `targetUser.followers`.
  - `_id` của target user bị xoá khỏi `currentUser.following`.

### Tham chiếu mã nguồn

- Route: [`backend/routes/userRoutes.js`](../routes/userRoutes.js)
- Controller: [`backend/controllers/userController.js`](../controllers/userController.js)
- Middleware auth: [`backend/middleware/isAuth.js`](../middleware/isAuth.js)

### Tài liệu liên quan

- [Dữ liệu follower/following của user](./user-followdata.md)
- [Hồ sơ người dùng theo ID](./user-profile.md)
- [Hồ sơ của tôi](./user-me.md)
