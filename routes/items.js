const express = require('express');
const router = express.Router();
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/items');

// Validation middleware
const validateCreateItem = (req, res, next) => {
    const { name, quantity } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Name is required and cannot be empty' });
    }
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
    }
    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }
    if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }

    next();
};

const validateUpdateItem = (req, res, next) => {
    if (req.body.name !== undefined) {
        if (req.body.name.trim() === '') {
            return res.status(400).json({ message: 'Name cannot be empty' });
        }
        if (req.body.name.length < 2 || req.body.name.length > 100) {
            return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
        }
    }
    if (req.body.quantity !== undefined) {
        if (typeof req.body.quantity !== 'number' || req.body.quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be a non-negative number' });
        }
    }
    if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }

    next();
};

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of items
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 */
router.get('/', getAllItems);
router.post('/', validateCreateItem, createItem);

/**
 * @openapi
 * /items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item found
 *       404:
 *         description: Item not found
 *       400:
 *         description: Invalid ID format
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.get('/:id', getItemById);
router.put('/:id', validateUpdateItem, updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
