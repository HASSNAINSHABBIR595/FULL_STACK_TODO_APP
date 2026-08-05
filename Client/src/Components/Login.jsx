import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// =======================
// COMPONENT: LOGIN
// =======================
const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Agar pehle se logged in hai toh redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  const HandleLogin = async () => {
    setError("");

    if (!userData.email.trim() || !userData.password.trim()) {
      setError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://fullstacktodoapp-production-2b2e.up.railway.app/login",
        userData,
        { withCredentials: true }, // Cookie receive karne ke liye zaroori
      );

      if (res.data.success) {
        // Token localStorage mein store karo (Authorization header fallback ke liye)
        localStorage.setItem("token", res.data.token);
        setUserData({ email: "", password: "" });
        navigate("/", { replace: true });
      } else {
        setError(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Server error. Please try again.";
      setError(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enter key se bhi login ho
  const handleKeyDown = (e) => {
    if (e.key === "Enter") HandleLogin();
  };

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="lg:w-120 w-11/12 max-w-md bg-zinc-300 rounded-2xl flex flex-col justify-start gap-8 p-10 items-center shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* EMAIL INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700">EMAIL</label>
            <input
              value={userData.email}
              type="email"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="Enter Your Email"
              className="bg-white w-full h-12 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700">
              PASSWORD
            </label>
            <input
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              onKeyDown={handleKeyDown}
              type="password"
              placeholder="Enter Your Password"
              className="bg-white w-full h-12 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={HandleLogin}
            disabled={loading}
            className="mt-2 bg-gray-800 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed w-full h-12 rounded-xl text-base font-semibold text-white transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* SIGNUP LINK */}
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            className="text-indigo-600 font-semibold hover:underline"
            to="/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
