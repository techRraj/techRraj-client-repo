// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContext, AppContextProvider } from "./context/AppContext"; // ✅ Correct import
import Navbar from "./component/Navbar";
import Home from "./page/Home";
import Result from "./page/Result";
import BuyCredit from "./page/BuyCredit";
import Footer from "./component/Footer";
import NotFound from "./page/NotFound";
import { ToastContainer } from 'react-toastify';
import Login from "./component/Login";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Add Bootstrap CSS

const App = () => {
  return (
    <Router>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </Router>
  );
};

const AppContent = () => {
  const { showLogin } = useContext(AppContext); // ✅ Use context correctly

  return (
    <div className="main-container">
      <ToastContainer />
      <Navbar />
      {showLogin && <Login />} {/* ✅ Conditionally render Login */}
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