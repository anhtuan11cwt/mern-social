## Register (đăng ký tài khoản)

### Mục tiêu

Endpoint này tạo tài khoản mới, upload ảnh đại diện lên Cloudinary, hash mật khẩu bằng `bcrypt`, lưu user vào MongoDB, và set JWT vào cookie `token` (httpOnly).

### Tóm tắt API

- **Phương thức**: `POST`
- **Đường dẫn**: `http://localhost:7000/api/auth/register`
- **Kiểu nội dung**: `multipart/form-data`
- **Xác thực**: Công khai (không cần đăng nhập)

### Yêu cầu

#### Trường dữ liệu (multipart)

- **name** (string, bắt buộc)
- **email** (string, bắt buộc)
- **password** (string, bắt buộc)
- **gender** (string, bắt buộc)
- **file** (file, bắt buộc): ảnh đại diện

#### Ràng buộc upload

- **Kích thước file tối đa**: 5MB (giới hạn bởi `multer`)
- **Tên field**: `file` (được map bởi `uploadFile.single("file")`)

### Phản hồi

#### Thành công (201)

Trả về object user (đã loại bỏ `password`) và message. JWT được set vào cookie `token`.

```json
{
  "code": 201,
  "message": "Đăng ký tài khoản thành công",
  "user": {
    "_id": "66f0b7c2c7b7b7b7b7b7b7b7",
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "gender": "male",
    "profilePic": {
      "id": "mern-social/users/xxx",
      "url": "https://res.cloudinary.com/.../image/upload/...jpg"
    }
  }
}
```

#### Định dạng lỗi

Tất cả lỗi đều theo định dạng:

```json
{ "code": 400, "error": "..." }
```

#### Các lỗi thường gặp

- **400**: thiếu dữ liệu bắt buộc (`name/email/password/gender/file`)
- **400**: email đã tồn tại
- **400**: file upload không hợp lệ (không tạo được Data URI)
- **500**: JWT chưa được cấu hình (`JWT_SECRET`)
- **500**: lỗi không xác định khi đăng ký (Cloudinary/MongoDB/…)

### Cookie và lưu ý bảo mật

- **Tên cookie**: `token`
- **httpOnly**: `true`
- **sameSite**: `"strict"`
- **secure**: `true` khi `NODE_ENV === "production"`
- **expires**: 15 ngày

Lưu ý: API hiện tại **không validate format email/độ mạnh mật khẩu** ngoài việc kiểm tra “có/không”. Nếu bạn cần chuẩn hoá validation, nên bổ sung schema validation (ví dụ zod) ở layer route/middleware.

### Biến môi trường

Cần cấu hình các biến sau (ví dụ trong `.env`):

```bash
PORT=7000
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Tham chiếu mã nguồn

- Route: [`backend/routes/authRoutes.js`](../routes/authRoutes.js)
- Controller: [`backend/controllers/authControllers.js`](../controllers/authControllers.js)
- Middleware upload: [`backend/middleware/multer.js`](../middleware/multer.js)
- Cấu hình Cloudinary: [`backend/config/cloudinary.js`](../config/cloudinary.js)
- Tiện ích token: [`backend/utils/generateToken.js`](../utils/generateToken.js)
- Tiện ích Data URI: [`backend/utils/urlGenerator.js`](../utils/urlGenerator.js)

### Tài liệu liên quan

- Tài liệu upload Cloudinary: `https://cloudinary.com/documentation/image_upload_api_reference`
- Tài liệu Multer: `https://github.com/expressjs/multer`
- [Đăng nhập](./login.md)
- [Đăng xuất](./logout.md)
- [Hồ sơ của tôi](./user-me.md)
- [Hồ sơ người dùng theo ID](./user-profile.md)

