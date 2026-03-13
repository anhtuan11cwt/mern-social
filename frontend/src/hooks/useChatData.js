import { useContext } from "react";
import { ChatContext } from "../context/ChatContext.js";

export const useChatData = () => useContext(ChatContext);

export const ChatData = useChatData;
