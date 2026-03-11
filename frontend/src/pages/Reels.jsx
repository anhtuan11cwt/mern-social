import AddPost from "../components/AddPost";
import { usePostData } from "../hooks/usePostData";

const Reels = () => {
  const { reels, handlePostCreated } = usePostData();

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reel</h1>
        <AddPost onPostCreated={handlePostCreated} type="reel" />
        <div className="mt-8 space-y-6">
          {reels?.length ? (
            reels.map((reel) => {
              const videoUrl =
                reel?.post?.url ||
                reel?.videoUrl ||
                reel?.fileUrl ||
                reel?.url ||
                "";

              return (
                <div
                  className="bg-white rounded-lg shadow-sm p-4"
                  key={reel?._id || reel?.id}
                >
                  <p className="text-sm text-gray-700 mb-3">
                    {reel?.caption || ""}
                  </p>
                  {videoUrl ? (
                    <video
                      className="w-full max-h-[500px] rounded-md"
                      controls
                      controlsList="nodownload"
                      src={videoUrl}
                    >
                      <track kind="captions" />
                    </video>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-4">Chưa có reel nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
