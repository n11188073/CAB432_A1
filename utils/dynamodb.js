// utils/dynamodb.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBDocumentClient.from(client);

// DynamoDB table name
const tableName = "b_m_a2";

/**
 * Save metadata into DynamoDB
 * @param {Object} item - The item to insert (must include partition key: qut-username)
 */
async function putItem(item) {
  try {
    if (!item["qut-username"] || !item.name) {
      throw new Error("Item must include 'qut-username' and 'name'");
    }

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,                          // Spread all provided fields
        uploadedAt: new Date().toISOString(), // Always add upload timestamp
      },
    });

    await docClient.send(command);
    console.log("DynamoDB item stored:", item);
  } catch (err) {
    console.error("DynamoDB error:", err);
    throw err;
  }
}

module.exports = { putItem };
