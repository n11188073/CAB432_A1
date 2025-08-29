const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");

const router = express.Router();

// Ensure upload folder
const uploadDir = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config for multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/", authenticate, upload.array("images"), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });
  const uploaded = req.files.map(f => f.filename);
  res.json({ uploaded });
});

module.exports = router;
