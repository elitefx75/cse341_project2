const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const swaggerOptions = {
    customSiteTitle: 'Items API Docs',
    explorer: false,
    requestInterceptor: (req) => {
        const method = (req.method || 'GET').toUpperCase();

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            return fetch('/auth/status', { credentials: 'include' })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.loggedIn) {
                        window.location.href = '/login';
                        return Promise.reject(new Error('Login required'));
                    }
                    return req;
                })
                .catch(() => {
                    window.location.href = '/login';
                    return Promise.reject(new Error('Login required'));
                });
        }

        return req;
    }
};

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

module.exports = router;