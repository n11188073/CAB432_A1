const express = require("express");
const path = require("path");
const fs = require("fs");
const { images } = require("../data");
const { authenticate } = require("./auth");

const router = express.Router();

// Get all images for the logged-in user
router.get("/", authenticate, (req, res) => {
  const userImages = images.filter(img => img.owner === req.user);
  res.json(userImages);
});

// Download a processed image (user can only download their own)
router.get("/download/:filename", authenticate, (req, res) => {
  const filename = req.params.filename;
  const userImages = images.filter(img => img.owner === req.user);
  const image = userImages.find(img => img.filename === filename);

  if (!image) {
    return res.status(403).json({ error: "You do not have access to this image" });
  }

  const filePath = path.join(__dirname, "../data/processed", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, filename, err => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

module.exports = router;
