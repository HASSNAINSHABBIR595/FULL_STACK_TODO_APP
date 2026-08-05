// =======================
// IMPORTS
// =======================
import express from "express";
import connection from "./db/db.js";
import Task from "./model/TaskSchema.js";
import Users from "./model/UserSchema.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dns from "dns";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =======================
// APP INITIALIZATION
// =======================
const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =======================
// CORS — trailing slash nahi, exact origins
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-todo-app-black-theta.vercel.app",
  "https://full-stack-todo-mv7f7r4ce-hassnainshabbir595s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman/curl allow
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS: Origin not allowed — " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

await connection();

// =======================
// JWT VERIFY MIDDLEWARE
// Priority: Authorization header > cookie
// (httpOnly cookie cross-site mein reliable nahi, header se lo)
// =======================
function VerifyJWTToken(req, res, next) {
  let token = null;

  // 1. Authorization header check karo (primary)
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback: cookie se lo
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No Token Provided — Please login first",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token — Please login again",
      });
    }
    req.user = decoded;
    next();
  });
}

// =======================
// AUTH ROUTES
// =======================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
    );

    // Cookie — same-site ke liye, cross-site ke liye header use hoga
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: token, // Frontend localStorage mein store karega
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token, // Frontend localStorage mein store karega
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// AUTH CHECK — token Authorization header se aayega
app.get("/auth/me", VerifyJWTToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// =======================
// TASK ROUTES
// =======================

// ADD TASK
app.post("/add-task", VerifyJWTToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const newTask = await Task.create({ title, description });
    res
      .status(201)
      .json({ success: true, message: "Task added", data: newTask });
  } catch (error) {
    console.error("Add task error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding task",
        error: error.message,
      });
  }
});

// GET ALL TASKS
app.get("/tasks", VerifyJWTToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching tasks",
        error: error.message,
      });
  }
});

// GET SINGLE TASK
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Fetch single task error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching task",
        error: error.message,
      });
  }
});

// UPDATE TASK
app.put("/update-task/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res
      .status(200)
      .json({ success: true, message: "Task updated", data: updated });
  } catch (error) {
    console.error("Update task error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating task",
        error: error.message,
      });
  }
});

// DELETE SINGLE TASK
app.delete("/delete-task/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting task",
        error: error.message,
      });
  }
});

// DELETE MULTIPLE TASKS
app.delete("/multipleDelete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No IDs provided" });
    }
    await Task.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json({ success: true, message: `${ids.length} tasks deleted` });
  } catch (err) {
    console.error("Multiple delete error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting tasks",
        error: err.message,
      });
  }
});

// DELETE ALL TASKS
app.delete("/delete-all", async (req, res) => {
  try {
    await Task.deleteMany({});
    res.status(200).json({ success: true, message: "All tasks deleted" });
  } catch (error) {
    console.error("Delete all error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting all tasks",
        error: error.message,
      });
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
