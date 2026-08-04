// =======================
// IMPORTS
// =======================

// import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, PlusCircle } from "lucide-react";

// =======================
// COMPONENT: ADD TASK
// =======================

const AddTask = () => {
  // =======================
  // NAVIGATION
  // =======================

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // =======================
  // API CONFIGURATION
  // =======================

  const api = axios.create({
    baseURL: "https://fullstacktodoapp-production-2b2e.up.railway.app",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // =======================
  // STATE MANAGEMENT
  // =======================

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  // Destructuring state values
  const { title, description } = taskData;

  // =======================
  // HANDLERS
  // =======================

  const handleAddTask = async () => {
    // =======================
    // VALIDATION
    // =======================

    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return; // ⛔ stop execution
    }

    try {
      // =======================
      // API CALL: CREATE TASK
      // =======================

      await api.post("/add-task", {
        title: title,
        description: description,
      });
      // =======================
      // RESET STATE
      // =======================

      setTaskData({ title: "", description: "" });

      // =======================
      // REDIRECT TO HOME
      // =======================

      navigate("/");
    } catch (error) {
      // =======================
      // ERROR HANDLING
      // =======================

      console.log(error);
    }
  };

  // =======================
  // UI RENDER
  // =======================

  return (
    // =======================
    // MAIN CONTAINER
    // =======================

    <div className="w-full flex justify-center px-4 pb-10">
      {/* =======================
          CARD CONTAINER
      ======================= */}
      <div
        className="w-full max-w-md bg-white rounded-2xl mt-8 p-6
        flex flex-col gap-5 shadow-xl shadow-black/30 h-fit"
      >
        {/* =======================
            HEADER
        ======================= */}
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gray-800 p-2 rounded-xl">
            <ClipboardList className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">New Task</h1>
        </div>

        {/* =======================
            TITLE INPUT
        ======================= */}
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

        {/* =======================
            DESCRIPTION INPUT
        ======================= */}
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
            placeholder="enter Task description here"
            value={description}
          ></textarea>
        </div>

        {/* =======================
            SUBMIT BUTTON
        ======================= */}
        <button
          onClick={handleAddTask}
          className="bg-gray-800 hover:bg-gray-700 active:scale-[0.98] transition-all px-6 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 mt-2"
        >
          <PlusCircle size={18} />
          Add New Task
        </button>
      </div>
    </div>
  );
};

// =======================
// EXPORT COMPONENT
// =======================

export default AddTask;
