// PostContext.jsx
//
// Quản lý trạng thái bài viết và reels: danh sách, thích, bình luận,
// xóa, cập nhật caption. Tự động fetch khi user đăng nhập.
//
// Tại sao dùng Context: Post state được dùng ở Home, Reels, Account.
// Context tránh prop drilling và giữ logic tập trung ở một nơi.

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useUserData } from "../hooks/useUserData";
import { PostContext } from "./PostContext.js";

axios.defaults.withCredentials = true;

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user, isAuth, loading: userLoading } = useUserData();

  const fetchPosts = useCallback(async () => {
    if (!isAuth) {
      setPosts([]);
      setReels([]);
      setHasFetched(false);
      setLoading(false);
      return;
    }
    if (!hasFetched) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data?.posts || []);
      setReels(data?.reels || []);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể tải danh sách bài đăng";
      toast.error(message);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  }, [hasFetched, isAuth]);

  const addPost = async ({
    formData,
    setCaption,
    setFile,
    setFilePreview,
    type = "post",
  }) => {
    if (!formData) {
      toast.error("Dữ liệu bài viết không hợp lệ");
      return;
    }

    setAddLoading(true);
    try {
      const endpoint = `/api/post/new?type=${encodeURIComponent(type)}`;
      const { data } = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data?.message || "Đăng bài thành công");

      if (setCaption) setCaption("");
      if (setFile) setFile(null);
      if (setFilePreview) setFilePreview(null);

      // Không cần fetchPosts() vì handlePostCreated đã thêm post mới vào state.
      // Chỉ fetch lại nếu cần sync với server (optional).
      // await fetchPosts();

      return data?.post;
    } catch (error) {
      const message = error?.response?.data?.error || "Đăng bài thất bại";
      toast.error(message);
      throw error;
    } finally {
      setAddLoading(false);
    }
  };

  const handlePostCreated = (createdPost) => {
    if (!createdPost) return;

    const isReel = createdPost?.type === "reel";
    const postId = createdPost?._id || createdPost?.id;

    if (isReel) {
      setReels((prev) => {
        // Tránh duplicate: kiểm tra xem post đã tồn tại chưa.
        // Cần thiết vì socket event có thể fire trước khi API response trả về.
        const exists = prev?.some(
          (p) => (p?._id || p?.id)?.toString() === postId?.toString(),
        );
        if (exists) return prev;
        return [createdPost, ...(prev || [])];
      });
      return;
    }

    setPosts((prev) => {
      // Tránh duplicate: kiểm tra xem post đã tồn tại chưa.
      // Cần thiết vì socket event có thể fire trước khi API response trả về.
      const exists = prev?.some(
        (p) => (p?._id || p?.id)?.toString() === postId?.toString(),
      );
      if (exists) return prev;
      return [createdPost, ...(prev || [])];
    });
  };

  const likePost = async (id) => {
    try {
      const { data } = await axios.post(`/api/post/like/${id}`);
      toast.success(
        data?.message ||
          (data?.likes?.includes(user?._id)
            ? "Đã thích bài viết"
            : "Đã bỏ thích bài viết"),
      );
      await fetchPosts();
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể thích bài viết";
      toast.error(message);
      throw error;
    }
  };

  const addComment = async (id, comment, setComment) => {
    if (!comment || !comment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      const { data } = await axios.post(`/api/post/comment/${id}`, {
        comment: comment.trim(),
      });

      toast.success(data?.message || "Đã thêm bình luận");
      await fetchPosts();

      if (setComment) setComment("");
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể thêm bình luận";
      toast.error(message);
      throw error;
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!postId || !commentId) {
      toast.error("Thiếu thông tin để xóa bình luận");
      return;
    }

    try {
      const { data } = await axios.delete(
        `/api/post/comment/${postId}?commentId=${commentId}`,
      );

      toast.success(data?.message || "Đã xóa bình luận");
      await fetchPosts();
    } catch (error) {
      const message = error?.response?.data?.error || "Không thể xóa bình luận";
      toast.error(message);
      throw error;
    }
  };

  const deletePost = async (id) => {
    if (!id) {
      toast.error("Thiếu thông tin để xóa bài viết");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/post/${id}`);
      toast.success(data?.message || "Đã xóa bài viết");
      await fetchPosts();
    } catch (error) {
      const message = error?.response?.data?.error || "Không thể xóa bài viết";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCaption = async (id, caption) => {
    if (!id) {
      toast.error("Thiếu thông tin để cập nhật bài viết");
      return;
    }

    try {
      const { data } = await axios.put(`/api/post/${id}`, { caption });
      toast.success(data?.message || "Đã cập nhật bài viết");

      // Cập nhật cục bộ thay vì fetch lại toàn bộ.
      // Nhanh hơn và tránh flicker UI khi cập nhật caption.
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? { ...post, caption } : post)),
      );
      setReels((prev) =>
        prev.map((reel) => (reel._id === id ? { ...reel, caption } : reel)),
      );
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể cập nhật bài viết";
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuth || userLoading) {
      return;
    }
    fetchPosts();
  }, [fetchPosts, isAuth, userLoading]);

  return (
    <PostContext.Provider
      value={{
        addComment,
        addLoading,
        addPost,
        deleteComment,
        deletePost,
        fetchPosts,
        handlePostCreated,
        likePost,
        loading,
        posts,
        reels,
        setPosts,
        setReels,
        updateCaption,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
