// src/context/AppContext.js
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);

  // ✅ Remove trailing slash and trim whitespace from backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "");

  const navigate = useNavigate();

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const loadCreditsData = useCallback(async (signal) => {
    if (!token) return; // Don't try if no token

    try {
      console.log("Fetching credits...");
      const response = await axios.get("/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Use Bearer token
        signal,
      });
      console.log("Credits fetched:", response.data);
      if (response.data.success) {
        console.log("Updating credit state:", response.data.credits);
        setCredit(response.data.credits);
        setUser(response.data.user);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        return;
      }
      console.error("Error loading credits:", error);
      if (error.response?.status === 401) {
        setToken("");
        setUser(null);
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to load user data.");
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const controller = new AbortController();
      loadCreditsData(controller.signal);
      return () => controller.abort();
    }
  }, [token, loadCreditsData]);

  const generateImage = async (prompt) => {
    try {
      const response = await axios.post(
        "/api/image/generate-image",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Use Bearer token
      );
      if (response.data.success) {
        loadCreditsData(); // Reload credit balance
        return response.data.resultImage;
      } else {
        toast.error(response.data.message || "Failed to generate image");
        if (response.data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error("Error generating image.");
      console.error("Generate Image Error:", error);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setCredit(0); // Reset credit on logout
    toast.info("You have been logged out.");
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
