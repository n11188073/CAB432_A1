Assignment 1 - REST API Project - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name: Bernardine Choi**
- **Student number: n11188073**
- **Application name: Image Processing**
- **Two line description:** 


Core criteria
------------------------------------------------

### Containerise the app

- **ECR Repository name: n11188073_a1**
- **Video timestamp:**
- **Relevant files:**
    - **Dockerfile**
    - **package.json**
    - **index.js**

### Deploy the container

- **EC2 instance ID: n11188073-A1**
- **Video timestamp:**

### User login

- **One line description: Users can log in with JWT authentication**
- **Video timestamp:**
- **Relevant files:**
    - **routes/auth.js**
    - **index.js**

### REST API

- **One line description: Using REST endpoints to upload, process, and list images**
- **Video timestamp:**
- **Relevant files:**
    - **routes/upload.js**
    - **routes/process.js**
    - **routes/images.js**
    - **index.js**

### Data types

- **One line description: The app stores uploaded and processed images**
- **Video timestamp:**
- **Relevant files:**
    - **routes/upload.js**
    - **roues/process.js**

#### First kind

- **One line description: Uploaded images**
- **Type: File (jpg, jpeg, png)**
- **Rationale: Main asset to upload and store data**
- **Video timestamp:**
- **Relevant files:**
    - **routes/upload.js**

#### Second kind

- **One line description: Processed images**
- **Type: Memory of JSON object**
- **Rationale: Keeps the owner, filename, filtering to images, timestamps of images**
- **Video timestamp:**
- **Relevant files:**
  - **routes/upload.js**

### CPU intensive task

 **One line description: Procesing images by utilising sharp to apply transformations of invert, sepia or thumbnail images**
- **Video timestamp:** 
- **Relevant files:**
    - **routes/process.js**

### CPU load testing

 **One line description: Requesting multiple requests to /process/:filename to apply filters repeatedly**
- **Video timestamp:** 
- **Relevant files:**
    - **Hoppscotch**

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### External API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Additional types of data

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Custom processing

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Infrastructure as code

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Upon request

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 