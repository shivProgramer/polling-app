const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the directory where you want to store the uploaded files
const uploadDir = path.join(__dirname, "..", "public", "uploads", "images");

// Ensure that the upload directory exists
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirectoryExistence(uploadDir);
    console.log("req", req.files ? req.files.length : "No files");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);

    // Initialize a custom array if not already initialized
    if (!req.customFileArray) {
      req.customFileArray = [];
    }

    console.log("file", filename);
    // Store custom file information in the custom array
    req.customFileArray.push({
      fileName: filename,
      pathName: "/uploads/images/" + filename, // Relative path for DB storage
      originalname: file.originalname,
      path: path.join(uploadDir, filename), // Full path for server-side usage
    });
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB file size limit
  },
}).array("imageFiles"); // Accept multiple image files under "imageFiles" field

module.exports = upload;
