import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const Protected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  // Ref se ensure karo — sirf ek baar check ho, loop na bane
  const checked = useRef(false);

  useEffect(() => {
    // Already checked? Skip karo — strict mode double-invoke se bachao
    if (checked.current) return;
    checked.current = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // Token hi nahi hai localStorage mein? Direct redirect
      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://fullstacktodoapp-production-2b2e.up.railway.app/auth/me",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsAuth(res.data.success === true);
      } catch (error) {
        console.error(
          "Auth check failed:",
          error?.response?.data?.message || error.message,
        );
        // 401 aaye to token expire/invalid — clear karo
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default Protected;
