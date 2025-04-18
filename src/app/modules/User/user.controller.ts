import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    // console.log(req.body)
    const result = await userServices.createAdminIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
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

export const userControllers = {
  createAdmin,
};
