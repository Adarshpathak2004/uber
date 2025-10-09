import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import CaptainLogin from "./pages/CaptainLogin.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-white text-blue-600 font-bold transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captainlogin" element={<CaptainLogin />} />
        <Route path="/captainsignup" element={<CaptainSignup />} />
      </Routes>
    </div>
  );
};

export default App;
