const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const multer = require("multer");
const { authenticate } = require("./auth");

const router = express.Router();

// Multer setup for form-data (no files, just filter field)
const upload = multer();

// Ensure processed directory exists
const processedDir = path.join(__dirname, "../data/processed");
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

// In-memory processed records
let processed = [];

// POST /process/:filename
// Expects JSON body: { "filter": "thumbnail" }
router.post("/:filename", authenticate, upload.none(), async (req, res) => {
  const { filter } = req.body;

  if (!filter) return res.status(400).json({ error: "No filter provided" });

  const inputPath = path.join(__dirname, "../data/uploads", req.params.filename);
  if (!fs.existsSync(inputPath)) return res.status(404).json({ error: "Image not found" });

  const outputFile = `${Date.now()}-${filter}-${req.params.filename}`;
  const outputPath = path.join(processedDir, outputFile);

  try {
    let image = sharp(inputPath);

    // Apply assignment-related filters
    switch (filter) {
      case "thumbnail":
        image = image.resize({ width: 150 }); // width 150px, auto height
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

    await image.toFile(outputPath);

    const record = {
      id: processed.length + 1,
      owner: req.user,
      filename: outputFile,
      filter,
      timestamp: new Date().toISOString(),
    };

    processed.push(record);
    res.json(record);
  } catch (err) {
    console.error("Sharp processing error:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

module.exports = router;
module.exports.processed = processed;
