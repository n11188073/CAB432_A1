// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");
const { uploadToS3, getDownloadPresignedUrl } = require("../utils/s3");
const { putItem } = require("../utils/dynamodb");

const router = express.Router();

// Ensure local tmp upload dir exists
const uploadDir = path.join(__dirname, "../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup (temporary local store)
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

    // Get presigned URL
    const s3Url = await getDownloadPresignedUrl(s3Key);

    // Save metadata in DynamoDB
    const item = {
      username: req.user,        // partition key
      id: req.file.filename,     // sort key
      owner: req.user,
      type: "uploaded",
      filter: null,
      s3Key,
      s3Url,
      localUrl: null,            // no need to rely on local
      processedAt: null,
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    };

    await putItem(item);

    res.json({
      message: "Upload successful (S3 + DynamoDB)",
      item,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
