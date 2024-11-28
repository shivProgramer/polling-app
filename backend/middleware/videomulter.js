const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the directory where you want to store the uploaded video files
const videoUploadDir = path.join(
  __dirname,
  "..",
  "public",
  "uploads",
  "videos"
);

// Ensure that the upload directory exists
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration for video files
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirectoryExistence(videoUploadDir); // Ensure video directory exists
    cb(null, videoUploadDir); // Set the destination for video files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);

    // Initialize a custom array for storing file details if not already initialized
    if (!req.customFileArray) {
      req.customFileArray = [];
    }

    // Store custom file information in the custom array
    req.customFileArray.push({
      fileName: filename,
      pathName: "/uploads/videos/" + filename, // Relative path for DB storage
      originalname: file.originalname,
      path: path.join(videoUploadDir, filename), // Full path for server-side usage
    });
  },
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true); // Accept video files
  } else {
    cb(new Error("Invalid file type"), false); // Reject unsupported file types
  }
};

// Multer middleware for video file uploads
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit for videos
  },
}).array("videoFiles"); // Field name for video files

module.exports = videoUpload;
