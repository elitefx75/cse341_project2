const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/items');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.post('/', isAuthenticated, itemsController.create);
router.put('/:id', isAuthenticated, itemsController.update);
router.delete('/:id', isAuthenticated, itemsController.delete);

module.exports = router;