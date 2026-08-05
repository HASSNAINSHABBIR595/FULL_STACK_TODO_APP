import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "https://fullstacktodoapp-production-2b2e.up.railway.app";

// Har call ke waqt fresh token lo
const getApi = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// =======================
// COMPONENT: LIST
// =======================
const List = () => {
  const [selectedTask, setSelectedTask] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [fetchError, setFetchError] = useState("");

  // =======================
  // FETCH ALL TASKS
  // =======================
  const getListData = async () => {
    try {
      setFetchError("");
      const api = getApi();
      const res = await api.get("/tasks");
      setTaskData(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load tasks";
      setFetchError(msg);
      console.error("Fetch tasks error:", error);
    }
  };

  // =======================
  // DELETE ALL TASKS
  // =======================
  const deleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL tasks?")) return;
    try {
      const api = getApi();
      await api.delete("/delete-all");
      getListData();
    } catch (error) {
      console.error("Delete all error:", error);
      alert(error.response?.data?.message || "Failed to delete all tasks");
    }
  };

  // =======================
  // DELETE SINGLE TASK
  // =======================
  const deleteTaskById = async (id) => {
    try {
      const api = getApi();
      await api.delete(`/delete-task/${id}`);
      getListData();
    } catch (error) {
      console.error("Delete task error:", error);
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  // =======================
  // SELECT ALL TASKS
  // =======================
  const selectAll = (event) => {
    if (event.target.checked) {
      setSelectedTask(taskData.map((item) => item._id));
    } else {
      setSelectedTask([]);
    }
  };

  // =======================
  // SELECT SINGLE TASK
  // =======================
  const selectSingleItem = (id) => {
    setSelectedTask((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // =======================
  // DELETE MULTIPLE TASKS
  // =======================
  const deleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedTask.length} selected task(s)?`))
      return;
    try {
      const api = getApi();
      await api.delete("/multipleDelete", {
        data: { ids: selectedTask },
      });
      setTimeout(() => {
        getListData();
        setSelectedTask([]);
      }, 40);
    } catch (error) {
      console.error("Multiple delete error:", error);
      alert(error.response?.data?.message || "Failed to delete selected tasks");
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="flex flex-col items-center gap-6 justify-center p-4">
      {/* ERROR MESSAGE */}
      {fetchError && (
        <div className="w-full max-w-5xl bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          ❌ {fetchError}
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className="w-full max-w-5xl bg-zinc-100 rounded-xl shadow-2xl shadow-zinc-400 border border-zinc-200 overflow-hidden mt-5">
        <div className="overflow-x-auto w-full">
          <div className="min-w-175 p-5">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[50px_60px_1fr_2fr_80px] gap-3 font-sans mb-3 items-center">
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl flex justify-center items-center">
                <input
                  type="checkbox"
                  onChange={selectAll}
                  checked={
                    selectedTask.length === taskData.length &&
                    taskData.length > 0
                  }
                  className="w-4 h-4 cursor-pointer accent-indigo-600"
                />
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-center text-sm font-semibold">
                S.No
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-sm font-semibold">
                Title
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-sm font-semibold">
                Description
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-center text-sm font-semibold">
                Actions
              </div>
            </div>

            {/* TABLE BODY */}
            <div className="flex flex-col gap-3">
              {taskData && taskData.length > 0 ? (
                taskData.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="grid grid-cols-[50px_60px_1fr_2fr_80px] gap-3 items-center font-sans"
                  >
                    {/* Checkbox */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl flex justify-center items-center">
                      <input
                        type="checkbox"
                        onChange={() => selectSingleItem(item._id)}
                        checked={selectedTask.includes(item._id)}
                        className="w-4 h-4 cursor-pointer accent-indigo-600"
                      />
                    </div>

                    {/* Index */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl text-center text-sm">
                      {index + 1}
                    </div>

                    {/* Title */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl truncate text-sm">
                      {item.title}
                    </div>

                    {/* Description */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl whitespace-normal max-h-28 overflow-y-auto text-sm">
                      {item.description}
                    </div>

                    {/* Actions */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl flex gap-3 items-center justify-center">
                      <span
                        onClick={() => deleteTaskById(item._id)}
                        className="p-1 rounded hover:bg-red-500 hover:scale-110 cursor-pointer group transition-all"
                        title="Delete task"
                      >
                        <Trash2
                          size={18}
                          className="text-red-500 group-hover:text-white"
                        />
                      </span>
                      <span
                        className="p-1 rounded hover:bg-blue-500 hover:scale-110 cursor-pointer group transition-all"
                        title="Edit task"
                      >
                        <Link to={`/update-task/${item._id}`}>
                          <SquarePen
                            size={18}
                            className="text-blue-500 group-hover:text-white"
                          />
                        </Link>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-zinc-500 font-medium">
                  {fetchError
                    ? "Could not load tasks."
                    : "No tasks yet. Add your first task!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BULK DELETE BUTTON */}
      {selectedTask.length > 0 && (
        <button
          onClick={deleteSelected}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl text-white text-base font-semibold hover:scale-105 active:scale-95 shadow-lg transition-all"
        >
          Delete Selected ({selectedTask.length})
        </button>
      )}

      {/* CLEAR ALL BUTTON */}
      {taskData.length > 0 && (
        <button
          onClick={deleteAll}
          className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-2xl text-white text-base font-semibold hover:scale-105 active:scale-95 shadow-lg transition-all"
        >
          Clear All Tasks
        </button>
      )}
    </div>
  );
};

export default List;
