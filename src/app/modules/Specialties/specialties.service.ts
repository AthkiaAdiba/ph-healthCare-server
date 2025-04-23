import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { Specialties } from "@prisma/client";

const addSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.icon = uploadToCloudinary.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialtiesFromDB = async (): Promise<Specialties[]> => {
  const result = await prisma.specialties.findMany();

  return result;
};

const deleteSingleSpecialtiesFromDB = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.specialties.delete({
    where: {
      id,
    },
  });
};

export const SpecialtiesServices = {
  addSpecialtiesIntoDB,
  getAllSpecialtiesFromDB,
  deleteSingleSpecialtiesFromDB,
};
