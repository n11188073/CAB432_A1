const express = require("express");
const path = require("path");
const { authenticate } = require("./auth");
const uploadRoutes = require("./upload");
const processRoutes = require("./process");

const router = express.Router();

// List all images (uploaded + processed) for the logged-in user
router.get("/", authenticate, (req, res) => {
  const uploads = uploadRoutes.uploads || [];
  const processed = processRoutes.processed || [];

  // Only show images owned by the user
  const mine = uploads.concat(processed).filter(img => img.owner === req.user);
  res.json(mine);
});

// Download a processed file by filename
router.get("/:filename", authenticate, (req, res) => {
  const filePath = path.join(__dirname, "../data/processed", req.params.filename);

  if (!require("fs").existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath);
});

module.exports = router;
