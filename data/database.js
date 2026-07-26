const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const getDbName = () => {
    if (process.env.DB_NAME && process.env.DB_NAME.trim()) {
        return process.env.DB_NAME.trim();
    }

    return 'project2';
};

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }

    if (!process.env.MONGODB_URL) {
        return callback(new Error('MONGODB_URL is not defined'));
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URL);
        const dbName = getDbName();
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