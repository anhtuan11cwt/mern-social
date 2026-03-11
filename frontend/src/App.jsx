import { Navigate, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import { useUserData } from "./hooks/useUserData";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reels from "./pages/Reels";
import Register from "./pages/Register";

function App() {
  const { isAuth, loading, user } = useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Đang tải...</h1>
      </div>
    );
  }

  return (
    <>
      {isAuth && <NavigationBar />}
      <Routes>
        <Route
          element={isAuth ? <Home /> : <Navigate replace to="/login" />}
          path="/"
        />
        <Route
          element={isAuth ? <Navigate replace to="/" /> : <Login />}
          path="/login"
        />
        <Route
          element={isAuth ? <Navigate replace to="/" /> : <Register />}
          path="/register"
        />
        <Route
          element={
            isAuth ? <Account user={user} /> : <Navigate replace to="/login" />
          }
          path="/account"
        />
        <Route
          element={isAuth ? <Reels /> : <Navigate replace to="/login" />}
          path="/reels"
        />
        <Route
          element={
            isAuth ? (
              <div className="pb-16">Trang Tìm kiếm</div>
            ) : (
              <Navigate replace to="/login" />
            )
          }
          path="/search"
        />
        <Route
          element={
            isAuth ? (
              <div className="pb-16">Trang Trò chuyện</div>
            ) : (
              <Navigate replace to="/login" />
            )
          }
          path="/chat"
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </>
  );
}

export default App;
