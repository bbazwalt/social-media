import { Route, Routes } from "react-router-dom";
import TopBar from "../components/shared/TopBar";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import UserPage from "../pages/UserPage";

const App = () => {
  return (
    <div>
      <TopBar />
      <div className="container">
        <Routes>
          <Route exact path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/:username" element={<UserPage />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
