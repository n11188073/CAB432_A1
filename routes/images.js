const express = require("express");
const { images } = require("../data");
const { authenticate } = require("./auth");

const router = express.Router();

// Get all images for the logged-in user
router.get("/", authenticate, (req, res) => {
  const userImages = images.filter(img => img.owner === req.user);
  res.json(userImages);
});

module.exports = router;
