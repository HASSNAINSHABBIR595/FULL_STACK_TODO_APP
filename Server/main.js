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
dotenv.config();
app.use(
  cors({
    origin: [
      "https://full-stack-todo-app-black-theta.vercel.app",
      "https://full-stack-todo-mv7f7r4ce-hassnainshabbir595s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
await connection();

// =======================
// AUTH ROUTES
// =======================

// SIGNUP USER
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.send({
        success: false,
        message: "Email and password required",
      });
    }

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists",
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.send({
      success: true,
      message: "Sign up done",
      token: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error occurred",
      error: error.message,
    });
  }
});

// LOGIN USER ///
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    // ✅ FIXED (added await)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ success: false, message: "Invalid password" });
    }

    // ✅ Access token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
    );

    // 🍪 cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.send({
      success: true,
      message: "Login successful",
      token: token, // ✅ fixed
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Error occurred",
      error: err.message,
    });
  }
});
// logout user ///
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ success: true });
});
// auth route here //
app.get("/auth/me", VerifyJWTToken, async (req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
  res.json({
    success: true,
    user: req.user,
  });
});
//========================
// JWTTOKEN VERIFY HERE //
//========================
function VerifyJWTToken(req, res, next) {
  const token = req.cookies?.token || req.headers?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.send({ message: "invalid token", success: false });
    }
    req.user = decoded;
    next();
  });
}
// ===================
// CRUD TASK OPER HERE
// ===================
app.post("/add-task", VerifyJWTToken, async (req, res) => {
  const newTask = await Task.create(req.body);

  res.send({
    message: "data posted",
    success: true,
  });
});

// DELETE MULTIPLE TASKS
app.delete("/multipleDelete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "no ids provided" });
    }

    console.log(ids);

    await Task.deleteMany({
      _id: { $in: ids },
    });

    res.json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
  }
});

// DELETE SINGLE TASK
app.delete("/delete-task/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteTask = await Task.findByIdAndDelete(id);

    if (!deleteTask) {
      return res.status(404).json({ message: "TASK NOT FOUND" });
    }

    res.status(200).json({
      message: "TASK DELETED SUCCESSFULLY",
      data: deleteTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
});

// DELETE ALL TASKS
app.delete("/delete-all", async (req, res) => {
  const deleteTask = await Task.deleteMany({});

  res.json({
    message: "All tasks deleted",
  });
});

// UPDATE TASK
app.put("/update-task/:id", async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  try {
    const updateTask = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updateTask) {
      return res.status(404).json({ message: "TASK NOT FOUND" });
    }

    res.status(200).json({
      message: "TASK UPDATED SUCCESSFULLY",
      data: updateTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
});

// =======================
// GET ROUTES
// =======================

// GET ALL TASKS
app.get("/tasks", VerifyJWTToken, async (req, res) => {
  console.log(req.user);
  const tasks = await Task.find();
  res.send(tasks);
});

// GET SINGLE TASK
app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  const tasks = await Task.findById(id);

  try {
    if (!tasks) {
      return res.status(404).json({ message: "task not found" });
    }

    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running");
});
