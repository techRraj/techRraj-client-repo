// src/context/AppContext.js
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Create the context
export const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);

  // ✅ Trim and clean backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "");
  const navigate = useNavigate();

  // Persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Load credits
  const loadCreditsData = useCallback(async (signal) => {
    if (!token) return;

    try {
      const response = await axios.get("/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      if (response.data.success) {
        setCredit(response.data.credits);
        setUser(response.data.user);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;

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

  // Generate image
  const generateImage = async (prompt) => {
    try {
      const response = await axios.post(
        "/api/image/generate-image",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        loadCreditsData();
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

  // Logout
  const logout = () => {
    setToken("");
    setUser(null);
    setCredit(0);
    toast.info("Logged out successfully");
  };

  // Value to provide
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