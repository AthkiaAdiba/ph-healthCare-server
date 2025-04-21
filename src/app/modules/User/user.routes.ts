import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserValidations } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.getAllUsers
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createDoctor.parse(JSON.parse(req.body.data));
    return userControllers.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createPatient.parse(JSON.parse(req.body.data));
    return userControllers.createPatient(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.updateStatus),
  userControllers.changeProfileStatus
);

export const userRoutes = router;
