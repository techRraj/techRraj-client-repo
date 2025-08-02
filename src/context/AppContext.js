import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || "";
  });
  const [credit, setCredit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "") || "";
  const navigate = useNavigate();

  // Store token in localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setCredit(0);
    }
  }, [token]);

  const loadCreditsData = useCallback(async (signal) => {
    if (!token) {
      setCredit(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal,
      });

      if (response.data.success) {
        setCredit(response.data.credits);
        if (response.data.user) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      
      console.error("Error loading credits:", error);
      
      if (error.response?.status === 401 && token) {
        setToken("");
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  // Load credits when token changes
  useEffect(() => {
    const controller = new AbortController();
    loadCreditsData(controller.signal);
    return () => controller.abort();
  }, [token, loadCreditsData]);

  const loginUser = useCallback(async (credentials) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, credentials);
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success("Login successful!");
        return true;
      }
      return false;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      toast.error(errorMessage);
      return false;
    }
  }, [backendUrl]);

  const generateImage = async (prompt) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/image/generate-image`,
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
      }
      throw new Error(response.data.message || "Failed to generate image");
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
        loginUser,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };