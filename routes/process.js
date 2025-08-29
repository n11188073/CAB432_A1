const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { authenticate } = require("./auth");

const router = express.Router();

// Ensure processed folder
const processedDir = path.join(__dirname, "../data/processed");
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

router.post("/:filename", authenticate, async (req, res) => {
  const { filter } = req.body;
  const inputPath = path.join(__dirname, "../data/uploads", req.params.filename);
  if (!fs.existsSync(inputPath)) return res.status(404).json({ error: "Image not found" });

  const outputFile = `${Date.now()}-${filter}-${req.params.filename}`;
  const outputPath = path.join(processedDir, outputFile);

  try {
    let image = sharp(inputPath);
    switch (filter) {
      case "thumbnail": image = image.resize({ width: 150 }); break;
      case "invert": image = image.negate(); break;
      case "sepia": image = image.tint({ r: 112, g: 66, b: 20 }); break;
      default: return res.status(400).json({ error: "Invalid filter" });
    }
    await image.toFile(outputPath);
    res.json({ filename: outputFile });
  } catch (err) {
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

module.exports = router;
