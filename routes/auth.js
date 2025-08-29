const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const SECRET = "secretkey"; // Use env var in production

// Hardcoded users (no bcrypt, plain passwords for demo)
const users = [
  { username: "alice", password: "password123" },
  { username: "bob", password: "mypassword" },
];

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Optional fake signup (doesn’t persist after restart)
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "User already exists" });
  }
  users.push({ username, password });
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET).username;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = router;
module.exports.authenticate = authenticate;
