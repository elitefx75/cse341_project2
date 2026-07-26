const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/items');

router.get('/', itemsController.getAll);

router.get('/:id', itemsController.getSingle);

router.post('/', itemsController.create);

router.put('/:id', itemsController.update);

router.delete('/:id', itemsController.delete);

module.exports = router;