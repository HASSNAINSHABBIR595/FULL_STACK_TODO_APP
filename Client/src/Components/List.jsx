// =======================
// IMPORTS
// =======================
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// =======================
// COMPONENT: LIST
// =======================
const List = () => {
  // =======================
  // STATE MANAGEMENT
  // =======================
  const [selectedTask, setSelectedTask] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const api = axios.create({
    baseURL: "https://fullstacktodoapp-production-2b2e.up.railway.app",
    withCredentials: true,
  });
  // =======================
  // FETCH ALL TASKS
  // =======================
  const getListData = async () => {
    try {
      const list = await api.get("/tasks");
      setTaskData(list.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // =======================
  // DELETE ALL TASKS
  // =======================
  const deleteAll = async () => {
    try {
      await api.delete("/delete-all");
      getListData();
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    }
  };

  // =======================
  // DELETE SINGLE TASK
  // =======================
  const deleteTaskById = async (id) => {
    try {
      await api.delete(`/delete-task/${id}`);
      getListData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // =======================
  // SELECT ALL TASKS
  // =======================
  const selectAll = (event) => {
    if (event.target.checked) {
      let items = taskData.map((item) => item._id);
      setSelectedTask(items);
    } else {
      setSelectedTask([]);
    }
  };

  // =======================
  // SELECT SINGLE TASK
  // =======================
  const selectSingleItem = (id) => {
    setSelectedTask((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // =======================
  // DELETE MULTIPLE TASKS
  // =======================
  const DeleteSelected = async () => {
    await api.delete("/multipleDelete", {
      data: { ids: selectedTask },
    });

    // Small delay before refreshing list
    setTimeout(() => {
      getListData();
      setSelectedTask([]);
    }, 40);
  };

  // =======================
  // EFFECTS
  // =======================

  // Fetch tasks (⚠️ note: dependency issue here)
  useEffect(() => {
    getListData();
  }, []);

  // Debug selected items
  useEffect(() => {
    console.log(selectedTask);
  }, [selectedTask]);

  // =======================
  // UI RENDER
  // =======================
  return (
    <div className="flex flex-col items-center gap-10 justify-center p-4 ">
      {/* =======================
          TABLE CONTAINER
      ======================= */}
      <div className="w-full max-w-5xl bg-zinc-100 rounded-xl shadow-2xl shadow-zinc-400 border border-zinc-200 overflow-hidden mt-5">
        <div className="overflow-x-auto w-full">
          <div className="min-w-175 p-5">
            {/* =======================
                TABLE HEADER
            ======================= */}
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
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-center">
                S.No
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl">
                Title
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl">
                Description
              </div>
              <div className="p-2.5 border border-zinc-300 bg-zinc-200 rounded-xl text-center">
                Actions
              </div>
            </div>

            {/* =======================
                TABLE BODY
            ======================= */}
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
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl text-center">
                      {index + 1}
                    </div>

                    {/* Title */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl truncate">
                      {item.title}
                    </div>

                    {/* Description */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl whitespace-normal max-h-28 overflow-y-auto">
                      {item.description}
                    </div>

                    {/* Actions */}
                    <div className="p-2.5 border border-zinc-200 bg-zinc-50 rounded-xl flex gap-3 items-center justify-center">
                      {/* Delete */}
                      <span
                        onClick={() => deleteTaskById(item._id)}
                        className="p-1 rounded hover:bg-red-500 hover:scale-110 cursor-pointer group"
                      >
                        <Trash2
                          size={18}
                          className="text-red-500 group-hover:text-white"
                        />
                      </span>

                      {/* Edit */}
                      <span className="p-1 rounded hover:bg-blue-500 hover:scale-110 cursor-pointer group">
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
                <div className="text-center py-6 text-zinc-500 font-medium">
                  No tasks found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          BULK DELETE BUTTON
      ======================= */}
      <div>
        {selectedTask.length > 0 && (
          <button
            onClick={DeleteSelected}
            className="bg-red-500 px-4 py-4 rounded-2xl text-white text-lg font-medium hover:scale-105 active:scale-95 shadow-lg"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* =======================
          CLEAR ALL BUTTON
      ======================= */}
      <button
        onClick={deleteAll}
        className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-2xl text-white text-lg font-medium hover:scale-105 active:scale-95 shadow-lg"
      >
        CLEAR ALL
      </button>
    </div>
  );
};

export default List;
