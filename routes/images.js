// routes/images.js
const express = require("express");
const { authenticate } = require("./auth");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getParameter } = require("../utils/parameters");

const router = express.Router();
const region = "ap-southeast-2";

// AWS clients
const ddbClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const s3Client = new S3Client({ region });

// Parameters (loaded once at startup)
let tableName;
let bucketName;

(async () => {
  try {
    tableName = await getParameter("/bma2/dynamodb_table");
    bucketName = await getParameter("/bma2/s3_bucket");
    console.log("Loaded from Parameter Store:", { tableName, bucketName });
  } catch (err) {
    console.error("Failed to load parameters from SSM:", err);
  }
})();

// GET /images - list user’s images
router.get("/", authenticate, async (req, res) => {
  try {
    if (!tableName || !bucketName) {
      return res.status(500).json({ error: "App configuration not loaded yet" });
    }

    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#u = :user",
      ExpressionAttributeNames: { "#u": "username" },
      ExpressionAttributeValues: { ":user": req.user || "unknown-user" },
    });

    const data = await docClient.send(command);

    const userImages = await Promise.all(
      (data.Items || []).map(async item => {
        let presignedUrl = null;

        if (item.s3Key) {
          try {
            const getCmd = new GetObjectCommand({
              Bucket: bucketName,
              Key: item.s3Key,
            });
            presignedUrl = await getSignedUrl(s3Client, getCmd, { expiresIn: 300 }); // 5 mins
          } catch (err) {
            console.error("Presign error:", err);
          }
        }

        return {
          id: item.id,
          type: item.type,
          filter: item.filter,
          uploadedAt: item.uploadedAt,
          processedAt: item.processedAt,
          s3Url: presignedUrl, // always fresh
        };
      })
    );

    res.json({ images: userImages });
  } catch (err) {
    console.error("Failed to fetch images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = router;
