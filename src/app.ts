import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";

const app: Application = express();

// middlewares
app.use(cors());


// parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// roues
app.use("/api/v1/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Ph health care server....");
});

export default app;
