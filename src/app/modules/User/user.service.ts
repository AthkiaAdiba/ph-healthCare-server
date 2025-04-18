import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdminIntoDB = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const cratedAdmin = await transactionClient.admin.create({
      data: data.admin,
    });

    return cratedAdmin;
  });

  return result;
};

export const userServices = {
  createAdminIntoDB,
};
