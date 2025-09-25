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

    // Metadata for local tracking
    const imgMeta = {
      filename: req.file.filename,
      url: `/images/uploads/${req.file.filename}`,
      s3Key,
      owner: req.user || "unknown-user",
    };
    images.push(imgMeta);

    // Save metadata in DynamoDB
    const dynamoItem = {
      "username": req.user?.email || req.user || "unknown-user", // partition key
      id: req.file.filename,                                        // sort key
      owner: req.user || "unknown-user",
      filter: null,
      processedAt: null,
      s3Key,
      s3Url: await getDownloadPresignedUrl(s3Key),
      localUrl: `/images/uploads/${req.file.filename}`,
      type: "uploaded",
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    };

    await putItem(dynamoItem);

    res.json({
      message: "Upload successful (local + S3 + DynamoDB)",
      item: dynamoItem,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
