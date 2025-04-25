import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorControllers } from "./doctor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./Doctor.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.getAllDoctors
);

router.get("/:id", DoctorControllers.getSingleDoctor);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidation.update),
  DoctorControllers.updateDoctor
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.deleteDoctor
);

router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.softDoctorDelete
);

export const DoctorRoutes = router;
