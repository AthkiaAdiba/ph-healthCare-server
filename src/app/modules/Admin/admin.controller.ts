import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = { ...req.query };
    const filters = pick(queryParams, adminFilterableFields);
    const options = pick(queryParams, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log({ options });

    const result = await AdminServices.getAllAdminsFromDB(filters, options);

    // res.status(200).json({
    //   success: true,
    //   message: "Admin data fetched!",
    //   meta: result.meta,
    //   data: result.data,
    // });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data fetched!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
    // res.status(500).json({
    //   success: false,
    //   message: err.name || "Something went wrong!",
    //   error: err,
    // });
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
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
  } catch (err: any) {
    next(err);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const result = await AdminServices.updateAdminIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data is updated!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const result = await AdminServices.deleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data is deleted!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await AdminServices.softDeleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data is deleted!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
