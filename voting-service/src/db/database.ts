import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../config.env" }); // Load environment variables from .env file

mongoose.set("strictQuery", true);

// Connect to MongoDB using the DATABASE_URL from environment variables
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to Database:", error);
    process.exit(1); // Exit the process if connection fails
  }
};
