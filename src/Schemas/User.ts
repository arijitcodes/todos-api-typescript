import { Document } from "mongoose";

// User Model Interface Schema
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    verified: boolean;
}
