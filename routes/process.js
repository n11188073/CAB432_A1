// routes/process.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { authenticate } = require("./auth");
const { uploadToS3, getDownloadPresignedUrl } = require("../utils/s3");
const { putItem } = require("../utils/dynamodb");

const router = express.Router();

// Ensure tmp dir for processed files
const processedDir = path.join(__dirname, "../data/processed");
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

// POST /process/:filename
// Body: { filter: "thumbnail|invert|sepia" }
router.post("/:filename", authenticate, async (req, res) => {
  const { filter } = req.body;
  const inputPath = path.join(__dirname, "../data/uploads", req.params.filename);

  if (!fs.existsSync(inputPath)) return res.status(404).json({ error: "Image not found" });
  if (!filter) return res.status(400).json({ error: "No filter provided" });

  const outputFile = `${Date.now()}-${filter}-${req.params.filename}`;
  const outputPath = path.join(processedDir, outputFile);

  try {
    let image = sharp(inputPath);

    switch (filter) {
      case "thumbnail":
        image = image.resize({ width: 150 });
        break;
      case "invert":
        image = image.negate();
        break;
      case "sepia":
        image = image.tint({ r: 112, g: 66, b: 20 });
        break;
      default:
        return res.status(400).json({ error: "Invalid filter option" });
    }

    // Save locally (tmp)
    await image.toFile(outputPath);

    // Upload processed file to S3
    const s3Key = `processed/${outputFile}`;
    await uploadToS3(outputPath, s3Key);

    // Presigned URL
    const s3Url = await getDownloadPresignedUrl(s3Key);

    // Save metadata in DynamoDB
    const item = {
      username: req.user,
      id: outputFile,
      owner: req.user,
      type: "processed",
      filter,
      s3Key,
      s3Url,
      localUrl: null,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };

    await putItem(item);

    res.json({
      message: "Processing successful (S3 + DynamoDB)",
      item,
    });
  } catch (err) {
    console.error("Processing error:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

module.exports = router;
