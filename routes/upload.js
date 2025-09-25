const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");
const { images } = require("../data");
const { uploadToS3, getDownloadPresignedUrl } = require("../utils/s3");
const { putItem } = require("../utils/dynamodb");

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

    // Metadata
    const imgMeta = {
      filename: req.file.filename,
      url: `/images/uploads/${req.file.filename}`, // local
      s3Key,
      owner: req.user,
    };
    images.push(imgMeta);

    // Save metadata in DynamoDB
    await putItem({
      "qut-username": "n11188073@qut.edu.au", // partition key
      name: req.file.filename,                // sort key
      s3Key,
      owner: req.user,
      uploadedAt: new Date().toISOString(),
    });

    // Generate pre-signed URL
    const presignedUrl = await getDownloadPresignedUrl(s3Key);

    res.json({
      message: "Upload successful (local + S3 + DynamoDB)",
      filename: req.file.filename,
      localUrl: imgMeta.url,
      s3Key,
      presignedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
