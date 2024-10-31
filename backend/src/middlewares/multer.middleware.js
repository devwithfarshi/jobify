const multer = require("multer");
const { diskStorage } = multer;
const { join, extname } = require("path");
const fs = require("fs");

// Define the path for the uploads directory
const uploadsDir = join(__dirname, "..", "public", "uploads");

// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
