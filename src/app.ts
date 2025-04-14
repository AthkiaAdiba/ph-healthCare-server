import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";

const app: Application = express();

// middlewares
app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found!",
    error: {
      path: req.originalUrl,
      message: "Your requested url not found!",
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Ph health care server....");
});

export default app;
