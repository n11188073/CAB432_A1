const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

let uploads = [];

// Upload endpoint
router.post("/", authenticate, upload.single("image"), (req, res) => {
  const record = {
    id: uploads.length + 1,
    owner: req.user,
    filename: req.file.filename,
    timestamp: new Date().toISOString(),
  };
  uploads.push(record);
  res.json(record);
});

module.exports = router;
module.exports.uploads = uploads;
