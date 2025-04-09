import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const queryParams = { ...req.query };
    const filters = pick(queryParams, adminFilterableFields);
    const options = pick(queryParams, ["limit", "page", "sortBy", "sortOrder"]);
    console.log({ options });

    const result = await AdminServices.getAllAdminsFromDB(filters, options);

    res.status(200).json({
      success: true,
      message: "Admin data fetched!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong!",
      error: err,
    });
  }
};

export const AdminControllers = {
  getAllAdmins,
};
