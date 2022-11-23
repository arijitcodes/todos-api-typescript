import mongoose from "mongoose";
import { MONGODB_URL } from "./configs";

// DB Connection Method
export const connectDB = (): void => {
    mongoose.connect(MONGODB_URL, {}, (err: any) => {
        if (err) {
            console.error("🛑 Error: Failed to connect to MongoDB!");
            console.error(err);
            process.exit(1);
        }

        console.log("✨ MongoDB Connected Successfully...");
    });
};
