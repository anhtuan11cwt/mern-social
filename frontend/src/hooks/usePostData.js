import { useContext } from "react";
import { PostContext } from "../context/PostContext.js";

export const usePostData = () => useContext(PostContext);

export const PostData = usePostData;
