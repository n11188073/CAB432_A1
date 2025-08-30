// loadtest.js
(async () => {
  const loadtest = await import("loadtest");

  const SERVER_URL = "http://ec2-3-27-56-108.ap-southeast-2.compute.amazonaws.com:3000/";

  const options = {
    url: SERVER_URL,
    maxRequests: 100,   // total number of requests
    concurrency: 10,    // how many requests at once
    method: "GET"
  };

  loadtest.default.loadTest(options, (err, result) => {
    if (err) {
      return console.error("Error during test:", err);
    }
    console.log("Load test finished.");
    console.log(result);
  });
})();
