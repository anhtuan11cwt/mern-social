import { useContext } from "react";
import { SocketContext } from "../context/SocketContext.js";

export const useSocketData = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketData phải được sử dụng trong SocketContextProvider",
    );
  }
  return context;
};
