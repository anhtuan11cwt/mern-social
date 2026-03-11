import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { usePostData } from "../hooks/usePostData";
import { useUserData } from "../hooks/useUserData";

const Home = () => {
  const { user } = useUserData();
  const { posts, handlePostCreated } = usePostData();

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Xin chào, {user?.name}!
        </h2>
        <AddPost onPostCreated={handlePostCreated} type="post" />
        <div className="mt-8 space-y-4">
          {posts?.length ? (
            posts.map((post) => (
              <PostCard key={post?._id || post?.id} post={post} />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Chưa có bài đăng nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
