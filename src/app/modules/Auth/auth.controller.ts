import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken, needPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
    // data: {
    //   accessToken,
    //   needPasswordChange,
    // },
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePasswordIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully!",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPasswordIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPasswordIntoDB(token, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reset Password successfully!",
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
