import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/userlogin.jsx";
import UserSignup from "./pages/usersignup.jsx";
import CaptainLogin from "./pages/CaptainLogin.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import Start from "./pages/Start.jsx";
import UserProtectWrapper from "./pages/UserProtectWrapper.jsx";
import UserLogout from "./pages/UserLogout.jsx";
import CaptainHome from "./pages/captainhome.jsx";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper.jsx";
const App = () => {
  return (
    <div className="min-h-screen bg-white text-blue-600 font-bold transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captainlogin" element={<CaptainLogin />} />
        <Route path="/captainsignup" element={<CaptainSignup />} />

        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />

          </UserProtectWrapper>
        } />
        <Route path='/user/logout' element={ <UserProtectWrapper>
          <Home />
        </UserProtectWrapper>}/>
        <Route path="/captain-home" element={<CaptainProtectWrapper>
          <CaptainHome />
        </CaptainProtectWrapper>}/>

      </Routes>
    </div>
  );
};

export default App;
