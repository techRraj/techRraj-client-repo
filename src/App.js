// ./App.js

import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider, {  AppContext } from "./context/AppContext";
import Navbar from "./component/Navbar";
import Home from "./page/Home";
import Result from "./page/Result";
import BuyCredit from "./page/BuyCredit";
import Footer from "./component/Footer";
import NotFound from "./page/NotFound";
import { ToastContainer } from 'react-toastify';
import Login from "./component/Login";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// ✅ Wrap everything with <Router> here
const App = () => {
  return (
    <Router>
   
       <AppContextProvider>
        <AppContent/>
       </AppContextProvider>
      
    </Router>
  );
};

const AppContent = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div className="main-container">
      <ToastContainer />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;