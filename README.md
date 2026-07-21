# CSE341 Project 2 - REST API with MongoDB

A complete REST API with CRUD functionality for managing items, built with Express.js, MongoDB, and comprehensive error handling.

## Features

- ✅ GET all items
- ✅ GET single item by ID
- ✅ POST create new item
- ✅ PUT update item
- ✅ DELETE remove item
- ✅ Input validation
- ✅ Error handling
- ✅ Swagger API documentation
- ✅ MongoDB integration

## Setup Instructions

### 1. Clone/Setup Project
```bash
npm install
```

### 2. Configure MongoDB
Create a new database in MongoDB Compass:
1. Open MongoDB Compass
2. Create a new database called `cse341_project2`
3. Note your MongoDB connection URI

### 3. Environment Variables
Create a `.env` file in the root directory. You can copy the example file first:
```bash
copy .env.example .env
```
Then update it with your MongoDB credentials:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/cse341_project2
NODE_ENV=development
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cse341_project2
```

> Do not commit your `.env` file. `.gitignore` already excludes it so your credentials stay private.

### 4. View API Documentation
Navigate to `http://localhost:3000/api-docs` to see the Swagger documentation, or inspect the raw spec at `http://localhost:3000/swagger.json`.

### 5. Render Deployment
Create a new Render web service for this repository and add the same environment variables to Render under `Environment` > `Environment Variables`: `PORT` and `MONGODB_URI`.

### 4. Run Locally
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

### 5. View API Documentation
Navigate to `http://localhost:3000/api-docs` to see the Swagger documentation

## API Endpoints

### Get All Items
```
GET /items
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Widget",
    "description": "A useful widget",
    "quantity": 10,
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
]
```

### Get Item by ID
```
GET /items/{id}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Widget",
  "description": "A useful widget",
  "quantity": 10,
  "createdAt": "2024-01-20T10:30:00.000Z"
}
```

**Response (404):**
```json
{ "message": "Item not found" }
```

### Create Item
```
POST /items
Content-Type: application/json

{
  "name": "Widget",
  "description": "A useful widget",
  "quantity": 10
}
```

**Validation Rules:**
- `name` (required): 2-100 characters
- `quantity` (required): Non-negative number
- `description` (optional): Max 500 characters

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Widget",
  "description": "A useful widget",
  "quantity": 10,
  "createdAt": "2024-01-20T10:30:00.000Z"
}
```

**Response (400):**
```json
{ "message": "Name is required and cannot be empty" }
```

### Update Item
```
PUT /items/{id}
Content-Type: application/json

{
  "name": "Updated Widget",
  "quantity": 15
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Widget",
  "description": "A useful widget",
  "quantity": 15,
  "createdAt": "2024-01-20T10:30:00.000Z"
}
```

**Response (404):**
```json
{ "message": "Item not found" }
```

### Delete Item
```
DELETE /items/{id}
```

**Response (200):**
```json
{ "message": "Item deleted successfully" }
```

**Response (404):**
```json
{ "message": "Item not found" }
```

## Testing

### Test with cURL

**Get all items:**
```bash
curl http://localhost:3000/items
```

**Create item:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","quantity":5,"description":"Test"}'
```

**Update item:**
```bash
curl -X PUT http://localhost:3000/items/{id} \
  -H "Content-Type: application/json" \
  -d '{"quantity":10}'
```

**Delete item:**
```bash
curl -X DELETE http://localhost:3000/items/{id}
```

### Test with Swagger UI
1. Go to `http://localhost:3000/api-docs`
2. Use the "Try it out" button on each endpoint
3. View responses in real-time

## Error Handling

The API includes comprehensive error handling:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Validation Error | Invalid input data |
| 400 | Invalid ID format | Malformed MongoDB ID |
| 404 | Item not found | Resource doesn't exist |
| 500 | Internal server error | Server error |

## Deploy to Render

### 1. Prepare Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Important:** Ensure `.gitignore` includes `.env` to prevent exposing credentials.

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account

### 3. Create New Web Service
1. Dashboard → New → Web Service
2. Select your GitHub repository
3. Configure:
   - **Name:** `cse341-project2` (or your choice)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Region:** Choose closest region

### 4. Add Environment Variables
Before deploying, add config vars:
1. Go to Settings → Environment
2. Add variables:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cse341_project2`

**Get MongoDB Atlas Connection String:**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Login to your cluster
3. Click "Connect" → "Drivers"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and database name

### 5. Deploy
1. Click "Create Web Service"
2. Render will automatically deploy from your GitHub repo
3. Your API will be available at `https://cse341-project2.onrender.com`

### 6. View Logs
- Dashboard → Your Service → Logs
- Check for any deployment errors

## Project Structure

```
cse341_project2/
├── controllers/
│   └── itemController.js      # Business logic for items
├── models/
│   └── item.js                # MongoDB schema definition
├── routes/
│   └── items.js               # API route definitions & validation
├── tests/
│   └── items.test.js          # Test suite
├── .env                       # Local environment variables
├── .env.example               # Example environment file
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
├── server.js                  # Express server setup
└── README.md                  # This file
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **swagger-jsdoc** - API documentation generation
- **swagger-ui-express** - Swagger UI

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**MongoDB connection error:**
- Verify MongoDB is running locally: `mongod`
- Check connection string in `.env`
- For Atlas, check IP whitelist in security settings

**Render deployment fails:**
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure `.env` is in `.gitignore`
- Check build command output

## License

This is a course project for CSE341.
