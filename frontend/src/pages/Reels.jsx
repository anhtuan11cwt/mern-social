import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import AddPost from "../components/AddPost";
import { Loading } from "../components/loading";
import PostCard from "../components/PostCard";
import { usePostData } from "../hooks/usePostData";

const Reels = () => {
  const { reels, handlePostCreated, loading } = usePostData();
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

  if (loading) {
    return <Loading />;
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="flex justify-center items-center bg-gray-100 pb-16 min-h-screen">
        <div className="px-4 w-full max-w-[500px] md:max-w-[450px]">
          <h1 className="mb-6 font-bold text-gray-800 text-2xl text-center">
            Reel
          </h1>
          <AddPost onPostCreated={handlePostCreated} type="reel" />
          <div className="mt-8 text-center">
            <p className="text-gray-500">Chưa có reel nào.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 pb-16 min-h-screen">
      <div className="px-4 w-full max-w-[500px] md:max-w-[450px]">
        <h1 className="mb-6 font-bold text-gray-800 text-2xl text-center">
          Reel
        </h1>

        <AddPost onPostCreated={handlePostCreated} type="reel" />

        <div className="relative mt-8">
          <div className="flex justify-center items-center">
            <PostCard
              post={{ ...reels[currentIndex], type: "reel" }}
              ref={videoRef}
            />
          </div>

          <div className="flex flex-col gap-4 right-0 top-1/2 absolute -translate-y-1/2 translate-x-full ml-4">
            {currentIndex > 0 && (
              <button
                aria-label="Reel trước"
                className="bg-gray-500/80 hover:bg-gray-500 p-3 rounded-full text-white transition-colors duration-200 cursor-pointer"
                onClick={previousReel}
                type="button"
              >
                <FaArrowUp className="w-4 h-4" />
              </button>
            )}

            {currentIndex < reels.length - 1 && (
              <button
                aria-label="Reel tiếp theo"
                className="bg-gray-500/80 hover:bg-gray-500 p-3 rounded-full text-white transition-colors duration-200 cursor-pointer"
                onClick={nextReel}
                type="button"
              >
                <FaArrowDown className="w-4 h-4" />
              </button>
            )}
          </div>
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
