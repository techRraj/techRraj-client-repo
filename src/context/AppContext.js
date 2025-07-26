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

  // Properly formatted backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "") || "";

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const loadCreditsData = useCallback(async (signal) => {
    if (!token) return;
    
    try {
      const fullUrl = `${backendUrl}/api/user/credits`.replace(/([^:]\/)\/+/g, "$1");
      const response = await axios.get(fullUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal,
      });

      if (response.data.success) {
        setCredit(response.data.credits);
        setUser(response.data.user);
      } else {
        toast.error(response.data.message || "Failed to load user data.");
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      
      console.error("Error loading credits:", error);
      if (error.response?.status === 401) {
        setToken("");
        setUser(null);
        toast.error("Session expired. Please log in again.");
      }
    }
  }, [token, backendUrl]);

  useEffect(() => {
    const controller = new AbortController();
    loadCreditsData(controller.signal);
    return () => controller.abort();
  }, [token, loadCreditsData]);

  const generateImage = async (prompt) => {
    try {
      const fullUrl = `${backendUrl}/api/image/generate-image`.replace(/([^:]\/)\/+/g, "$1");
      const response = await axios.post(
        fullUrl,
        { prompt },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await loadCreditsData();
        return response.data.resultImage;
      } else {
        throw new Error(response.data.message || "Failed to generate image");
      }
    } catch (error) {
      toast.error(error.message);
      if (error.response?.data?.creditBalance === 0) {
        navigate("/buy");
      }
      throw error;
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };