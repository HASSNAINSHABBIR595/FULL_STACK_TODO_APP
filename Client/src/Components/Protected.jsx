import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

// =======================
// COMPONENT: PROTECTED ROUTE
// =======================
const Protected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cookie automatically jaayegi withCredentials: true se
        // Token bhi header mein bhej rahe hain fallback ke liye
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://fullstacktodoapp-production-2b2e.up.railway.app/auth/me",
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (res.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        // 401 ya koi bhi error aaye — unauthorized samjho
        console.error(
          "Auth check failed:",
          error?.response?.data?.message || error.message,
        );
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuth) return <Navigate to="/login" replace />;

  // Authenticated
  return children;
};

export default Protected;
