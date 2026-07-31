const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', isAuthenticated, usersController.create);
router.put('/:id', isAuthenticated, usersController.update);
router.delete('/:id', isAuthenticated, usersController.delete);

module.exports = router;
