import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import User from "../pages/User";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import TopBar from "../components/shared/TopBar";

const App = () => {
  return (
    <div>
      <TopBar />
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/:username" element={<User />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
