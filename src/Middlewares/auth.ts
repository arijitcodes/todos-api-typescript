import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../Config/configs';
import User from '../Models/User';
import { errorResponse } from '../Utils/errorResponse';

// Authentication Middleware
const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader: string = req.headers["authorization"];

        // If Not Authorization Header Found
        if (!authHeader) {
            return errorResponse(401, "Un-Authenticated! No Authorization Header Found!", res);
        }

        // If Header is there, fetch token value
        const jwtToken: string = authHeader.split(" ")[1];
        if (!authHeader) {
            return errorResponse(401, "Un-Authenticated! No Auth Token Found!", res);
        }

        // If there is a Token, then validate it
        const token: any = await jwt.verify(jwtToken, JWT_SECRET);

        const user = await User
            .findById(token.userID)
            .select("-password")
            .exec();

        req.user = user;
        req.user.id = req.user._id.toString();
        next();
    } catch (error: any) {
        console.log("Errwa Happened: ", error);
        // return errorResponse(401, error.toString(), res);
        // throw new Error(error);
        res.status(401);
        next(error);
    }
}

export {
    isAuthenticated
}