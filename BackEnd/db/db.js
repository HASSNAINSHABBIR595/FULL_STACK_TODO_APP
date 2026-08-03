import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/taskapp";

const connection = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error("ERROR", error);
    process.exit(1);
  }
};

export default connection;
