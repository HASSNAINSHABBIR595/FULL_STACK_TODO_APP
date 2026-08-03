import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export default mongoose.model("Users", taskSchema);
