import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ requiredRole }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    role: null,
    error: null
  });
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/auth-status", 
          {
            withCredentials: true,
            signal: controller.signal
          }
        );

        if (response.data.authenticated) {
          setAuthState({
            loading: false,
            role: response.data.user?.role,
            error: null
          });
        } else {
          setAuthState({
            loading: false,
            role: null,
            error: "Not authenticated"
          });
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setAuthState({
            loading: false,
            role: null,
            error: error.response?.data?.message || "Authentication failed"
          });
        }
      }
    };

    checkAuth();

    return () => controller.abort();
  }, [location]);

  if (authState.loading) {
    return <div className="auth-loading">Verifying authentication...</div>;
  }

  if (authState.error) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && authState.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;