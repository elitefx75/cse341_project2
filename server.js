const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CSE341 Project 2 API',
            version: '1.0.0',
            description: 'CRUD API with MongoDB and Swagger documentation'
        },
        tags: [{ name: 'Items', description: 'Item management endpoints' }]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/items', require('./routes/items'));

app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.warn('Warning: MONGODB_URI is not set. Starting the server without MongoDB.');
        console.warn('Set MONGODB_URI in Render environment variables or your local .env file for full CRUD support.');
    } else {
        try {
            await mongoose.connect(mongoUri);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error(`MongoDB connection error connecting to ${mongoUri}:`, error.message || error);
            console.error('The server will continue to run, but CRUD routes will fail until MongoDB is reachable.');
        }
    }

    if (require.main === module) {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
