import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import profile_icon from "../image/profile_icon.png";
import locicon from "../image/lock_icon.svg";
import email_icon from "../image/email_icon.svg";
import cross_icon from "../image/cross_icon.svg";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Ensure no trailing or leading slashes in URL
      const trimmedBackendUrl = backendUrl?.trim().replace(/\/+$/, "");
      const url = state === "Login" ? "/api/user/login" : "/api/user/register";
      const fullUrl = `${trimmedBackendUrl}${url}`;

      console.log("Sending request to:", fullUrl); // Debugging

      const payload =
        state === "Login"
          ? { email, password }
          : { name, email, password };

      const { data } = await axios.post(fullUrl, payload);

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        alert(data.message || "Success!");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Auth error:", error);
      let errorMessage = "Network error. Try again.";

      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMessage = error.response.data.message || error.response.statusText;
      } else if (error.request) {
        // No response received
        errorMessage = "Request failed. Please check your internet connection.";
      } else {
        // Something went wrong while setting up the request
        errorMessage = error.message;
      }

      alert(errorMessage);
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
            required
          />
        </div>

        <p className="login-forget">Forgot password?</p>
        <button className="login-create" type="submit">
          {state === "Login" ? "Login" : "Create Account"}
        </button>

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