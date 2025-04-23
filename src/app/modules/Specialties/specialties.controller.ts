import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SpecialtiesServices } from "./specialties.service";

const addSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.addSpecialtiesIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialties added successfully!",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getAllSpecialtiesFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Specialties fetched successfully!",
    data: result,
  });
});

const deleteSingleSpecialties = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await SpecialtiesServices.deleteSingleSpecialtiesFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "This Specialties is deleted successfully!",
      data: result,
    });
  }
);

export const SpecialtiesControllers = {
  addSpecialties,
  getAllSpecialties,
  deleteSingleSpecialties,
};
