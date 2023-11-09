import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import TopBar from "../components/shared/TopBar";

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
