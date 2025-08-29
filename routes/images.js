const express = require("express");
const fs = require("fs");
const path = require("path");
const { authenticate } = require("./auth");

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const uploads = fs.readdirSync(path.join(__dirname, "../data/uploads"));
  const processed = fs.readdirSync(path.join(__dirname, "../data/processed"));
  res.json({ uploads, processed });
});

module.exports = router;
