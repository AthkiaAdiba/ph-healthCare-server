import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesControllers } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidations } from "./specialties.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidations.createSpecialtiesValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    console.log(req.body);
    return SpecialtiesControllers.addSpecialties(req, res, next);
  }
);

router.get("/", SpecialtiesControllers.getAllSpecialties);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesControllers.deleteSingleSpecialties
);

export const SpecialtiesRoutes = router;
