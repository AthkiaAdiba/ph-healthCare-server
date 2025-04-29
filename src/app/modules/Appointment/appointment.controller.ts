import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppointmentService } from "./appointment.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { appointmentFilterableFields } from "./appointment.constant";

const createAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointmentIntoDB(
      user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Appointment is created successfully!",
      data: result,
    });
  }
);

const getMyAppointments = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AppointmentService.getMyAppointmentsFromDB(
      user as TAuthUser,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My appointments are retrieved successfully!",
      data: result,
    });
  }
);

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AppointmentService.getAllAppointmentsFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All appointments are retrieval successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
};
