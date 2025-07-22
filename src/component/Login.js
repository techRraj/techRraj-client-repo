// src/components/Login.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import profile_icon from "../image/profile_icon.png";
import locicon from "../image/lock_icon.svg";
import email_icon from "../image/email_icon.svg";
import cross_icon from "../image/cross_icon.svg";
import { toast } from "react-toastify"; // ✅ Add missing import

const Login = () => {
  const [state, setState] = useState("Login");
  const { 
    setShowLogin, 
    backendUrl, 
    setToken, 
    setUser, 
    loadCreditsData 
  } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const url = state === "Login" ? "/api/user/login" : "/api/user/register";
      const payload = state === "Login" ? { email, password } : { name, email, password };

      // ✅ Clean URL: Ensure no extra spaces or double slashes
      const fullUrl = `${backendUrl}${url}`.replace(/\s+/g, "").replace(/\/+/g, "/");
      
      console.log("Request URL:", fullUrl); // Debug log

      const { data } = await axios.post(fullUrl, payload);

      if (data.success) {
        // ✅ Save token and user
        setToken(data.token);
        setUser(data.user);

        // ✅ Load fresh credit balance from server
        await loadCreditsData();

        // ✅ Close modal
        setShowLogin(false);

        // ✅ Show success toast
        toast.success("Login successful!");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Auth error:", error);

      let errorMsg = "Network error. Try again.";

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMsg = "API endpoint not found. Check backend URL.";
            break;
          case 400:
            errorMsg = error.response.data.message || "Invalid credentials";
            break;
          case 500:
            errorMsg = "Server error. Please try later.";
            break;
          default:
            errorMsg = error.response.data.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg = "No response from server. Is backend running?";
      }

      alert(errorMsg);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmitHandler} className="login-form">
        <h1 className="login-lg">{state}</h1>
        <p className="login-txt">Welcome back! Please sign in to continue</p>

        {/* Registration: Full Name */}
        {state !== "Login" && (
          <div className="login-name">
            <img src={profile_icon} alt="Profile" width={20} />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div className="login-email">
          <img src={email_icon} alt="Email" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Id"
            required
          />
        </div>

        {/* Password Field */}
        <div className="login-psw">
          <img src={locicon} alt="Lock" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </div>

        <p className="login-forget">Forgot password?</p>

        {/* Submit Button */}
        <button className="login-create" type="submit">
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {/* Sign Up / Already have account */}
        {state === "Login" ? (
          <p className="login-reg">
            Don’t have an account?{" "}
            <span className="login-yellow" onClick={() => setState("Sign Up")}>
              Sign up
            </span>
          </p>
        ) : (
          <p className="login-already">
            Already have an account?{" "}
            <span className="login-yellow" onClick={() => setState("Login")}>
              Login
            </span>
          </p>
        )}

        {/* Close Modal */}
        <img
          onClick={() => setShowLogin(false)}
          src={cross_icon}
          alt="Close"
          className="login-cancel"
        />
      </form>
    </div>
  );
};

export default Login;