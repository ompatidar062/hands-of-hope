import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For redirection
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { sanitizeInput } from "../../utils/sanitizeInput";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validate";
import "./Auth.css";

const SignUp = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const [message, setMessage] = useState(""); // ✅ Success message

  const roles = [
    { id: "healthcare", label: "Healthcare Assistance" },
    { id: "learner", label: "Learner" },
    { id: "volunteer", label: "Volunteer" },
    { id: "donor", label: "Donor" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Allow spaces in name field, sanitize others normally
    const sanitizedValue = name === "name" ? value.replace(/[^A-Za-z\s]/g, "") : sanitizeInput(value);
  
    setFormData({ ...formData, [name]: sanitizedValue });
  
    // Validate field immediately
    let errorMessage = "";
    if (name === "name") errorMessage = validateName(sanitizedValue);
    if (name === "email") errorMessage = validateEmail(sanitizedValue);
    if (name === "password") errorMessage = validatePassword(sanitizedValue);
    if (name === "confirmPassword")
      errorMessage = validateConfirmPassword(formData.password, sanitizedValue);
  
    setErrors({ ...errors, [name]: errorMessage });
  };
  

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation on all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      role: formData.role ? "" : "Please select a role.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registration successful! Redirecting...");
        setTimeout(() => navigate("/signin"), 3000); // ✅ Redirect after 2s
      } else {
        setErrors({ apiError: data.message || "Something went wrong" });
      }
    } catch (error) {
      setErrors({ apiError: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Join Hands of Hope - Sign Up</h2>

        {message && <p className="success-text">{message}</p>}
        {errors.apiError && <p className="error-text">{errors.apiError}</p>}

        <label htmlFor="name">Full Name</label>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        {errors.name && <p className="error-text">{errors.name}</p>}

        <label htmlFor="email">Email</label>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

        <div className="role-selection">
          <p>Select Your Role:</p>
          <div className="roles">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`role-btn ${formData.role === role.id ? "selected" : ""}`}
                onClick={() => handleRoleSelect(role.id)}
                aria-label={`Select role ${role.label}`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
        {errors.role && <p className="error-text">{errors.role}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="signin-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
