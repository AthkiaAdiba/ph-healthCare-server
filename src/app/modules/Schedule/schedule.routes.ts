import express from "express";
import { ScheduleControllers } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleControllers.addSchedule);

export const ScheduleRoutes = router;
