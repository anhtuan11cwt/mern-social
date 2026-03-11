import { useState } from "react";
import {
  AiFillCompass,
  AiFillHome,
  AiFillMessage,
  AiOutlineCompass,
  AiOutlineHome,
  AiOutlineMessage,
} from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { PiVideo, PiVideoFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(window.location.pathname);

  const handleNavigate = (path) => {
    setTab(path);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          className="flex flex-col items-center cursor-pointer p-2"
          onClick={() => handleNavigate("/")}
          type="button"
        >
          {tab === "/" ? (
            <AiFillHome className="w-6 h-6" />
          ) : (
            <AiOutlineHome className="w-6 h-6" />
          )}
        </button>

        <button
          className="flex flex-col items-center cursor-pointer p-2"
          onClick={() => handleNavigate("/reels")}
          type="button"
        >
          {tab === "/reels" ? (
            <PiVideoFill className="w-6 h-6" />
          ) : (
            <PiVideo className="w-6 h-6" />
          )}
        </button>

        <button
          className="flex flex-col items-center cursor-pointer p-2"
          onClick={() => handleNavigate("/search")}
          type="button"
        >
          {tab === "/search" ? (
            <AiFillCompass className="w-6 h-6" />
          ) : (
            <AiOutlineCompass className="w-6 h-6" />
          )}
        </button>

        <button
          className="flex flex-col items-center cursor-pointer p-2"
          onClick={() => handleNavigate("/chat")}
          type="button"
        >
          {tab === "/chat" ? (
            <AiFillMessage className="w-6 h-6" />
          ) : (
            <AiOutlineMessage className="w-6 h-6" />
          )}
        </button>

        <button
          className="flex flex-col items-center cursor-pointer p-2"
          onClick={() => handleNavigate("/account")}
          type="button"
        >
          <FiUser className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default NavigationBar;
