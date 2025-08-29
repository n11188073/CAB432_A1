const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Get all images (uploaded + processed)
router.get("/", (req, res) => {
  const uploadsDir = path.join(__dirname, "../data/uploads");
  const processedDir = path.join(__dirname, "../data/processed");

  const uploadedFiles = fs.existsSync(uploadsDir)
    ? fs.readdirSync(uploadsDir).map(f => ({
        filename: f,
        url: `/images/uploads/${f}`,
      }))
    : [];

  const processedFiles = fs.existsSync(processedDir)
    ? fs.readdirSync(processedDir).map(f => ({
        filename: f,
        url: `/images/processed/${f}`,
      }))
    : [];

  res.json([...uploadedFiles, ...processedFiles]);
});

module.exports = router;
