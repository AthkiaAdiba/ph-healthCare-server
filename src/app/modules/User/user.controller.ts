import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.file);
  // console.log(req.body.data);

  const result = await userServices.createAdminIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.file);
  // console.log(req.body.data);

  const result = await userServices.createDoctorIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor is created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.file);
  // console.log(req.body.data);

  const result = await userServices.createPatientIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient is created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const queryParams = { ...req.query };
  const filters = pick(queryParams, userFilterableFields);
  const options = pick(queryParams, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All users data are fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userServices.changeProfileStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile status changed successfully!",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
};
