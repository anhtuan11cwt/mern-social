import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PostContext } from "./PostContext.js";

axios.defaults.withCredentials = true;

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data?.posts || []);
      setReels(data?.reels || []);
    } catch (error) {
      const message =
        error?.response?.data?.error || "Không thể tải danh sách bài đăng";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePostCreated = (createdPost) => {
    if (!createdPost) return;

    const isReel = createdPost?.type === "reel";
    if (isReel) {
      setReels((prev) => [createdPost, ...(prev || [])]);
      return;
    }

    setPosts((prev) => [createdPost, ...(prev || [])]);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <PostContext.Provider
      value={{
        fetchPosts,
        handlePostCreated,
        loading,
        posts,
        reels,
        setPosts,
        setReels,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
