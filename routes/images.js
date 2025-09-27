// routes/images.js
const express = require("express");
const { authenticate } = require("./auth");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const router = express.Router();

// AWS setup
const region = "ap-southeast-2";
const tableName = "b_m_a2";

const ddbClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const s3Client = new S3Client({ region });
const bucketName = "b-m-a2";

// GET /images - list user’s images
router.get("/", authenticate, async (req, res) => {
  try {
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
              Key: item.s3Key, // store *object key*, not old presigned URL
            });
            presignedUrl = await getSignedUrl(s3Client, getCmd, { expiresIn: 300 }); // 5 mins
          } catch (err) {
            console.error("Presign error:", err);
          }
        }

        return {
          id: item.id,
          type: item.type, // uploaded | processed
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
