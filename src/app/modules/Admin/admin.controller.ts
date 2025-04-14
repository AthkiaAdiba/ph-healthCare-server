import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AdminServices } from "./admin.service";
import catchAsync from "../../../shared/catchAsync";

const getAllAdmins = catchAsync(async (req, res) => {
  const queryParams = { ...req.query };
  const filters = pick(queryParams, adminFilterableFields);
  const options = pick(queryParams, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminServices.getAllAdminsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.getAdminByIdFromDB(id);

  // res.status(200).json({
  //   success: true,
  //   message: "Single Admin data fetched!",
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Single Admin data fetched!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.updateAdminIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin data is updated!",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin data is deleted!",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.softDeleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin data is deleted!",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
