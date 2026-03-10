import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "config", "config.env"),
});


export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) throw new Error("MONGO_URI is undefined");

    await mongoose.connect(uri, {
      dbName: "pharmacyDB",
    });

    console.log("MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};
