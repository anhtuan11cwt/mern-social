import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <PostContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
