const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = "secretkey";

// Hardcoded users
const users = {
  alice: "password123",
  bob: "securepass"
};

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user.username;
    next();
  });
}

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  if (users[username]) {
    return res.status(400).json({ error: "User already exists" });
  }

  users[username] = password; // simple in-memory store
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
module.exports.authenticate = authenticate;
