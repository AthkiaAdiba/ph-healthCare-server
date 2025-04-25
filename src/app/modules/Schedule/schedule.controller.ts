import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleServices } from "./schedule.service";

const addSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.addScheduleIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule is created successfully!",
    data: result,
  });
});

export const ScheduleControllers = {
  addSchedule,
};
