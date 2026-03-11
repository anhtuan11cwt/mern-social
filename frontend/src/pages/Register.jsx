import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading, registerUser } = useUserData();

  const fileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !gender || !file) {
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("file", file);
    registerUser(formData, navigate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Đang tải...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-[90%] md:w-1/2 bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
        onSubmit={submitHandler}
      >
        <h1 className="text-2xl font-semibold text-gray-700 text-center">
          Đăng ký vào Mạng xã hội
        </h1>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600" htmlFor="username">
            Tên người dùng
          </label>
          <input
            className="custom-input"
            id="username"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên người dùng của bạn"
            type="text"
            value={name}
          />
        </div>

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

        <div className="flex flex-col gap-2">
          <label className="text-gray-600" htmlFor="gender">
            Giới tính
          </label>
          <select
            className="custom-input"
            id="gender"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600" htmlFor="profilePicture">
            Ảnh đại diện
          </label>
          <input
            accept="image/*"
            className="custom-input"
            id="profilePicture"
            onChange={fileHandler}
            type="file"
          />
          {filePreview && (
            <div className="flex justify-center mt-2">
              <img
                alt="Xem trước"
                className="w-20 h-20 rounded-full object-cover"
                src={filePreview}
              />
            </div>
          )}
        </div>

        <button className="auth-btn mt-2" disabled={loading} type="submit">
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="text-center text-gray-600 mt-2">
          Đã có tài khoản?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
