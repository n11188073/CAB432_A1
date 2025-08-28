const express = require("express");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("./auth");

const router = express.Router();

// Serve uploaded images
router.get("/:filename", authenticate, (req, res) => {
  const uploadedPath = path.join(__dirname, "../data/uploads", req.params.filename);
  const processedPath = path.join(__dirname, "../data/processed", req.params.filename);

  if (fs.existsSync(uploadedPath)) return res.sendFile(uploadedPath);
  if (fs.existsSync(processedPath)) return res.sendFile(processedPath);

  res.status(404).send("File not found");
});

// List all images (uploaded + processed)
router.get("/", authenticate, (req, res) => {
  const uploadsDir = path.join(__dirname, "../data/uploads");
  const processedDir = path.join(__dirname, "../data/processed");

  const uploadedFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
  const processedFiles = fs.existsSync(processedDir) ? fs.readdirSync(processedDir) : [];

  const images = [];

  uploadedFiles.forEach(f => images.push({ filename: f, type: "uploaded", filter: "-" }));
  processedFiles.forEach(f => images.push({ filename: f, type: "processed", filter: f.split("-")[1] || "unknown" }));

  res.json(images);
});

module.exports = router;
