const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URL);
        const dbName = process.env.DB_NAME || 'projects';
        database = client.db(dbName);
        callback(null, database);
    } catch (err) {
        callback(err);
    }
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};