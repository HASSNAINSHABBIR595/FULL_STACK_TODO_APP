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
      console.log("checkAuth...");

      try {
        console.log("Protected mounted");
        const res = await axios.get("http://localhost:3200/auth/me", {
          withCredentials: true,
        });
        console.log("api response:", res);

        if (res.data.success) {
          console.log("success true");
          setIsAuth(true);
        }
      } catch (error) {
        console.log(error);
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
