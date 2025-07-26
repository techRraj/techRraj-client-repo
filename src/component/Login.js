import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import profile_icon from "../image/profile_icon.png";
import locicon from "../image/lock_icon.svg";
import email_icon from "../image/email_icon.svg";
import cross_icon from "../image/cross_icon.svg";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser, loadCreditsData } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = state === "Login" ? "/api/user/login" : "/api/user/register";
      const payload = state === "Login" ? { email, password } : { name, email, password };

      // Construct the full URL
      const fullUrl = `${backendUrl}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
      console.log("API Request:", fullUrl, payload);

      const { data } = await axios.post(fullUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        await loadCreditsData();
        setShowLogin(false);
        toast.success(state === "Login" ? "Login successful!" : "Registration successful!");
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      
      let errorMsg = "Network error. Please try again.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMsg = "API endpoint not found. Please contact support.";
        } else if (error.response.status === 400) {
          errorMsg = error.response.data?.message || "Invalid credentials";
        } else if (error.response.status === 405) {
          errorMsg = "Method not allowed. Please refresh and try again.";
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmitHandler} className="login-form">
        <h1 className="login-lg">{state}</h1>
        <p className="login-txt">Welcome back! Please sign in to continue</p>

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

        <div className="login-psw">
          <img src={locicon} alt="Lock" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            minLength="8"
          />
        </div>

        <button 
          className="login-create" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : (state === "Login" ? "Login" : "Create Account")}
        </button>

        {state === "Login" ? (
          <p className="login-reg">
            Don't have an account?{" "}
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