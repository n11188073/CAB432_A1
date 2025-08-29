const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");
const { images } = require("../data");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload endpoint
router.post("/", authenticate, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imgMeta = {
    filename: req.file.filename,
    url: `/images/uploads/${req.file.filename}`,
    owner: req.user, // req.user is set by authenticate middleware
  };
  images.push(imgMeta);

  res.json({
    message: "Upload successful",
    filename: req.file.filename,
    url: imgMeta.url,
  });
});

module.exports = router;
