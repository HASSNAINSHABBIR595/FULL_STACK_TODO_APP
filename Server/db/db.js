import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGO_URL;

const connection = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error("ERROR", error);
    process.exit(1);
  }
};

export default connection;
