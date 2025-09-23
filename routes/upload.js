// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");
const { images } = require("../data");
const { uploadToS3, getDownloadPresignedUrl } = require("../utils/s3");

const router = express.Router();

// Ensure upload directory exists locally
const uploadDir = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /upload
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const localPath = path.join(uploadDir, req.file.filename);
  const s3Key = `uploads/${req.file.filename}`;

  try {
    // Upload to S3
    await uploadToS3(localPath, s3Key);

    // Create metadata for this image
    const imgMeta = {
      filename: req.file.filename,
      url: `/images/uploads/${req.file.filename}`, // local access
      s3Key,
      owner: req.user,
    };
    images.push(imgMeta);

    // Optional: generate pre-signed URL
    const presignedUrl = await getDownloadPresignedUrl(s3Key);

    res.json({
      message: "Upload successful (local + S3)",
      filename: req.file.filename,
      localUrl: imgMeta.url,
      s3Key,
      presignedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload to S3 failed", details: err.message });
  }
});

module.exports = router;
