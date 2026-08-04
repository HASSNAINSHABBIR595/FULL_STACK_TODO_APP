// =======================
// IMPORTS
// =======================

// import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// =======================
// COMPONENT: LOGIN
// =======================

const Login = () => {
  // =======================
  // STATE MANAGEMENT
  // =======================

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const HandleLogin = async () => {
    try {
      let res = await axios.post(
        "https://fullstacktodoapp-production-2b2e.up.railway.app/login",
        userData,
        { withCredentials: true },
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }

      setUserData({ email: "", password: "" });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/");
    }
  }, []);
  // =======================
  // UI RENDER
  // =======================

  return (
    // =======================
    // MAIN CONTAINER
    // =======================

    <div className="flex justify-center items-center h-screen">
      {/* =======================
          CARD CONTAINER
      ======================= */}
      <div className="lg:w-120 w-1/2 h-130 bg-zinc-300 rounded-2xl flex flex-col justify-start gap-20 p-10 items-center">
        {/* =======================
            FORM SECTION
        ======================= */}
        <div>
          {/* =======================
              EMAIL INPUT
          ======================= */}
          <label className="text-xl font-medium text-zinc-700">EMAIL</label>
          <input
            value={userData.email}
            type="email"
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
            }}
            placeholder="Enter Your Email"
            className="bg-white w-full h-15 px-10 my-2 rounded-2xl outline-zinc-400"
          />

          {/* =======================
              PASSWORD INPUT
          ======================= */}
          <label className="text-xl font-medium text-zinc-700">PASSWORD</label>
          <input
            value={userData.password}
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value });
            }}
            type="password"
            placeholder="Enter Your Password"
            className="bg-white w-full h-15 px-10 my-2 rounded-2xl outline-zinc-400"
          />

          {/* =======================
              LOGIN BUTTON
          ======================= */}
          <button
            onClick={HandleLogin}
            className="mt-10 bg-gray-800 hover:bg-gray-700 active:scale-[0.98] w-full h-15 rounded-2xl outline-zinc-300 text-xl text-white"
          >
            Login
          </button>
        </div>

        {/* =======================
            NAVIGATION LINK
        ======================= */}
        <Link
          className="mt-10 text-lg text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-xl"
          to="/signup"
        >
          SignUp
        </Link>
      </div>
    </div>
  );
};

// =======================
// EXPORT COMPONENT
// =======================

export default Login;
