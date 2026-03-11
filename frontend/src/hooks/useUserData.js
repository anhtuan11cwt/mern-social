import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

export const useUserData = () => useContext(UserContext);
