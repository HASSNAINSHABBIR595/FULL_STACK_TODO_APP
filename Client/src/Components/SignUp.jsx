import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// =======================
// COMPONENT: SIGN UP
// =======================
const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HandleSignUp = async () => {
    setError("");

    if (
      !userData.name.trim() ||
      !userData.email.trim() ||
      !userData.password.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://fullstacktodoapp-production-2b2e.up.railway.app/signup",
        userData,
        { withCredentials: true }, // Cookie receive karne ke liye
      );

      if (res.data.success) {
        // Token localStorage mein bhi store karo fallback ke liye
        localStorage.setItem("token", res.data.token);
        setUserData({ name: "", email: "", password: "" });
        navigate("/", { replace: true });
      } else {
        setError(res.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Server error. Please try again.";
      setError(msg);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") HandleSignUp();
  };

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="lg:w-120 w-11/12 max-w-md bg-zinc-300 rounded-2xl flex flex-col justify-start gap-8 p-10 items-center shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* NAME INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700">NAME</label>
            <input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Enter Your Name"
              className="bg-white w-full h-12 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* EMAIL INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-zinc-700">EMAIL</label>
            <input
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              type="email"
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
              placeholder="Enter Your Password (min 6 chars)"
              className="bg-white w-full h-12 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={HandleSignUp}
            disabled={loading}
            className="mt-2 bg-gray-800 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed w-full h-12 rounded-xl text-base font-semibold text-white transition-all"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        {/* LOGIN LINK */}
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            className="text-indigo-600 font-semibold hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
