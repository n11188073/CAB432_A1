// loadtest.js
const axios = require("axios");

// Change this if your EC2/Docker app runs on another host/port
const SERVER_URL = "http://localhost:5000/process";  

// Which image/operation to stress test
const payload = {
  filename: "1756464010645-Assignments.jpg",    // must exist in uploads
  filter: "invert"         // or invert / thumbnail
};

const CONCURRENT_REQUESTS = 50;  // how many requests at the same time
const DURATION_MS = 5 * 60 * 1000; // 5 minutes

async function spamRequest() {
  try {
    await axios.post(SERVER_URL, payload);
    console.log("Request OK");
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

async function startLoadTest() {
  const start = Date.now();
  console.log(`Starting load test for ${DURATION_MS / 1000}s...`);

  while (Date.now() - start < DURATION_MS) {
    // fire off multiple requests in parallel
    const batch = [];
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      batch.push(spamRequest());
    }
    await Promise.all(batch);

    // optional small delay to avoid 100% network flood
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log("Load test finished.");
}

startLoadTest();
