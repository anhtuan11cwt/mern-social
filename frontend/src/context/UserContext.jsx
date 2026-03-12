import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "./UserContext.js";

axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data.user);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = async ({ email, password, navigate }) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });
      setUser(data.user);
      setIsAuth(true);
      toast.success("Đăng nhập thành công");
      navigate("/");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.error || "Đăng nhập thất bại, vui lòng thử lại";
      toast.error(message);
      setIsAuth(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData, navigate) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(data.user);
      setIsAuth(true);
      toast.success("Đăng ký thành công");
      navigate("/");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.error || "Đăng ký thất bại, vui lòng thử lại";
      toast.error(message);
      setIsAuth(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async (navigate) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/auth/logout");
      setUser(null);
      setIsAuth(false);
      const message = data?.message || "Đăng xuất thành công";
      toast.success(message);
      navigate("/login");
    } catch {
      toast.error("Đăng xuất thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const followUser = async ({ id, fetchUser }) => {
    try {
      const { data } = await axios.post(`/api/user/follow/${id}`);
      const message =
        data?.message || "Cập nhật trạng thái theo dõi thành công";
      toast.success(message);
      if (typeof fetchUser === "function") {
        await fetchUser();
      }
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Không thể cập nhật trạng thái theo dõi, vui lòng thử lại";
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        fetchUser,
        followUser,
        isAuth,
        loading,
        loginUser,
        logoutUser,
        registerUser,
        setIsAuth,
        setLoading,
        setUser,
        user,
      }}
    >
      {children}
      <Toaster position="top-right" />
    </UserContext.Provider>
  );
};
