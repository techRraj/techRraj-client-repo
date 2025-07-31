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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL?.trim().replace(/\/+$/, "") || "";
  const navigate = useNavigate();

  const handleSessionExpiry = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    toast.error("Session expired. Please log in again.");
    navigate("/login");
  }, [navigate]);

  const loadCreditsData = useCallback(async (forceRefresh = false, signal) => {
    if (!token) return;
    
    try {
      const url = forceRefresh 
        ? `${backendUrl}/api/user/credits?t=${Date.now()}`
        : `${backendUrl}/api/user/credits`;

      const response = await axios.get(url, {
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
        return response.data.credits;
      }
      throw new Error(response.data.message || "Failed to load user data");
    } catch (error) {
      if (axios.isCancel(error)) return;
      
      console.error("Error loading credits:", error);
      if (error.response?.status === 401) {
        handleSessionExpiry();
      }
      throw error;
    }
  }, [token, backendUrl, handleSessionExpiry]);

  const verifyPayment = useCallback(async (paymentResponse) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-payment`,
        paymentResponse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        const newCredits = await loadCreditsData(true);
        toast.success(`Payment verified! Added ${data.credits - newCredits} credits`);
        return true;
      }
      throw new Error(data.message || "Payment verification failed");
    } catch (error) {
      console.error('Payment verification error:', error);
      if (error.response?.data?.code === 'DUPLICATE_PAYMENT') {
        toast.info('Payment was already processed');
        return true;
      }
      toast.error(error.response?.data?.message || 'Payment verification failed');
      throw error;
    }
  }, [backendUrl, token, loadCreditsData]);

  const checkPendingPayments = useCallback(async () => {
    if (!token || isProcessingPayment) return;
    
    setIsProcessingPayment(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/transactions?status=created`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.transactions.length > 0) {
        toast.info('Verifying previous payments...');
        for (const transaction of response.data.transactions) {
          try {
            await verifyPayment({
              razorpay_order_id: transaction.orderId,
              razorpay_payment_id: transaction.paymentId,
              razorpay_signature: transaction.signature
            });
          } catch (e) {
            console.error('Failed to verify pending payment:', e);
          }
        }
        await loadCreditsData(true);
      }
    } catch (error) {
      console.error('Error checking pending payments:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  }, [token, backendUrl, isProcessingPayment, verifyPayment, loadCreditsData]);

  useEffect(() => {
    const controller = new AbortController();
    loadCreditsData(false, controller.signal);
    return () => controller.abort();
  }, [loadCreditsData]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      checkPendingPayments();
    } else {
      localStorage.removeItem("token");
    }
  }, [token, checkPendingPayments]);

  const generateImage = useCallback(async (prompt) => {
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
        await loadCreditsData(true);
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
  }, [backendUrl, token, loadCreditsData, navigate]);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }, [navigate]);

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
        verifyPayment,
        logout,
        generateImage,
        isProcessingPayment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };