import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind CSS
import UserContext from "./context/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import CaptainContext, { CaptainDataContext } from "./context/CaptainContext.jsx";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <CaptainContext>
  <UserContext>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </UserContext>
  </CaptainContext>
  </React.StrictMode>
);
