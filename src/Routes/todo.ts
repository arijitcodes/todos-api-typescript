import express, { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../Middlewares/auth";
import Todo from "../Models/Todo";
import { ITodo } from "../Schemas/Todo";
import { errorResponse } from "../Utils/errorResponse";

const router: Router = Router();

// Routes

// @Route   GET api/todos
// @Desc    Get all Todos
// @Access  Public
router.get("/", isAuthenticated, async (req: any, res: Response) => {
    const todos: ITodo[] = await Todo.find({ user: req.user._id });
    return res.json(todos);
});

// @Route   GET api/todos/:todoID
// @Desc    Get A Todo by ID
// @Access  Public
router.get("/:id", isAuthenticated, async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);
        if (!todo) {
            return errorResponse(404, "Todo Not Found!", res);
        }

        if (todo.user.toString() !== req.user.id) {
            return errorResponse(403, "Un-Authorized Request!", res);
        }

        return res.json(todo);
    } catch (error) {
        // errorResponse(404, "Invalid ID! No Todo found!", res, next);
        next(error);
    }
});

// @Route   POST api/todos
// @Desc    Create a New Todo
// @Access  Public
router.post("/", isAuthenticated, async (req: any, res: Response, next: NextFunction) => {
    try {
        req.body.user = req.user._id;
        const todo = await Todo.create(req.body);

        if (!todo) {
            return errorResponse(
                500,
                "Failed to Create New Todo! Something Went Wrong!",
                res
            );
        }
        return res.json(todo);
    } catch (error) {
        next(error);
    }
});

// @Route   PUT api/todos
// @Desc    Update a New Todo
// @Access  Public
router.put("/:id", isAuthenticated, async (req: any, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return errorResponse(404, "Failed to Update Todo! Todo ID is Wrong in URL Param! Todo Not Found!", res);
        }

        if (todo.user.toString() !== req.user.id) {
            return errorResponse(403, "Un-Authorized Request!", res);
        }

        todo.title = req.body.title;
        todo.description = req.body.description;
        await todo.save();

        const updatedTodo = await Todo.findById(todo._id);

        if (!updatedTodo) {
            return errorResponse(
                400,
                "Failed to Update Todo! Todo ID is Wrong in URL Param!",
                res
            );
        }

        return res.json(updatedTodo);
    } catch (error) {
        next(error);
    }
});

// @Route   PATCH api/todos
// @Desc    Alter status of a Todo
// @Access  Public
router.patch(
    "/:id", isAuthenticated,
    async (req: any, res: Response, next: NextFunction) => {
        try {
            const todo = await Todo.findById(req.params.id);

            if (!todo) {
                return errorResponse(
                    400,
                    "Failed to Update Todo Status! Todo ID is Wrong in URL Param!",
                    res
                );
            }

            if (todo.user.toString() !== req.user.id) {
                return errorResponse(403, "Un-Authorized Request!", res);
            }

            todo.status = !todo.status;
            await todo.save();

            return res.json(todo);
        } catch (error) {
            next(error);
        }
    }
);

// @Route   DELETE api/todos
// @Desc    Delete a Todo
// @Access  Public
router.delete(
    "/:id", isAuthenticated,
    async (req: any, res: Response, next: NextFunction) => {
        try {
            const todo = await Todo.findById(req.params.id);

            if (!todo) {
                return errorResponse(
                    400,
                    "Failed to Delete Todo! Todo ID is Wrong in URL Param!",
                    res
                );
            }

            if (todo.user.toString() !== req.user.id) {
                return errorResponse(403, "Un-Authorized Request!", res);
            }

            await todo.delete();

            return res.json(todo);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
