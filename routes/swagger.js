const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const swaggerOptions = {
    customSiteTitle: 'Items API Docs',
    explorer: false
};

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

module.exports = router;