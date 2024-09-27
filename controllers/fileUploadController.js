const multer = require("multer");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/AppError");

// Using MULTER for task files And CLOUDINARY services for User photos.

// MULTER configs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
        400
      ),
      false
    );
  }
  cb(null, true);
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `file-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const uploadTaskFile = upload.single("file");

const resizeTaskFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileExt = req.file.mimetype.split("/")[1];
  if (fileExt === "pdf") {
    return next();
  }
  const resizedFilePath = path.join("uploads", `resized-${req.file.filename}`);
  await sharp(req.file.path).resize(500, 500).toFile(resizedFilePath);
  // Optionally, delete the original file after resizing
  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Error deleting original file:", err);
  });
  req.file.path = resizedFilePath;
  req.file.filename = `resized-${req.file.filename}`;
  next();
});

// CLOUDINARY configs
cloudinary.config({
  cloud_name: "dnd0koxcl",
  api_key: "955548382159329",
  api_secret: "QRNRWxS2UrihA8QbrvyU7kNu65U",
});

const cloudinaryUploadUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.photo) {
    return next();
  }

  const photoBuffer = req.files.photo.data; // Get the file buffer

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "user_photos",
      transformation: [{ width: 500, height: 500, crop: "fill" }],
      quality: "auto",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return next(new AppError("Failed to upload photo to Cloudinary"));
      }
      req.body.photo = result.secure_url;
      next();
    }
  );

  // Pipe the buffer to Cloudinary
  uploadStream.end(photoBuffer);
});

module.exports = { uploadTaskFile, resizeTaskFile, cloudinaryUploadUserPhoto };
