import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";
import { TFile } from "../app/interfaces/file";
import config from "../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadImageToCloudinary = async (
  file: TFile
): Promise<UploadApiResponse> => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
  });

  let uploadResult;

  // Upload an image
  try {
    uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }

  //   Delete the image
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error("An error occurred in fileUploader file:", err);
    } else {
      console.log("File deleted successfully!");
    }
  });

  return uploadResult;

  // Optimize delivery by resizing and applying auto-format and auto-quality
  //   const optimizeUrl = cloudinary.url("shoes", {
  //     fetch_format: "auto",
  //     quality: "auto",
  //   });

  //   console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  //   const autoCropUrl = cloudinary.url("shoes", {
  //     crop: "auto",
  //     gravity: "auto",
  //     width: 500,
  //     height: 500,
  //   });

  //   console.log(autoCropUrl);
};

export const fileUploader = {
  upload,
  uploadImageToCloudinary,
};

// PH Hero code
// const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(file.path,
//             (error: Error, result: ICloudinaryResponse) => {
//                 fs.unlinkSync(file.path)
//                 if (error) {
//                     reject(error)
//                 }
//                 else {
//                     resolve(result)
//                 }
//             })
//     })
// };
