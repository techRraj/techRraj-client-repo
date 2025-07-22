// src/context/AppContextProvider.js
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

  // ✅ Trim and clean backend URL (remove trailing slashes/spaces)
  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "") || "";

  const navigate = useNavigate();

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Load user credits from server
  const loadCreditsData = useCallback(async (signal) => {
    if (!token) return;

    try {
      console.log("Fetching credits from server...");
      const response = await axios.get("/api/user/credits", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Standard JWT header
        },
        signal,
      });

      if (response.data.success) {
        setCredit(response.data.credits);
        setUser(response.data.user);
        console.log("Credit balance updated:", response.data.credits);
      } else {
        toast.error(response.data.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Error loading credits:", error);

      if (axios.isCancel(error)) return;

      if (error.response?.status === 401) {
        // Token expired or invalid
        setToken("");
        setUser(null);
        setCredit(0);
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Network error. Failed to load user data.");
      }
    }
  }, [token]);

  // Re-fetch credits when token changes
  useEffect(() => {
    if (token) {
      const controller = new AbortController();
      loadCreditsData(controller.signal);
      return () => controller.abort();
    }
  }, [token, loadCreditsData]);

  // Generate image and deduct credit
  const generateImage = async (prompt) => {
    if (!prompt || !token) {
      toast.error("Prompt and login required");
      return;
    }

    try {
      const response = await axios.post(
        "/api/image/generate-image",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Image generated!");
        loadCreditsData(); // Refresh credit balance
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

  // Logout handler
  const logout = () => {
    setToken("");
    setUser(null);
    setCredit(0);
    toast.info("Logged out successfully");
  };

  // Context value
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