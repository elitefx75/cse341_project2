const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const getDbName = () => {
    if (process.env.DB_NAME && process.env.DB_NAME.trim()) {
        return process.env.DB_NAME.trim();
    }

    if (process.env.MONGODB_URL) {
        try {
            const parsedUrl = new URL(process.env.MONGODB_URL);
            const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
            if (pathSegments.length > 0) {
                return decodeURIComponent(pathSegments[0]);
            }
        } catch (err) {
            console.warn('Could not parse MongoDB URL database name, falling back to default.');
        }
    }

    return 'projects';
};

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
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