import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/user", {
          credentials: "include", // ✅ Include cookies
        });

        const data = await response.json();
        if (response.ok) {
          setUserRole(data.role); // ✅ Get user role from backend
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return userRole === requiredRole ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
