import { Document } from "mongoose";

// Todo Model Interface Schema
export interface ITodo extends Document {
    title: string;
    description: string;
    status: boolean;
    user: string;
}
