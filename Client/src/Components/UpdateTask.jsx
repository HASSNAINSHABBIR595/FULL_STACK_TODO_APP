import { ClipboardList, FileText, Save } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://fullstacktodoapp-production-2b2e.up.railway.app";

// =======================
// COMPONENT: UPDATE TASK
// =======================
const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { title, description } = taskData;

  // =======================
  // FETCH EXISTING TASK DATA
  // (Sirf GET — no PUT here)
  // =======================
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/tasks/${id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const { title, description } = res.data;
        setTaskData({ title: title || "", description: description || "" });
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load task data";
        setFetchError(msg);
        console.error("Fetch task error:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchTask();
  }, [id]);

  // =======================
  // UPDATE TASK HANDLER
  // =======================
  const handleUpdateTask = async () => {
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in both title and description");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/update-task/${id}`,
        { title, description },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to update task. Please try again.";
      setError(msg);
      console.error("Update task error:", err);
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
          <h1 className="text-xl font-bold text-gray-800">Update Task</h1>
        </div>

        {/* FETCH ERROR */}
        {fetchError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
            ❌ {fetchError}
          </div>
        )}

        {/* SUBMIT ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {fetching ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">
            Loading task data...
          </div>
        ) : (
          <>
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

            {/* UPDATE BUTTON */}
            <button
              onClick={handleUpdateTask}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all px-6 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 mt-2"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Update Task"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateTask;
