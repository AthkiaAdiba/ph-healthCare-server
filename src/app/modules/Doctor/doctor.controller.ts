import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";
import { Request, Response } from "express";

const getAllDoctors = catchAsync(async (req, res) => {
  const queryParams = { ...req.query };
  const filters = pick(queryParams, doctorFilterableFields);
  const options = pick(queryParams, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await DoctorServices.getAllDoctorsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All doctors data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.getSingleDoctorFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.deleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor is deleted successfully",
    data: result,
  });
});

const softDoctorDelete = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DoctorServices.softDoctorDeleteFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor soft data is deleted!",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DoctorServices.updateDoctorIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor is updated successfully!",
    data: result,
  });
});

export const DoctorControllers = {
  getAllDoctors,
  getSingleDoctor,
  deleteDoctor,
  softDoctorDelete,
  updateDoctor,
};
