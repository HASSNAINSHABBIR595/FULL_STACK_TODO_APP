import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const Protected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      console.log(
        "=== PROTECTED: token in localStorage ===",
        token ? "EXISTS ✅" : "MISSING ❌",
      );

      // Token hi nahi — seedha redirect
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
            // Railway cold start ke liye timeout thoda zyada
            timeout: 15000,
          },
        );

        console.log("=== AUTH/ME RESPONSE ===", res.data);

        if (res.data.success === true) {
          setIsAuth(true);
        } else {
          // success: false aaya — token invalid hai
          // Token sirf tab hataao jab server ne explicitly reject kiya
          // localStorage.removeItem("token");
          setIsAuth(false);
        }
      } catch (error) {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message || error.message;
        console.error("=== AUTH CHECK ERROR ===", { status, msg });

        if (status === 401) {
          // Server ne explicitly bola — invalid token, hataao
          console.log("401 received — removing token");
          localStorage.removeItem("token");
          setIsAuth(false);
        } else {
          // Network error, timeout, Railway cold start, 500, etc.
          // Token mat hataao — user ka data safe rakho
          // Token hai localStorage mein toh assume karo valid hai
          console.log("Network/server error — keeping token, allowing access");
          setIsAuth(true);
        }
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
