import { Response } from "express";

export const errorResponse = (
    status: number,
    errorMessage: string,
    res: Response
): void => {
    res.status(status);
    throw new Error(errorMessage);
};
