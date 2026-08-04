// import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const Protected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    console.log("useEffect running");
    const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    const res = await axios.get(
      "https://fullstacktodoapp-production-2b2e.up.railway.app/auth/me",
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setIsAuth(true);
    }
  } catch (error) {
    setIsAuth(false);
  } finally {
    setLoading(false);
  }
};
    checkAuth();
  }, []);

  // ⏳ jab tak check ho raha hai
  if (loading) return <h2>Checking auth...</h2>;

  // ❌ agar check ke baad bhi false
  if (!isAuth) return <Navigate to="/login" />;

  // ✅ allowed
  return children;
};

export default Protected;
