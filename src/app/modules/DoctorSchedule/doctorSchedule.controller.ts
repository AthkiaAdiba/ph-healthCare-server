import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constants";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await DoctorScheduleService.createDoctorScheduleIntoDB(
      user,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Doctor schedule is created successfully!",
      data: result,
    });
  }
);

const getMyAllSchedules = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;

    const result = await DoctorScheduleService.getMyAllSchedulesFromDB(
      filters,
      options,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All my Schedules are retrieved successfully!",
      data: result,
    });
  }
);

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorScheduleService.getAllSchedulesFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Schedules are retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteMySchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    const result = await DoctorScheduleService.deleteMyScheduleFromDB(
      user as TAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My Schedule is deleted successfully!",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMyAllSchedules,
  deleteMySchedule,
  getAllSchedules,
};
