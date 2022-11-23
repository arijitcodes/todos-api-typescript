import mongoose from "mongoose";
import { IUser } from "../Schemas/User";

// Todo Model (Mongoose Schema)
const userSchema: mongoose.Schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: [true, "First Name is a required field!"],
        },
        lastName: {
            trim: true,
            type: String,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: [true, "Email is a required field!"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            min: [4, "Password Length is too short! Use atleast 5 Characters/Letters/Numbers/Combination!"],
            required: [true, "Password is a required field!"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of Birth is a required field!"],
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    this.firstName =
        this.firstName[0].toUpperCase() + this.firstName.slice(1).toLowerCase();
    this.lastName =
        this.lastName[0].toUpperCase() + this.lastName.slice(1).toLowerCase();
    next();
});

export default mongoose.model<IUser>("User", userSchema);
