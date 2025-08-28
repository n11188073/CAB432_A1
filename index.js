const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const processRoutes = require("./routes/process");
const imageRoutes = require("./routes/images");

const app = express();

// Serve static files from src/static
app.use(express.static(path.join(__dirname, "src/static")));

// Parse JSON bodies
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/process", processRoutes);
app.use("/images", imageRoutes);

// Fallback route for SPA / index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/static/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
