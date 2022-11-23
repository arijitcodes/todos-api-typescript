import mongoose from "mongoose";
import { ITodo } from "../Schemas/Todo";

// Todo Model (Mongoose Schema)
const todoSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is a required field!"],
        },
        description: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refference: "User",
            required: [true, "User is a Required Field!"]
        }
    },
    { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", todoSchema);
