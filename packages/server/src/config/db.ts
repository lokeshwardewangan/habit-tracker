import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
   try {
      const conn = await mongoose.connect(env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
   } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
   }
};

export const disconnectDB = async (): Promise<void> => {
   try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
   } catch (error) {
      console.error("Error disconnecting MongoDB:", error);
   }
};
