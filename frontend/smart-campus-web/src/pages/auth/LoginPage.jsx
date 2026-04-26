import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { getUserRole } from "../../utils/jwtUtils";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      const response = await login(credentials);

      // authService returns response.data directly
      // token is already saved in authService, extract role here
      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;

      const role =
        response?.role ||
        response?.data?.role ||
        response?.user?.role ||
        response?.data?.user?.role;

      if (!token) {
        throw new Error("Login succeeded but token was not returned.");
      }

      if (!role) {
        throw new Error("Login succeeded but role was not returned.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setSuccessMessage("Login Success");

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "TECHNICIAN") {
          navigate("/technician/tickets");
        } else {
          navigate("/user/resources");
        }
      }, 1500);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Properly extract message from back-end
      const errorMessage = error.response?.data?.message || 
                         (typeof error.response?.data === 'string' ? error.response.data : null) ||
                         error.message ||
                         "Invalid email or password. Please try again.";
                         
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please enter your details to sign in</p>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {serverError && <div className="server-error-message">{serverError}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button className="google-button" onClick={handleGoogleLogin} disabled={isLoading}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="register-prompt">
          Not a member? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
