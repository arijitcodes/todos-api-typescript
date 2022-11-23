import express, { NextFunction, Request, Response, Router } from "express";
import User from "../Models/User";
import { IUser } from "../Schemas/User";
import { errorResponse } from "../Utils/errorResponse";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../Config/configs";

const router: Router = Router();

// Routes

// @Route   POST api/auth/registration
// @Desc    Create a New User / User Registration
// @Access  Public
router.post("/registration", async (req, res, next) => {
    try {
        const user = new User(req.body);

        // Find User with same email - if founf throw Duplicate Email Error
        const duplicateUser = await User.findOne({ email: user.email });
        if (duplicateUser) {
            return errorResponse(400, "Email ID is already in Use! Please try with a different Email!", res);
        }

        // If not found then encrypt password and save User

        // Check for Password Length from req.body
        if (req.body.password.length <= 4) {
            return errorResponse(400, "Password Length is too short! Use atleast 5 Characters/Letters/Numbers/Combination!", res);
        }

        // Encrypt and save
        user.password = await bcrypt.hash(user.password, 14);
        await user.save();

        return res.json(user);
    } catch (error) {
        // errorResponse(404, "Invalid ID! No Todo found!", res, next);
        next(error);
    }
})

// @Route   POST api/auth/login
// @Desc    Authenticate and Log In a User
// @Access  Public
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return errorResponse(401, "User Not Found with that Email! Please try again!", res);
        }

        // If user found, then compare password and return token
        const isComparisonPasswordSuccess: boolean = await bcrypt.compare(req.body.password, user.password);

        if (!isComparisonPasswordSuccess) {
            return errorResponse(401, "Invalid Password! Please try again!", res);
        }

        await user.save();

        // Generate token
        const payload = {
            userID: user._id,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        return res.json({ token });
    } catch (error) {
        // errorResponse(404, "Invalid ID! No Todo found!", res, next);
        next(error);
    }
})

export default router;
