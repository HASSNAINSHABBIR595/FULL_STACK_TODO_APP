// =======================
// IMPORTS
// =======================
import { Link, useLocation } from "react-router-dom";
import { ListChecks, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// =======================
// COMPONENT: NAVBAR
// =======================
const Navbar = () => {
  const navigate = useNavigate();
  function LogOut() {
    axios
      .post("https://fullstacktodoapp-production-2b2e.up.railway.app/logout", {
        withCredentials: true,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  }
  // =======================
  // HOOKS
  // =======================
  const location = useLocation();

  // =======================
  // NAVIGATION CONFIG
  // =======================
  const navItems = [
    { to: "/", label: "HOME", icon: ListChecks },
    { to: "/add-task", label: "Add Task", icon: PlusCircle },
  ];

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="w-full sticky top-0 z-50">
      {/* =======================
          NAVBAR CONTAINER
      ======================= */}
      <div className="w-full flex items-center justify-between bg-gray-800 rounded-b-2xl px-6 py-4 shadow-lg shadow-black/20">
        {/* =======================
            LOGO / TITLE
        ======================= */}
        <div className="text-white font-bold text-lg tracking-wide">
          To Do <span className="text-zinc-400">App</span>
        </div>

        {/* =======================
            NAVIGATION LINKS
        ======================= */}
        <ul className="flex items-center gap-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            // =======================
            // ACTIVE ROUTE CHECK
            // =======================
            const isActive = location.pathname === to;

            return (
              <li key={to}>
                <Link
                  to={to}
                  // =======================
                  // DYNAMIC STYLING
                  // =======================
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gray-700 hover:bg-gray-700 active:scale-[0.98] text-white shadow-md shadow-zinc-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {/* Icon */}
                  <Icon size={16} />

                  {/* Label (hidden on small screens) */}
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
          <button
            onClick={LogOut}
            className="text-white gap-1.5 px-3 py-2  hover:bg-gray-700  rounded-xl text-sm font-semibold transition-all duration-200 "
          >
            Log out
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
