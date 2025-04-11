import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../config/api";

const AdminProtected = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get("/users/me/");
        setIsAdmin(response.data.is_staff);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtected;
