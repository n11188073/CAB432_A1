const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const processRoutes = require("./routes/process");
const imageRoutes = require("./routes/images");

const app = express();

// Only parse JSON if Content-Type is application/json
app.use(bodyParser.json({ type: "application/json" }));

// Routes
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/process", processRoutes);
app.use("/images", imageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
