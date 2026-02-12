import multer from "multer";
import path from "path";
import fs from "fs";

const hasCloudinaryConfig =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinaryConfig) {
  // Keep files in memory and upload to Cloudinary from controller.
  storage = multer.memoryStorage();
} else {
  const uploadPath = "./uploads";
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
