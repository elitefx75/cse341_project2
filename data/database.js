const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const getEnvValue = (key) => {
    return process.env[key] || (dotenv.parse && dotenv.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '.env'))) ? dotenv.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '.env')))[key] : undefined);
};

const getDbName = () => {
    const configuredDbName = getEnvValue('DB_NAME');
    if (configuredDbName && configuredDbName.trim()) {
        return configuredDbName.trim();
    }

    return 'project2';
};

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }

    const mongoUrl = getEnvValue('MONGODB_URL');
    if (!mongoUrl) {
        return callback(new Error('MONGODB_URL is not defined'));
    }

    try {
        const client = await MongoClient.connect(mongoUrl);
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