import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpers/jwtHelper";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!");
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = verifyToken(token, config.jwt.refresh_token_secret as string);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

const changePasswordIntoDB = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

const forgotPasswordIntoDB = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_secret_expires_in as string
  );

  //  http://localhost:3000/reset-pass/?email=athkia&token=fjdfjfkdk

  const resetPassLink = `${config.reset_pass_link}?id=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
    <div>
      <p>Dear User,</p>
      <p>Your Password Link 
         <a href=${resetPassLink}>
           <button>
              Reset Password
           </button>
         </a>
      </p>
    </div>
    `
  );
};

const resetPasswordIntoDB = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.jwt.reset_pass_secret as string
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthServices = {
  loginUserIntoDB,
  refreshToken,
  changePasswordIntoDB,
  forgotPasswordIntoDB,
  resetPasswordIntoDB,
};
