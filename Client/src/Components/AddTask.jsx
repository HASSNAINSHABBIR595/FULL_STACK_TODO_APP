import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, PlusCircle } from "lucide-react";

// =======================
// AXIOS INSTANCE FACTORY
// Har render pe fresh token lo
// =======================
const createApi = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: "https://fullstacktodoapp-production-2b2e.up.railway.app",
    withCredentials: true, // Cookie bhi saath jaayegi
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// =======================
// COMPONENT: ADD TASK
// =======================
const AddTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { title, description } = taskData;

  const handleAddTask = async () => {
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in both title and description");
      return;
    }

    setLoading(true);
    try {
      const api = createApi();
      await api.post("/add-task", { title, description });
      setTaskData({ title: "", description: "" });
      navigate("/");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to add task. Please try again.";
      setError(msg);
      console.error("Add task error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="w-full flex justify-center px-4 pb-10">
      <div className="w-full max-w-md bg-white rounded-2xl mt-8 p-6 flex flex-col gap-5 shadow-xl shadow-black/30 h-fit">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gray-800 p-2 rounded-xl">
            <ClipboardList className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">New Task</h1>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* TITLE INPUT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
            <ClipboardList size={14} />
            Title
          </label>
          <input
            className="w-full bg-gray-100 py-2.5 px-4 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            type="text"
            name="title"
            onChange={(e) =>
              setTaskData({ ...taskData, title: e.target.value })
            }
            value={title}
            placeholder="Enter Task Title"
          />
        </div>

        {/* DESCRIPTION INPUT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
            <FileText size={14} />
            Description
          </label>
          <textarea
            className="w-full h-40 bg-gray-100 py-2.5 px-4 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 transition-all resize-none"
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
            name="description"
            placeholder="Enter task description here"
            value={description}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleAddTask}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all px-6 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 mt-2"
        >
          <PlusCircle size={18} />
          {loading ? "Adding..." : "Add New Task"}
        </button>
      </div>
    </div>
  );
};

export default AddTask;
