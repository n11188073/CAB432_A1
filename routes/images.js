const express = require("express");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");
const { processed } = require("./process");
const { uploads } = require("./upload"); // Make sure upload.js exports `uploads`

const router = express.Router();

// GET /images → list all uploads + processed images for the authenticated user
router.get("/", authenticate, (req, res) => {
  const userImages = [...uploads, ...processed].filter(img => img.owner === req.user);
  res.json(userImages);
});

// GET /images/:filename → download a processed image
router.get("/:filename", authenticate, (req, res) => {
  const filename = path.basename(req.params.filename); // sanitize
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
