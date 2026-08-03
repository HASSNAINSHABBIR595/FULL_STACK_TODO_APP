// =======================
// IMPORTS
// =======================
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AddTask from "./Components/AddTask";
import List from "./Components/List";
import UpdateTask from "./Components/UpdateTask";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Protected from "./Components/Protected";

// =======================
// COMPONENT: APP (ROOT)
// =======================
const App = () => {
  const IsLoggedIn = localStorage.getItem("IsLoggedIn");
  console.log(IsLoggedIn);

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="flex flex-col h-screen transition-all">
      {/* =======================
          NAVBAR (GLOBAL)
      ======================= */}

      {/* =======================
          ROUTES CONFIGURATION
      ======================= */}
      <Routes>
        {/* =======================
            AUTH ROUTES
        ======================= */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* =======================
            TASK ROUTES
        ======================= */}
        <Route
          path="/"
          element={
            <Protected>
              <Navbar />
              <List />
            </Protected>
          }
        />
        <Route
          path="/add-task"
          element={
            <Protected>
              <Navbar />

              <AddTask />
            </Protected>
          }
        />
        <Route
          path="/update-task/:id"
          element={
            <Protected>
              <Navbar />

              <UpdateTask />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
