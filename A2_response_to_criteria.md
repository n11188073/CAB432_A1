Assignment 2 - Cloud Services Exercises - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name: Bernardine Choi** 
- **Student number: n11188073** 
- **Partner name (if applicable): Madina Rezai**
- **Student number: n11381256**

- **Application name: Filter.Img (Image Processing App)** 

- **Two line description:Two line description: Filter.Img is a Node.js REST API that lets users securely upload, process and download images. It supports per-user authentication with JWT and offers basic filters like thumbnail, invert, and sepia.** 

- **EC2 instance name or ID: img_A2 (instance name = i-05e1da2a7e06724b3)**

------------------------------------------------

### Core - First data persistence service

- **AWS service name: S3** 

- **What data is being stored?: Image files (uploaded and processed images)** 
- **Why is this service suited to this data?: S3 offers safe storage, is well-suited for holding huge binary data, and permits temporary access via pre-signed URLs without disclosing login credentials.** 

- **Why is are the other services used not suitable for this data?: Large binary files cannot be stored in DynamoDB; doing so would be redundant and exceed size restrictions for pictures.**

- **Bucket/instance/table name: b-m-a2**

- **Video timestamp: 0.34**

- **Relevant files:**
**- utils/s3.js**
**- routes/upload.js**
**- routes/images.js**
**- static/src/script.js**

### Core - Second data persistence service

- **AWS service name: DynamoDB**

- **What data is being stored?: Image metadata, e.g. username, image IDs, image type, filter application,S3 key, S3 URL and timestamps** 

- **Why is this service suited to this data?: DynamoDB is suitable as it is a NoSQL database which is designed for quick access and key-based querying and is ideal for storing structured metadata.**

- **Why is are the other services used not suitable for this data?: S3 does not effectively enable structured queries and is only for binary items.**

- **Bucket/instance/table name: b_m_a2**

- **Video timestamp: 1:30**

- **Relevant files:**
**- utils/dynamodb.js**
**- routes/upload.js**
**- routes/images.js**

### Third data service

- **AWS service name:**  [eg. RDS]
- **What data is being stored?:** [eg video metadata]
- **Why is this service suited to this data?:** [eg. ]
- **Why is are the other services used not suitable for this data?:** [eg. Advanced video search requires complex querries which are not available on S3 and inefficient on DynamoDB]
- **Bucket/instance/table name:**
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names: b-m-a2**

- **Video timestamp: 1:58**

- **Relevant files:**
**- routes/upload.js**
**- routes/images.js**
**- utils/s3.js**
**- static/src/script.js**

### In-memory cache

- **ElastiCache instance name: filterimga2**
- **What data is being cached?: Images retrieved for a specific user (e.g., user glen) from the database but also works on mutliple users the TTL for cache is 5 min after 5 min the cache expires** 
- **Why is this data likely to be accessed frequently?:Because users may repeatedly request their own images or data, and in a real-world deployment, multiple users could be accessing the same frequently-requested data, making caching essential for performance and reduced database load.** 
- **Video timestamp: 2:25**
- **Relevant files:**
  **- index.js**
  **- utils/cache.js**

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?: Temporary image files in data/uploads and data/processed before being uploaded to S3** 
- **Why is this data not considered persistent state?: Image are permanently stored in S3; local copies are only temporary and can be recreated if lost** 
- **How does your application ensure data consistency if the app suddenly stops?: Permanent image data and metadata are in S3 and DynamoDB, so losing local temporary images does not affect the app** 
- **Relevant files:**
  **- routes/upload.js**
  **- routes/process.js** 
  **- utils/s3.js**
  **- utils/dynamodb.js**
  **- script.js**
    

### Graceful handling of persistent connections

- **Type of persistent connection and use:** [eg. server-side-events for progress reporting]
- **Method for handling lost connections:** [eg. client responds to lost connection by reconnecting and indicating loss of connection to user until connection is re-established ]
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:b_m_a2**
- **How are authentication tokens handled by the client?:When a user logs in via /login, Cognito issues an ID token (JWT). The client receives this token in the JSON response and includes it in the Authorization header (Bearer <token>) for future protected requests. Middleware on the server verifies the token before granting access.** 
- **Video timestamp: 4:30**
- **Relevant files:**
    **- routes/auth.js**
    **- routes/authMiddleware.js**
    **- static/src/script.js**

### Cognito multi-factor authentication

- **What factors are used for authentication: password (first factor: something they know) and email confrimation code for signUp and authentication code for login second factor (something they have) Email OTP (one-time password) is used. During login, if the user has MFA enabled, Cognito requires the user to provide a code sent to their email (EMAIL_OTP_CODE)** 
- **Video timestamp: 4:39**
- **Relevant files:**
    **- routes/auth.js**
    **- routes/authMiddleware.js**
    **- static/src/script.js**

### Cognito federated identities

- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups

- **Users added to the group "Admin" can delete images when they login the delete button appears on top of the images but for other users the button do not appear at all:**
- **Video timestamp: 5:42**
- **Relevant files:**
  **- routes/auth.js**
  **- routes/images.js**
  **- static/src/script.js**

### Core - DNS with Route53

- **Subdomain: record name: filterimg.cab432.com and value: ec2-13-211-108-24.ap-southeast-2.compute.amazonaws.com**
- **Video timestamp: 7:06**

### Parameter store

- **Parameter names: /bma2/s3_bucket and /bma2/dynamo_table** 
- **Video timestamp: 7:44**
- **Relevant files:**
  **- routes/upload.js**
  **- routes/process.js** 
  **- routes/images.js** 
  **- utils/parameters.js.js**
  **- .env**

### Secrets manager

- **Secrets names: "group14A2"**
- **Video timestamp:**
- **Relevant files:**
  **- secretmanagerA2/index.js**

### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -