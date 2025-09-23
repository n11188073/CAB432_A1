const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { authenticate } = require("./auth");
const { images } = require("../data");
const { uploadToS3, getDownloadPresignedUrl } = require("../utils/s3");

const router = express.Router();

// Ensure processed directory exists locally
const processedDir = path.join(__dirname, "../data/processed");
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

// POST /process/:filename
// JSON body: { "filter": "thumbnail|invert|sepia" }
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

    // Save processed image locally
    await image.toFile(outputPath);

    // Upload processed image to S3
    const s3Key = `processed/${outputFile}`;
    await uploadToS3(outputPath, s3Key);

    // Generate presigned URL for S3 download
    const s3Url = await getDownloadPresignedUrl(s3Key);

    // Add metadata
    const imgMeta = {
      filename: outputFile,
      url: `/images/processed/${outputFile}`, // local path
      s3Key,
      s3Url,
      owner: req.user,
    };
    images.push(imgMeta);

    res.json({
      message: "Processing successful (local + S3)",
      filename: outputFile,
      url: imgMeta.url,
      s3Key,
      s3Url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

module.exports = router;
