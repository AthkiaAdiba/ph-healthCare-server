import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  // console.log(req.file);
  //console.log(req.body);

  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  console.log("usee", userData);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const cratedAdmin = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return cratedAdmin;
  });

  return result;
};

const createDoctorIntoDB = async (req: Request): Promise<Doctor> => {
  // console.log(req.file);
  //console.log(req.body);

  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const cratedDoctor = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return cratedDoctor;
  });

  return result;
};

const createPatientIntoDB = async (req: Request): Promise<Patient> => {
  // console.log(req.file);
  //console.log(req.body);

  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const cratedPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return cratedPatient;
  });

  return result;
};

const getAllUsersFromDB = async (params: any, options: IPaginationOptions) => {
  //console.log(params);
  //const { limit, page } = options;
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  //   console.dir(andConditions, { depth: "infinity" });
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
    // include: {
    //   admin: true,
    //   patient: true,
    //   doctor: true,
    // },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatusIntoDB = async (
  id: string,
  data: { status: UserStatus }
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });

  return updateUserStatus;
};

export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUsersFromDB,
  changeProfileStatusIntoDB,
};
