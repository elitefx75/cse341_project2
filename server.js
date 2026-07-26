const express = require('express');
const bodyparser = require('body-parser');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'origin, x-requested-with, content-type, accept, z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.error('Database init error:', err);
    } else {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
});
