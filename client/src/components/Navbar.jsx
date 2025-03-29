import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await axios.get("http://localhost:5000/api/users/auth-status", {
        withCredentials: true,
      });

      if (response.data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: response.data.user || null,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.response?.data?.message || "Authentication check failed"
      });
    }
  }, []);

  // Run authentication check when route changes
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await axios.post("http://localhost:5000/api/users/logout", {}, { 
        withCredentials: true 
      });

      // Clear all client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Reset auth state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null
      });

      // Redirect to signin
      navigate("/signin", { replace: true });

    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear everything on error
      localStorage.clear();
      sessionStorage.clear();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.response?.data?.message || "Logout failed"
      });
      navigate("/signin", { replace: true });
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Get dashboard path or redirect to signin for invalid roles
  const handleDashboardClick = (e) => {
    if (!authState.isAuthenticated || !authState.user?.role) {
      e.preventDefault();
      navigate("/signin", { replace: true });
      return;
    }

    const validRoles = ["healthcare", "learner", "volunteer", "donor"];
    if (!validRoles.includes(authState.user.role)) {
      e.preventDefault();
      navigate("/signin", { replace: true });
      return;
    }

    // Proceed with normal navigation for valid roles
    toggleMenu();
  };

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    if (!authState.user?.role) return "/signin";
    switch(authState.user.role) {
      case "healthcare": return "/dashboard/healthcare";
      case "learner": return "/dashboard/education";
      case "volunteer": return "/dashboard/volunteer";
      case "donor": return "/dashboard/donor";
      default: return "/signin";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Project Name */}
        <div className="nav-left">
          <Link to="/" className="navbar-brand">
            <h2>Hands of Hope</h2>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Center: Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link 
              to="/" 
              onClick={toggleMenu} 
              className={location.pathname === "/" ? "active" : ""}
              aria-current={location.pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to={getDashboardPath()} 
              onClick={handleDashboardClick}
              className={location.pathname.startsWith("/dashboard") ? "active" : ""}
              aria-current={location.pathname.startsWith("/dashboard") ? "page" : undefined}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Right: Authentication Section */}
        <div className="auth-section">
          {authState.isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                <FaUser className="user-icon" />
                {authState.user?.name || "User"}
              </span>
              <button 
                className="logout-btn" 
                onClick={handleLogout}
                disabled={authState.isLoading}
              >
                <FaSignOutAlt /> {authState.isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <Link to="/signin" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
      
      {/* Error notification */}
      {authState.error && (
        <div className="navbar-error">
          {authState.error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;