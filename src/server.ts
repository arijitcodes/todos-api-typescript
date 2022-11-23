import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";

const app: Application = express();

// Import Configs
import { PORT } from "./Config/configs";
import { connectDB } from "./Config/db";
import { errorResponse } from "./Utils/errorResponse";

// Import Routes
import todosRoute from "./Routes/todo";
import authRoute from "./Routes/auth"
import userRoute from "./Routes/user"

/*
    Middlewares
*/
app.use(cors());
app.use(express.json());

/*
    Routes
*/
app.get("/", (req: Request, res: Response) => {
  return res.send("🦄🌈✨👋🏻🌎🌍🌏👋🏻✨🌈🦄");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/todos", todosRoute);

/*
   Error 404 Route Handle
*/
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  // return res.status(404).json({ error: "Error 404 - Resource Not Found!" });
  return errorResponse(404, "Error 404 - Resource Not Found!", res);
});

/*
   General Error Handler
*/
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  // console.log(err);
  return res.status(statusCode).json({ error: err.message, stack: err.stack });
});

/*
    Start Server and Connect to MongoDB
*/
app.listen(PORT, (): void => {
  console.log(`✨ Server started at Port: ${PORT}...`);
  connectDB();
});
