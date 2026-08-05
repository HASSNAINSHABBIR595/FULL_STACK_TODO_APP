import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListChecks, PlusCircle, LogOut } from "lucide-react";
import axios from "axios";

// =======================
// COMPONENT: NAVBAR
// =======================
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = async () => {
    try {
      // Server se cookie clear karwao
      await axios.post(
        "https://fullstacktodoapp-production-2b2e.up.railway.app/logout",
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Chahe server error ho ya na ho — localStorage clear karo aur redirect karo
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  // =======================
  // NAVIGATION CONFIG
  // =======================
  const navItems = [
    { to: "/", label: "Home", icon: ListChecks },
    { to: "/add-task", label: "Add Task", icon: PlusCircle },
  ];

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="w-full sticky top-0 z-50">
      <div className="w-full flex items-center justify-between bg-gray-800 rounded-b-2xl px-6 py-4 shadow-lg shadow-black/20">
        {/* LOGO */}
        <div className="text-white font-bold text-lg tracking-wide">
          To Do <span className="text-zinc-400">App</span>
        </div>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gray-700 text-white shadow-md shadow-zinc-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}

          {/* LOGOUT BUTTON */}
          <li>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-red-600 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
