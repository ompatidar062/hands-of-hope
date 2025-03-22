import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { sanitizeInput } from "../../utils/sanitizeInput";
import { validateEmail, validatePassword } from "../../utils/validate";
import "./Auth.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData({ ...formData, [name]: sanitizedValue });

    let errorMessage = "";
    if (name === "email") errorMessage = validateEmail(sanitizedValue);
    if (name === "password") errorMessage = validatePassword(sanitizedValue);
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((error) => error)) return;
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include cookies in the request
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("✅ Login successful! Redirecting...");
        const role = data.user?.role;
        console.log(role)
  
        if (role) {
          setTimeout(() => {
            if (role === "healthcare") navigate("/dashboard/healthcare");
            else if (role === "learner") navigate("/dashboard/education");
            else if (role === "volunteer") navigate("/dashboard/volunteer");
            else if (role === "donor") navigate("/dashboard/donor");
            else navigate("/");
          }, 2000);
        } else {
          setErrors({ apiError: "User role not found. Please try again." });
        }
      } else {
        setErrors({ apiError: data.message || "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ apiError: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back to Hands of Hope - Sign In</h2>

        {message && <p className="success-text">{message}</p>}
        {errors.apiError && <p className="error-text">{errors.apiError}</p>}

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <p className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        <button type="submit" className="submit-btn" disabled={loading}>
          <FaSignInAlt className="btn-icon" />
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="signin-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
