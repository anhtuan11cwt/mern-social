import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { usePostData } from "../hooks/usePostData";

const Reels = () => {
  const { reels, handlePostCreated } = usePostData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const previousReel = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const nextReel = () => {
    if (currentIndex === reels.length - 1) return;
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  if (!reels || reels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 flex items-center justify-center">
        <div className="w-full max-w-[500px] md:max-w-[450px] px-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Reel
          </h1>
          <AddPost onPostCreated={handlePostCreated} type="reel" />
          <div className="text-center mt-8">
            <p className="text-gray-500">Chưa có reel nào.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 flex items-center justify-center">
      <div className="w-full max-w-[500px] md:max-w-[450px] px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reel
        </h1>

        <AddPost onPostCreated={handlePostCreated} type="reel" />

        <div className="relative mt-8">
          {currentIndex > 0 && (
            <button
              aria-label="Reel trước"
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-500/80 hover:bg-gray-500 text-white p-3 rounded-full cursor-pointer transition-colors duration-200 z-10"
              onClick={previousReel}
              type="button"
            >
              <FaArrowUp className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center justify-center">
            <PostCard
              post={{ ...reels[currentIndex], type: "reel" }}
              ref={videoRef}
            />
          </div>

          {currentIndex < reels.length - 1 && (
            <button
              aria-label="Reel tiếp theo"
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-500/80 hover:bg-gray-500 text-white p-3 rounded-full cursor-pointer transition-colors duration-200 z-10"
              onClick={nextReel}
              type="button"
            >
              <FaArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reels.map((reel, index) => (
            <button
              aria-label={`Reel ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
              key={reel._id || `reel-${index}`}
              onClick={() => setCurrentIndex(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reels;
