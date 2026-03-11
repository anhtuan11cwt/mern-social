import { Link } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";

const Home = () => {
  const { user } = useUserData();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Ứng dụng xã hội</h1>
          <div className="flex items-center gap-4">
            <Link
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
              to="/account"
            >
              Tài khoản
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Xin chào, {user?.name}!
        </h2>
      </div>
    </div>
  );
};

export default Home;
