import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { useAuth } from "../store/user/authContext";

const App = () => {
  const { token } = useAuth();

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/signin" replace />;
  };

  const RedirectToHomeOrAuth = ({ children }) => {
    return token ? <Navigate to="/" replace /> : children;
  };

  return (
    <div>
      <Routes>
        <Route
          path="/signin"
          element={
            <RedirectToHomeOrAuth>
              <SignIn />
            </RedirectToHomeOrAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectToHomeOrAuth>
              <SignUp />
            </RedirectToHomeOrAuth>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home isMiddleSection={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Home isProfile={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path={"/profile/:id/following"}
          element={
            <PrivateRoute>
              <Home isConnections={true} isFollowing={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path={"/profile/:id/followers"}
          element={
            <PrivateRoute>
              <Home isConnections={true} isFollowing={false} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <Home isPost={true} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Navigate to="/" replace />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
