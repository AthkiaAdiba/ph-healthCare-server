import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleServices } from "./schedule.service";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";

const addSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.addScheduleIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule is created successfully!",
    data: result,
  });
});

const getAllSchedules = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;

    const result = await ScheduleServices.getAllSchedulesFromDB(
      filters,
      options,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Schedules retrieved successfully!",
      data: result,
    });
  }
);

const getSingleSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ScheduleServices.getSingleScheduleFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule is retrieved successfully!",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ScheduleServices.deleteScheduleFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule is deleted successfully!",
    data: result,
  });
});

export const ScheduleControllers = {
  addSchedule,
  getAllSchedules,
  getSingleSchedule,
  deleteSchedule,
};
