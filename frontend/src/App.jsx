import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "./components/loading";
import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import { useUserData } from "./hooks/useUserData";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reels from "./pages/Reels";
import Register from "./pages/Register";
import Search from "./pages/Search";
import UserAccount from "./pages/UserAccount";

function App() {
  const { isAuth, loading, user } = useUserData();

  if (loading) {
    return <Loading />;
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
          element={isAuth ? <UserAccount /> : <Navigate replace to="/login" />}
          path="/user/:id"
        />
        <Route
          element={isAuth ? <Search /> : <Navigate replace to="/login" />}
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
