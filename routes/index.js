const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.use('/', require('./swagger'));
router.use('/items', require('./items'));
router.use('/users', require('./users'));

module.exports = router;