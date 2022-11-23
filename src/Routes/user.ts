import express, { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
import User from "../Models/User";
import { IUser } from "../Schemas/User";
import { errorResponse } from "../Utils/errorResponse";

const router: Router = Router();

// Routes

// @Route   GET api/user/:id
// @Desc    Get One User by User ID
// @Access  Public
router.get("/:id", isAuthenticated, async (req: any, res, next) => {
    try {
        // console.log(req.user)
        if (req.user.id !== req.params.id) {
            return errorResponse(403, "Un-Authorized Request!", res);
        }

        return res.json(req.user);
    } catch (error) {
        // errorResponse(404, "Invalid ID! No Todo found!", res, next);
        next(error);
    }
})

export default router;
