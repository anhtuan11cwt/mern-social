// Login.jsx
//
// Trang đăng nhập cho phép người dùng xác thực bằng email và mật khẩu.
// Sau khi đăng nhập thành công, tải danh sách bài viết và chuyển hướng tới trang chủ.

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading, loginUser } = useUserData();
  const { fetchPosts } = usePostData();

  const submitHandler = async (e) => {
    e.preventDefault();
    // Gọi API đăng nhập. Nếu thành công, tải bài viết và chuyển hướng.
    const success = await loginUser({ email, navigate, password });
    if (success) {
      await fetchPosts();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-[90%] md:w-1/3 bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 mt-[140px] md:mt-0"
        onSubmit={submitHandler}
      >
        <h1 className="text-2xl font-semibold text-gray-700 text-center">
          Đăng nhập vào Mạng xã hội
        </h1>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600" htmlFor="email">
            Email
          </label>
          <input
            className="custom-input"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            type="email"
            value={email}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600" htmlFor="password">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              className="custom-input pr-10"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button className="auth-btn mt-2" disabled={loading} type="submit">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-center text-gray-600 mt-2">
          Chưa có tài khoản?{" "}
          <Link className="text-blue-600 hover:underline" to="/register">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
