import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUserData } from "../hooks/useUserData";
import { SocketContext } from "./SocketContext.js";

export const SocketContextProvider = ({ children }) => {
  const { user } = useUserData() || {};
  const userId = user?._id;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";

    const newSocket = io(backendUrl, {
      query: {
        userId,
      },
    });

    socketRef.current = newSocket;

    // Trì hoãn cập nhật state để tránh render dây chuyền
    const timeoutId = setTimeout(() => {
      setSocket(newSocket);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users || []);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ isConnected, onlineUsers, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
